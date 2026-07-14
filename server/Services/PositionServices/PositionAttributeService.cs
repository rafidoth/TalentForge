using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.Exceptions;
using server.Services.AttributeLibraryServices;
using server.Utils;

namespace server.Services.PositionServices
{
    public class PositionAttributeService(
        ApplicationDbContext db,
        IPositionService positionService,
        IAttributeService attributeService
    ) : IPositionAttributeService
    {
        public async Task<PositionAttributeDto> CreateAsync(Guid positionId, CreatePositionAttributeDto dto)
        {
            await positionService.ExistsAsync(positionId);
            await attributeService.AttributeExists(dto.AttributeId);

            var maxOrder = await db.PositionAttributes
                .Where(pa => pa.PositionId == positionId)
                .MaxAsync(pa => (int?)pa.Order) ?? 0;
            var nextOrder = maxOrder + 1;

            var positionAttribute = new PositionAttribute
            {
                PositionId = positionId,
                AttributeId = dto.AttributeId,
                Order = nextOrder
            };

            await db.PositionAttributes.AddAsync(positionAttribute);
            await db.SaveChangesAsync();
            await db.Entry(positionAttribute).Reference(pa => pa.Attribute).LoadAsync();
            return MapToDto(positionAttribute, db);
        }

        public async Task<PagedResponse<PositionAttributeDto>> GetAllAsync(Guid positionId, int pageNumber = 1, int pageSize = 10)
        {
            await positionService.ExistsAsync(positionId);
            var query = BuildQuery(positionId);
            return await PagedResponse.CreateAsync(
                query,
                pageNumber,
                pageSize,
                maxPageSize: 10
            );
        }

        private IQueryable<PositionAttributeDto> BuildQuery(Guid positionId)
        {
            var query = db.PositionAttributes
                .AsNoTracking()
                .Where(pa => pa.PositionId == positionId)
                .Include(pa => pa.Attribute)
                    .ThenInclude(a => a.Category)
                .Include(pa => pa.Attribute)
                    .ThenInclude(a => a.Type)
                .OrderBy(pa => pa.Order)
                .Select(pa => MapToDto(pa, db));
            return query;
        }

        private async Task PositionAttributeExistsAsync(Guid positionId, Guid attributeId)
        {
            var exists = await db.PositionAttributes
                .AnyAsync(pa => pa.PositionId == positionId && pa.AttributeId == attributeId);
            if (!exists)
            {
                throw new NotFoundException("PositionAttribute", $"{positionId}-{attributeId}");
            }
        }

        private async Task CheckExistanceOfAttributeInPosition(Guid positionId, Guid attributeId)
        {
            await positionService.ExistsAsync(positionId);
            await attributeService.AttributeExists(attributeId);
            await PositionAttributeExistsAsync(positionId, attributeId);
        }

        public async Task DeleteAsync(Guid positionId, Guid attributeId)
        {
            await CheckExistanceOfAttributeInPosition(positionId, attributeId);
            var positionAttribute = await db.PositionAttributes
                .FirstOrDefaultAsync(pa => pa.PositionId == positionId && pa.AttributeId == attributeId);
            db.PositionAttributes.Remove(positionAttribute!);
            await db.SaveChangesAsync();
        }

        private static PositionAttributeDto MapToDto(
            PositionAttribute pa,
            ApplicationDbContext db
        )
        {
            var attr = pa.Attribute;
            var version = db.Entry(attr).Property<uint>("Version").CurrentValue;
            var attrDto = AttributeService.MapToDto(attr, db);
            return new PositionAttributeDto
            {
                Id = pa.AttributeId,
                Order = pa.Order,
                Attribute = attrDto,
                Version = version
            };
        }
    }
}