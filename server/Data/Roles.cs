namespace server.Data;

public static class Roles
{
    public const string Admin = "Administrator";
    public const string Candidate = "Candidate";
    public const string Recruiter = "Recruiter";

    public const string AdminOrRecruiter = Admin + "," + Recruiter;

}
