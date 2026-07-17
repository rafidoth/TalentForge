using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.Exceptions;

namespace server.Services.PositionServices
{
    public class PositionTagsService(ApplicationDbContext db) : IPositionTagsService
    {
        public async Task<List<TagDto>> UpdateTagsOfPositionAsync(Guid posId, CreatePositionTagDto dto)
        {
            var position = await FindPositionOrThrowAsync(posId);
            await SyncTagsAsync(position, dto.TagIds);
            return MapTags(position.TechnologyTags);
        }

        public async Task<List<TagDto>> GetTagsOfPositionAsync(Guid posId)
        {
            var position = await FindPositionOrThrowAsync(posId);
            return MapTags(position.TechnologyTags);
        }

        private async Task<Position> FindPositionOrThrowAsync(Guid posId)
            => await db.Positions.Include(p => p.TechnologyTags).ThenInclude(t => t.Tag)
                 .FirstOrDefaultAsync(p => p.Id == posId) 
                 ?? throw new NotFoundException(nameof(Position), posId);

        private async Task SyncTagsAsync(Position pos, List<Guid> newTagIds)
        {
            RemoveOldTags(pos, newTagIds);
            AddNewTags(pos, newTagIds);
            await db.SaveChangesAsync();
        }

        private void RemoveOldTags(Position pos, List<Guid> newTagIds)
        {
            var toRemove = pos.TechnologyTags.Where(t => !newTagIds.Contains(t.TagId)).ToList();
            toRemove.ForEach(t => pos.TechnologyTags.Remove(t));
        }

        private void AddNewTags(Position pos, List<Guid> newTagIds)
        {
            var toAdd = newTagIds.Where(id => !pos.TechnologyTags.Any(t => t.TagId == id)).ToList();
            var tags = db.TechnologyTags.Where(t => toAdd.Contains(t.Id)).ToList();
            tags.ForEach(tag => pos.TechnologyTags.Add(new PositionTechnologyTag { TagId = tag.Id, Tag = tag }));
        }

        private List<TagDto> MapTags(IEnumerable<PositionTechnologyTag> tags)
            => tags.Select(t => new TagDto(t.TagId, t.Tag.Name)).ToList();
    }
}
