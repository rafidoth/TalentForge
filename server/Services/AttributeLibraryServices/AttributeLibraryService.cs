using Microsoft.EntityFrameworkCore;
using server.Entities;
using server.ServiceResults;

namespace server.Services.AttributeLibraryServices
{
    public class AttributeLibraryService(ApplicationDbContext db)
    {

        public async Task<ServiceResult<AppAttribute>> CreateAsync(int typeId, string name, int categoryId)
        {
            var typeResult = await db.AttributeTypes.FindAsync(typeId);
            var categoryResult = await db.AttributeCategories.FindAsync(categoryId);
            return typeResult != null && categoryResult != null
                ? await SaveNewAttributeAsync(BuildAttribute(typeResult, name, categoryResult))
                : ServiceResult<AppAttribute>.Failure("Attribute type or category not found.", "NOT_FOUND");
        }

        private async Task<ServiceResult<AppAttribute>> SaveNewAttributeAsync(AppAttribute attribute)
        {
            db.Attributes.Add(attribute);
            await db.SaveChangesAsync();
            return ServiceResult<AppAttribute>.Success(attribute, "Attribute created successfully.");
        }

        private AppAttribute BuildAttribute(AttributeType type, string name, AttributeCategory category)
        {
            return new AppAttribute
            {
                Id = Guid.NewGuid(),
                Name = name,
                TypeId = type.Id,
                Type = type,
                CategoryId = category.Id,
                Category = category,
                IsBuiltin = false,
            };
        }


        public async Task<ServiceResult<AppAttribute>> UpdateAttributeAsync(
            Guid id, string? name, int? typeId, int? categoryId, uint version, List<string>? dropdownOptions)
        {
            var attribute = await FindWithNavigationsAsync(id);
            if (attribute == null)
                return ServiceResult<AppAttribute>.Failure("Attribute not found.", "NOT_FOUND");

            ApplyFieldUpdates(attribute, name, typeId, categoryId);
            SetVersion(attribute, version);

            if (dropdownOptions != null)
                ReplaceDropdownOptions(attribute, dropdownOptions);

            await db.SaveChangesAsync();
            await ReloadNavigationsAsync(attribute);
            return ServiceResult<AppAttribute>.Success(attribute, "Attribute updated successfully.");
        }

        private static void ApplyFieldUpdates(AppAttribute attribute, string? name, int? typeId, int? categoryId)
        {
            if (name is not null) attribute.Name = name;
            if (typeId is not null) attribute.TypeId = typeId;
            if (categoryId is not null) attribute.CategoryId = categoryId;
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


        public async Task<ServiceResult<bool>> DeleteAttributeAsync(Guid id)
        {
            var attribute = await db.Attributes.FindAsync(id);
            if (attribute == null)
                return ServiceResult<bool>.Failure("Attribute not found.", "NOT_FOUND");

            if (attribute.IsBuiltin)
                return ServiceResult<bool>.Failure("Built-in attributes cannot be deleted.", "FORBIDDEN");

            db.Attributes.Remove(attribute);
            await db.SaveChangesAsync();
            return ServiceResult<bool>.Success(true, "Attribute deleted successfully.");
        }


        public async Task<ServiceResult<AppAttribute>> GetByIdWithNavigationsAsync(Guid id)
        {
            var attribute = await FindWithNavigationsAsync(id);
            return attribute != null
                ? ServiceResult<AppAttribute>.Success(attribute, "Attribute retrieved successfully.")
                : ServiceResult<AppAttribute>.Failure("Attribute not found.", "NOT_FOUND");
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


        private async Task<AppAttribute?> FindWithNavigationsAsync(Guid id)
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

    }
}