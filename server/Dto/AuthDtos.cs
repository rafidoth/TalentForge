using server.Data;

namespace server.Dto;


public record RegisterDto(
      string Email,
      string Password,
      string FirstName,
      string LastName,
      string Location
   );
public record RegisterResponse(bool Success, string UserId, string Role = Roles.Candidate);
public record LoginDto(string Email, string Password);

public record LoginResponse(bool Success, string UserId, string Role = Roles.Candidate);
public record ExternalLoginResponse(
   bool Success,
   string UserId,
   string Role = Roles.Candidate
);
