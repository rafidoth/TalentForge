namespace server.Dto;

public class UpdateCvDto
{
    public List<Guid> ChosenProjectIds { get; set; } = new();
    public bool IsPublished { get; set; }
}
