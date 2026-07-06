using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Dto;
using server.Services.UserServices;

namespace server.Controllers
{
    [Authorize(Roles = $"{Roles.Admin}")]
    [ApiController]
    [Route("api/users")]
    public class UsersController(
        IUserService userService,
        ILogger<UsersController> logger

    ) : ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] UserQueryFilter filter)
        {
            var pagedResponse = await userService.GetUsersAsync(filter);
            logger.LogInformation("Retrieved users list : {@PagedResponse}", pagedResponse);
            return Ok(pagedResponse);
        }

        [HttpPost("block")]
        public async Task<IActionResult> BlockUser(UserManagementActionDto dto)
        {
            var result = await userService.BlockUserAsync(dto.UserIds);
            if (result.IsSuccess)
            {
                logger.LogInformation("Blocked users: {@UserIds}", dto.UserIds);
                return Ok(new { message = "User blocked successfully." });
            }
            logger.LogInformation("Failed to block users: {@UserIds}", dto.UserIds);
            return BadRequest(new { message = result.Message });
        }


        [HttpPost("unblock")]
        public async Task<IActionResult> UnblockUser(UserManagementActionDto dto)
        {
            var result = await userService.UnblockUserAsync(dto.UserIds);
            if (result.IsSuccess)
            {

                logger.LogInformation("Unblocked users: {@UserIds}", dto.UserIds);
                return Ok(new { message = "User unblocked successfully." });
            }
            logger.LogInformation("Failed to unblock users: {@UserIds}", dto.UserIds);
            return BadRequest(new { message = result.Message });
        }


        [HttpDelete]
        public async Task<IActionResult> DeleteUser(UserManagementActionDto dto)
        {
            var result = await userService.DeleteUserAsync(dto.UserIds);
            if (result.IsSuccess)
            {
                logger.LogInformation("Deleted users: {@UserIds}", dto.UserIds);
                return Ok(new { message = "User deleted successfully." });
            }
            logger.LogInformation("Failed to delete users: {@UserIds}", dto.UserIds);
            return BadRequest(new { message = result.Message });
        }

        [HttpPost("assign-role")]
        public async Task<IActionResult> AssignRoleToUsers([FromBody] UserManagementActionDto dto)
        {
            if (dto.RoleName == null || string.IsNullOrWhiteSpace(dto.RoleName))
                return BadRequest(new { message = "Role name is required." });
            var result = await userService.AssignRoleToUserAsync(dto.UserIds, dto.RoleName);
            if (result.IsSuccess)
            {
                logger.LogInformation("Assigned role to users: {@UserIds}", dto.UserIds);
                return Ok(new { message = "Role assigned successfully." });
            }
            logger.LogInformation("Failed to assign role to users: {@UserIds}", dto.UserIds);
            return BadRequest(new { message = result.Message });
        }
    }
}