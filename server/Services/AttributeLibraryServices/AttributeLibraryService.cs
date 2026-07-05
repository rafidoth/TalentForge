using Microsoft.EntityFrameworkCore;
using server.Entities;
using server.ServiceResults;

namespace server.Services.AttributeLibraryServices
{
    public class AttributeLibraryService(ApplicationDbContext db)
    {

        public async Task<AppAttribute?> CreateAsync(
            int typeId, string name,
            int categoryId, string? description,
            List<string>? dropdownOptions
        )
        {
            var typeResult = await db.AttributeTypes.FindAsync(typeId);
            var categoryResult = await db.AttributeCategories.FindAsync(categoryId);
            if (typeResult != null && categoryResult != null)
            {
                var newAttribute = BuildAttribute(typeResult, name, categoryResult, description);
                await SaveNewAttributeAsync(newAttribute);

                if (dropdownOptions != null && dropdownOptions.Count > 0)
                {
                    await CreateDropdownOptionsAsync(newAttribute, dropdownOptions);
                    await ReloadNavigationsAsync(newAttribute);
                }
                return newAttribute;
            }

            return null;
        }

        private async Task SaveNewAttributeAsync(AppAttribute attribute)
        {
            db.Attributes.Add(attribute);
            await db.SaveChangesAsync();
        }

        private AppAttribute BuildAttribute(AttributeType type, string name, AttributeCategory category, string? description)
        {
            return new AppAttribute
            {
                Id = Guid.NewGuid(),
                Name = name,
                TypeId = type.Id,
                Description = description,
                Type = type,
                CategoryId = category.Id,
                Category = category,
                IsBuiltin = false,
            };
        }

        private async Task CreateDropdownOptionsAsync(AppAttribute attribute, List<string> labels)
        {
            foreach (var label in labels)
            {
                var option = BuildDropdownOption(attribute.Id, label);
                db.AttributeDropdownOptions.Add(option);
            }
            await db.SaveChangesAsync();
        }

        private AttributeDropdownOption BuildDropdownOption(Guid attributeId, string label)
        {
            return new AttributeDropdownOption
            {
                Id = Guid.NewGuid(),
                AttributeId = attributeId,
                Label = label
            };
        }

        public async Task<AppAttribute?> UpdateAttributeAsync(
            Guid id, string? name, uint version, List<string>? dropdownOptions)
        {
            var attribute = await FindAttributeByIdAsync(id);
            if (attribute == null)
                return null;

            if (!String.IsNullOrEmpty(name)) attribute.Name = name;
            SetVersion(attribute, version);

            if (dropdownOptions != null)
                ReplaceDropdownOptions(attribute, dropdownOptions);

            await db.SaveChangesAsync();
            await ReloadNavigationsAsync(attribute);
            return attribute;
        }

        private void SetVersion(AppAttribute attribute, uint version)
        {
            db.Entry(attribute).Property<uint>("Version").OriginalValue = version;
        }

        private void ReplaceDropdownOptions(AppAttribute attribute, List<string> newLabels)
        {
            db.AttributeDropdownOptions.RemoveRange(attribute.DropdownOptions);
            foreach (var label in newLabels)
            {
                db.AttributeDropdownOptions.Add(new AttributeDropdownOption
                {
                    Id = Guid.NewGuid(),
                    AttributeId = attribute.Id,
                    Label = label
                });
            }
        }

        public async Task<bool> DeleteAttributeAsync(Guid id)
        {
            var attribute = await db.Attributes.FindAsync(id);
            if (attribute is null || attribute.IsBuiltin)
                return false;
            db.Attributes.Remove(attribute);
            await db.SaveChangesAsync();
            return true;
        }

        public async Task<ServiceResult<List<AppAttribute>>> SearchAttributesAsync(
            string? prefix, int? categoryId, string? recentlyUsedByUserId, int page, int pageSize)
        {
            var query = BuildSearchQuery(prefix, categoryId);

            if (recentlyUsedByUserId != null)
                query = SortByRecentlyUsed(query, recentlyUsedByUserId);

            var results = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            return ServiceResult<List<AppAttribute>>.Success(results, null);
        }

        private IQueryable<AppAttribute> BuildSearchQuery(string? prefix, int? categoryId)
        {
            IQueryable<AppAttribute> query = db.Attributes
                .Include(a => a.Type)
                .Include(a => a.Category)
                .Include(a => a.DropdownOptions);

            if (prefix is not null)
                query = query.Where(a => a.Name.StartsWith(prefix));

            if (categoryId is not null)
                query = query.Where(a => a.CategoryId == categoryId);

            return query;
        }

        private IQueryable<AppAttribute> SortByRecentlyUsed(IQueryable<AppAttribute> query, string userId)
        {
            var userAttributeIds = db.ProfileAttributes
                .Where(pa => pa.UserId == userId)
                .Select(pa => pa.AttributeId);

            return query.OrderByDescending(a => userAttributeIds.Contains(a.Id));
        }

        public async Task<ServiceResult<AttributeType>> GetAttributeTypeByNameAsync(string name)
        {
            var type = await db.AttributeTypes.FirstOrDefaultAsync(t => t.Name == name);
            return type != null
                ? ServiceResult<AttributeType>.Success(type, "Attribute type retrieved successfully.")
                : ServiceResult<AttributeType>.Failure("Attribute type not found.", "NOT_FOUND");
        }

        public async Task<ServiceResult<List<AttributeCategory>>> GetAllCategoriesAsync()
        {
            var categories = await db.AttributeCategories.ToListAsync();
            return ServiceResult<List<AttributeCategory>>.Success(categories, null);
        }

        public async Task<ServiceResult<AttributeCategory>> GetCategoryByNameAsync(string name)
        {
            var category = await db.AttributeCategories.FirstOrDefaultAsync(c => c.Name == name);
            return category != null
                ? ServiceResult<AttributeCategory>.Success(category, "Attribute category retrieved successfully.")
                : ServiceResult<AttributeCategory>.Failure("Attribute category not found.", "NOT_FOUND");
        }

        public async Task<AppAttribute?> FindAttributeByIdAsync(Guid id)
        {
            return await db.Attributes
                .Include(a => a.Type)
                .Include(a => a.Category)
                .Include(a => a.DropdownOptions)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        private async Task ReloadNavigationsAsync(AppAttribute attribute)
        {
            await db.Entry(attribute).Reference(a => a.Type).LoadAsync();
            await db.Entry(attribute).Reference(a => a.Category).LoadAsync();
            await db.Entry(attribute).Collection(a => a.DropdownOptions).LoadAsync();
        }

        public async Task<List<AppAttribute>> GetBuiltInAttributesAsync()
        {
            var attributes = await db.Attributes
                .Where(a => a.IsBuiltin)
                .ToListAsync();
            return attributes;

        }

        public async Task<AppAttribute?> GetAttributeByNameAsync(string name)
        {
            var attribute = await db.Attributes
                .Include(a => a.Type)
                .Include(a => a.Category)
                .Include(a => a.DropdownOptions)
                .FirstOrDefaultAsync(a => a.Name == name);
            return attribute;

        }

        public async Task<List<AttributeType>> GetAllAttributeTypesAsync()
        {
            var types = await db.AttributeTypes.ToListAsync();
            return types;
        }

        public async Task<List<AttributeCategory>> GetAllAttributeCategoriesAsync()
        {
            var categories = await db.AttributeCategories.ToListAsync();
            return categories;
        }
    }
}