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
        public async Task CreateBulkAsync(Guid positionId, CreatePositionAttributeDto dto)
        {
            await positionService.ExistsAsync(positionId);
            if (dto.AttributeIds == null || dto.AttributeIds.Length == 0)
            {
                throw new BadRequestException("At least one attribute ID must be provided.");
            }
            await attributeService.AllAttributesExistOrThrowAsync(dto.AttributeIds);
            var existingAttributeIds = await GetAttributeIdsOfPositionAsync(positionId, dto.AttributeIds);
            var attributesToAdd = GetAttributeIdsExcludingDuplicatesAndAlreadyAssociated(dto.AttributeIds, existingAttributeIds);

            if (attributesToAdd.Count == 0) return;

            var maxOrder = await GetMaxOrderAsync(positionId);
            var newPositionAttributes = new List<PositionAttribute>();
            foreach (var attributeId in attributesToAdd)
            {
                newPositionAttributes.Add(new PositionAttribute
                {
                    PositionId = positionId,
                    AttributeId = attributeId,
                    Order = maxOrder + 1
                });
                maxOrder++;
            }

            db.PositionAttributes.AddRange(newPositionAttributes);
            await db.SaveChangesAsync();
        }

        private List<Guid> GetAttributeIdsExcludingDuplicatesAndAlreadyAssociated(IEnumerable<Guid> attributeIds, List<Guid> existingAttributeIds)
        {
            return attributeIds
                .Distinct()
                .Except(existingAttributeIds)
                .ToList();
        }

        private async Task<List<Guid>> GetAttributeIdsOfPositionAsync(Guid positionId, IEnumerable<Guid> attributeIds)
        {
            var existingAttributeIds = await db.PositionAttributes
                .Where(pa => pa.PositionId == positionId && attributeIds.Contains(pa.AttributeId))
                .Select(pa => pa.AttributeId)
                .ToListAsync();

            return existingAttributeIds;
        }

        private async Task<int> GetMaxOrderAsync(Guid positionId)
        {
            var maxOrder = await db.PositionAttributes
                .Where(pa => pa.PositionId == positionId)
                .MaxAsync(pa => (int?)pa.Order) ?? 0;
            return maxOrder;
        }

        public async Task<PagedResponse<PositionAttributeDto>> GetAllAsync(Guid positionId, int pageNumber = 1, int pageSize = 10)
        {
            await positionService.ExistsAsync(positionId);
            var query = BuildQuery(positionId);
            return await PagedResponse.CreateAsync(
                query,
                pageNumber,
                pageSize,
                maxPageSize: 50
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

        public async Task DeleteBulkAsync(Guid positionId, DeletePositionAttributeDto dto)
        {
            await positionService.ExistsAsync(positionId);
            if (dto.AttributeIds == null || dto.AttributeIds.Length == 0)
            {
                throw new BadRequestException("At least one attribute ID must be provided.");
            }
            await attributeService.AllAttributesExistOrThrowAsync(dto.AttributeIds);

            var positionAttributes = await db.PositionAttributes
                .Where(pa => pa.PositionId == positionId && dto.AttributeIds.Contains(pa.AttributeId))
                .ToListAsync();

            if (positionAttributes.Count > 0)
            {
                db.PositionAttributes.RemoveRange(positionAttributes);
                await db.SaveChangesAsync();
            }
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