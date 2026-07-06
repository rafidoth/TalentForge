using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dto;
using server.Entities;
using server.ServiceResults;

namespace server.Services.UserServices
{
    public class UserService(UserManager<ApplicationUser> userManager, ApplicationDbContext db) : IUserService
    {
        public async Task<PagedResponse<UserDto>> GetUsersAsync(UserQueryFilter filter)
        {
            var pageNumber = Math.Max(1, filter.PageNumber);
            var pageSize = Math.Clamp(filter.PageSize, 1, 20);

            var query = userManager.Users.AsNoTracking();
            query = ApplySearchFilter(query, filter.Search!);
            query = ApplySortEmailFilter(query, filter.SortBy!);

            var totalRecords = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);

            if (totalPages > 0)
                pageNumber = Math.Min(pageNumber, totalPages);

            var users = await GetUsersList(query, pageNumber, pageSize);
            return new PagedResponse<UserDto>
            {
                Data = users!,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = totalPages,
                TotalRecords = totalRecords
            };
        }

        private async Task<List<UserDto>?> GetUsersList(
            IQueryable<ApplicationUser> query,
            int pageNumber,
            int pageSize
        )
        {
            var users = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email ?? string.Empty,
                    JoinedAt = u.JoinedAt,
                    Status = u.Status,
                    LastLoginAt = u.LastLoginAt,
                    Role = db.UserRoles
                        .Where(ur => ur.UserId == u.Id)
                        .Join(db.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.Name)
                        .FirstOrDefault() ?? "Unknown",
                    Method = db.UserLogins
                    .Where(ul => ul.UserId == u.Id)
                    .Select(ul => ul.LoginProvider)
                    .FirstOrDefault() ?? "Email"
                })
                .ToListAsync();
            return users;
        }

        private IQueryable<ApplicationUser> ApplySearchFilter(IQueryable<ApplicationUser> query, string search)
        {
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(u =>
                    (u.UserName != null && u.UserName.ToLower().Contains(search)) ||
                    (u.Email != null && u.Email.ToLower().Contains(search)));
            }
            return query;
        }

        private IQueryable<ApplicationUser> ApplySortEmailFilter(IQueryable<ApplicationUser> query, string sortBy)
        {
            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                if (sortBy.Equals("email desc", StringComparison.OrdinalIgnoreCase))
                    query = query.OrderByDescending(u => u.Email);
                else query = query.OrderBy(u => u.Email);
            }
            return query;
        }
        public async Task<ServiceResult<bool>> DeleteUserAsync(List<string> userIds)
        {
            if (userIds == null || userIds.Count == 0)
                return ServiceResult<bool>.Failure("No user IDs provided.", "NO_USER_IDS");
            try
            {
                int rowsAffected = await db.Users
                    .Where(u => userIds.Contains(u.Id))
                    .ExecuteDeleteAsync();

                if (rowsAffected != userIds.Distinct().Count())
                    throw new Exception("Not all users were deleted successfully, some failed.");

                return ServiceResult<bool>.Success(true, "Users deleted successfully.");
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.Failure(ex.Message, "DELETING_USERS_FAILED");
            }
        }

        public async Task<ServiceResult<bool>> BlockUserAsync(List<string> userIds)
        {
            return await UpdateUserStatusAsync(userIds, UserStatus.Blocked);
        }

        public async Task<ServiceResult<bool>> UnblockUserAsync(List<string> userIds)
        {
            return await UpdateUserStatusAsync(userIds, UserStatus.Active);

        }

        private async Task<ServiceResult<bool>> UpdateUserStatusAsync(List<string> userIds, string newStatus)
        {
            if (userIds == null || userIds.Count == 0)
                return ServiceResult<bool>.Failure("No user IDs provided.", "NO_USER_IDS");
            try
            {
                var users = await db.Users.Where(u => userIds.Contains(u.Id)).ToListAsync();
                foreach (var user in users)
                    user.Status = newStatus;
                int rowsAffected = await db.SaveChangesAsync();
                if (rowsAffected != userIds.Distinct().Count())
                    throw new Exception("Not all users status were updated successfully, some failed.");
                return ServiceResult<bool>.Success(true, "Users updated successfully.");
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.Failure(ex.Message, "UPDATING_USERS_FAILED");
            }
        }


        public async Task<ServiceResult<bool>> AssignRoleToUserAsync(
                List<string> userIds,
                [AllowedValues(Roles.Candidate, Roles.Recruiter, Roles.Admin)] string role
            )
        {
            try
            {
                var uRoles = await db.UserRoles
                    .Where(ur => userIds.Contains(ur.UserId))
                    .ToListAsync();
                var newRole = await db.Roles.FirstOrDefaultAsync(r => r.Name == role);

                db.UserRoles.RemoveRange(uRoles);
                var newUserRoles = userIds.Select(userId => new IdentityUserRole<string>
                {
                    UserId = userId,
                    RoleId = newRole!.Id
                });
                await db.UserRoles.AddRangeAsync(newUserRoles);
                await db.SaveChangesAsync();
                return ServiceResult<bool>.Success(true, "Role assigned successfully.");
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.Failure(ex.Message, "ROLE_ASSIGNMENT_FAILED");
            }
        }

    }
}