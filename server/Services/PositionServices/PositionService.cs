using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.Exceptions;
using System.Linq.Expressions;

namespace server.Services.PositionServices
{
    public partial class PositionService(ApplicationDbContext db, IPositionAccessRuleService accessRuleService) : IPositionService
    {
        private async Task<Position> GetPositionById(Guid id)
            => await db.Positions.FirstOrDefaultAsync(p => p.Id == id) ?? throw new NotFoundException(nameof(Position), id);

        private async Task<Position> GetPositionWithDetailsById(Guid id)
            => await db.Positions.Include(p => p.PositionAttributes).Include(p => p.AccessRules).Include(p => p.TechnologyTags)
                .FirstOrDefaultAsync(p => p.Id == id) ?? throw new NotFoundException(nameof(Position), id);

        private static PositionDto MapToDto(Position position) 
            => new() { Id = position.Id, Title = position.Title, ShortDescription = position.ShortDescription, IsPublic = position.IsPublic, MaxProjects = position.MaxProjects, CreatedAt = position.CreatedAt };

        private static Expression<Func<Position, PositionDto>> MapToDtoExpr() 
            => p => new PositionDto { Id = p.Id, Title = p.Title, ShortDescription = p.ShortDescription, IsPublic = p.IsPublic, MaxProjects = p.MaxProjects, CreatedAt = p.CreatedAt };
    }
}