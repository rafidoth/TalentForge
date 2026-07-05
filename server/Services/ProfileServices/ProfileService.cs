using Microsoft.AspNetCore.Routing.Constraints;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dto;
using server.Entities;
using server.ServiceResults;
using server.Services.AttributeLibraryServices;

namespace server.Services.ProfileServices
{
    public class ProfileService(
        ApplicationDbContext db,
        IAttributeService attrs,
        IConfiguration cfg,
        ILogger<ProfileService> logger
        ) : IProfileService
    {
        public Task<ServiceResult<ProfileAttributeDto>> AddAttributeToProfileAsync(string userId, AddProfileAttributeDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<AutoSaveResultDto>> AutoSaveAsync(string userId, AutoSaveDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<ProjectDto>> CreateProjectAsync(string userId, CreateProjectDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<bool>> DeleteProjectAsync(string userId, Guid projectId)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<FullProfileDto>> GetFullProfileAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<List<ProfileAttributeDto>>> GetInfoSectionAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<MeSectionDto>> GetMeSectionAsync(string userId)
        {
            try
            {
                var meAttributesRaw = await db.ProfileAttributes
                .Where(pa => pa.UserId == userId && pa.Attribute.Category!.Name == "Personal Information")
                .Select(pa => new
                {
                    pa.Id,
                    pa.AttributeId,
                    Name = pa.Attribute.Name,
                    TypeName = pa.Attribute.Type!.Name,
                    CategoryName = pa.Attribute.Category!.Name,
                    pa.Value,
                    Version = EF.Property<uint>(pa, "Version")
                })
                .ToListAsync();

                var meAttributes = meAttributesRaw.Select(pa => new ProfileAttributeDto(
                    pa.Id,
                    pa.AttributeId,
                    pa.Name,
                    pa.TypeName,
                    pa.CategoryName,
                    JsonDeserializer.ToString(pa.Value),
                    null,
                    pa.Version
                )).ToList();
                return ServiceResult<MeSectionDto>.Success(new MeSectionDto(meAttributes), "Me section retrieved successfully.");
            }
            catch (Exception ex)
            {
                return ServiceResult<MeSectionDto>.Failure($"Failed to retrieve Me section: {ex.Message}", "RETRIEVAL_FAILED");
            }
        }

        public Task<ServiceResult<List<ProjectDto>>> GetProjectsAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<bool>> RemoveAttributeFromProfileAsync(string userId, Guid profileAttributeId)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<MeSectionDto>> UpdateMeSectionAsync(string userId, UpdateMeSectionDto dto)
        {
            try
            {
                if (dto.Attributes == null || dto.Attributes.Count == 0)
                {
                    return ServiceResult<MeSectionDto>.Failure("No attributes provided for update.", "VALIDATION_ERROR");
                }

                var attributeIds = dto.Attributes.Select(a => a.ProfileAttributeId).ToList();

                // Load the profile attributes that belong to this user
                var profileAttributes = await db.ProfileAttributes
                    .Include(pa => pa.Attribute)
                    .Where(pa => pa.UserId == userId && attributeIds.Contains(pa.Id))
                    .ToListAsync();

                // Verify all requested attributes were found and belong to the user
                if (profileAttributes.Count != dto.Attributes.Count)
                {
                    var foundIds = profileAttributes.Select(pa => pa.Id).ToHashSet();
                    var missingIds = attributeIds.Where(id => !foundIds.Contains(id)).ToList();
                    return ServiceResult<MeSectionDto>.Failure(
                        $"One or more profile attributes not found: {string.Join(", ", missingIds)}",
                        "NOT_FOUND"
                    );
                }

                // Apply updates and set the original Version for optimistic concurrency
                foreach (var update in dto.Attributes)
                {
                    var pa = profileAttributes.First(p => p.Id == update.ProfileAttributeId);
                    pa.Value = System.Text.Json.JsonSerializer.Serialize(update.Value);
                    pa.UpdatedAt = DateTime.UtcNow;

                    // Set the original Version from the client so EF Core's concurrency check
                    // compares it against the database value on save
                    db.Entry(pa).Property<uint>("Version").OriginalValue = update.Version;
                }

                await db.SaveChangesAsync();

                // Re-fetch the updated Me section to return fresh data with new versions
                return await GetMeSectionAsync(userId);
            }
            catch (DbUpdateConcurrencyException)
            {
                return ServiceResult<MeSectionDto>.Failure(
                    "The data was modified by another request. Please refresh and try again.",
                    "CONFLICT"
                );
            }
            catch (Exception ex)
            {
                return ServiceResult<MeSectionDto>.Failure(
                    $"Failed to update Me section: {ex.Message}",
                    "UPDATE_FAILED"
                );
            }
        }

        public async Task<ServiceResult<bool>> CreateMeSectionAsync(
            string FName,
            string LName,
            string Location,
            string userId
        )
        {
            try
            {
                var dicebear_url = cfg.GetValue<string>("DiceBear:profile_image");
                if (string.IsNullOrEmpty(dicebear_url))
                {
                    throw new Exception("DiceBear profile image URL is not configured.");
                }
                var profileAttributes = await CreateProfileAttributesAsync(
                    userId, FName, LName, Location, dicebear_url
                );

                await db.ProfileAttributes.AddRangeAsync(profileAttributes);
                await db.SaveChangesAsync();
                return ServiceResult<bool>.Success(true, "Profile me section created successfully.");
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.Failure($"Failed to create Me section: {ex.Message}", "CREATION_FAILED");
            }
        }

        private async Task<List<ProfileAttribute>> CreateProfileAttributesAsync(
            string userId,
            string FName,
            string LName,
            string Location,
            string dicebear_url
        )
        {
            var fna = (await attrs.GetAttributeByNameAsync(BuiltInAttributes.FirstName)).Data;
            var lna = (await attrs.GetAttributeByNameAsync(BuiltInAttributes.LastName)).Data;
            var loc = (await attrs.GetAttributeByNameAsync(BuiltInAttributes.Address)).Data;
            var pia = (await attrs.GetAttributeByNameAsync(BuiltInAttributes.ProfilePhoto)).Data;

            if (fna == null || lna == null || loc == null || pia == null)
            {
                logger.LogInformation("Missing required attributes for user {UserId}: First Name: {FName}, Last Name: {LName}, Location: {Location}, Profile Photo: {ProfilePhoto}", userId, fna, lna, loc, pia);
                throw new Exception("One or more required attributes are missing.");
            }

            return
            [
                BuildProfileAttribute(FName, userId, fna),
                BuildProfileAttribute(LName, userId, lna),
                BuildProfileAttribute(Location, userId, loc),
                BuildProfileAttribute($"{dicebear_url}{userId.Substring(0, 4)}", userId, pia)
            ];
        }

        private ProfileAttribute BuildProfileAttribute(string value, string userId, AppAttribute attr)
        {
            return new ProfileAttribute
            {
                UserId = userId,
                AttributeId = attr.Id,
                Value = System.Text.Json.JsonSerializer.Serialize(value),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

        }




        public Task<ServiceResult<ProfileAttributeDto>> UpdateProfileAttributeValueAsync(string userId, UpdateProfileAttributeValueDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<ProjectDto>> UpdateProjectAsync(string userId, Guid projectId, UpdateProjectDto dto)
        {
            throw new NotImplementedException();
        }
    }
}