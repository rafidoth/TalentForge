using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using server.Dto;
using server.ServiceResults;

namespace server.Services.UserServices
{
    public interface IUserService
    {
        Task<PagedResponse<UserDto>> GetUsersAsync(UserQueryFilter filter);
        Task<ServiceResult<bool>> BlockUserAsync(List<string> userIds);
        Task<ServiceResult<bool>> UnblockUserAsync(List<string> userIds);
        Task<ServiceResult<bool>> AssignRoleToUserAsync(List<string> userIds, string roleName);
        Task<ServiceResult<bool>> DeleteUserAsync(List<string> userIds);

    }
}