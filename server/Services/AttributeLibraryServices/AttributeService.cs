using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.Exceptions;
using server.Utils;

namespace server.Services.AttributeLibraryServices;

public class AttributeService(ApplicationDbContext db) : IAttributeService
{
    public async Task AttributeExists(Guid attributeId)
    {
        var result = await db.Attributes.AnyAsync(a => a.Id == attributeId);
        if (!result)
        {
            throw new NotFoundException("Attribute", attributeId);
        }
    }
    public async Task<AttributeDto> CreateAsync(CreateAttributeDto dto)
    {
        var newAttribute = await GetNewAttribute(dto);
        AddDropdownOptionsIfExists(newAttribute, dto.DropdownOptions);
        await SaveNewAttributeAsync(newAttribute);
        await ReloadNavigationsAsync(newAttribute);
        return MapToDto(newAttribute, db);
    }

    private void AddDropdownOptionsIfExists(AppAttribute attribute, List<string>? dropdownOptions)
    {
        if (dropdownOptions != null && dropdownOptions.Count > 0)
        {
            AddDropdownOptions(attribute, dropdownOptions);
        }
    }

    private async Task<AppAttribute> SaveNewAttributeAsync(AppAttribute attribute)
    {
        db.Attributes.Add(attribute);
        await db.SaveChangesAsync();
        return attribute;
    }

    private async Task AlreadyExistsCheck(string name)
    {

        var exists = await db.Attributes.AnyAsync(a => a.Name == name);
        if (exists)
            throw new ConflictException($"An attribute with the name '{name}' already exists.");
    }

    private async Task<AttributeType> GetAttributeTypeByIdAsync(int typeId)
    {
        var type = await db.AttributeTypes.FindAsync(typeId) ??
            throw new NotFoundException(nameof(AttributeType), typeId);
        return type;
    }

    private async Task<AttributeCategory> GetAttributeCategoryByIdAsync(int categoryId)
    {
        var category = await db.AttributeCategories.FindAsync(categoryId) ??
            throw new NotFoundException(nameof(AttributeCategory), categoryId);
        return category;
    }

    private async Task<AppAttribute> GetNewAttribute(CreateAttributeDto dto)
    {
        await AlreadyExistsCheck(dto.Name);
        var type = await GetAttributeTypeByIdAsync(dto.TypeId);
        var category = await GetAttributeCategoryByIdAsync(dto.CategoryId);
        var newAttribute = BuildAttribute(type, dto.Name, category, dto.Description);
        return newAttribute;
    }

    private AppAttribute BuildAttribute(AttributeType type, string name, AttributeCategory category, string? description)
    {
        return new AppAttribute
        {
            Id = Guid.NewGuid(),
            Name = name,
            Description = description,
            TypeId = type.Id,
            Type = type,
            CategoryId = category.Id,
            Category = category,
            IsBuiltin = false,
        };
    }

    private void AddDropdownOptions(AppAttribute attribute, List<string> labels)
    {
        foreach (var label in labels)
        {
            db.AttributeDropdownOptions.Add(new AttributeDropdownOption
            {
                Id = Guid.NewGuid(),
                AttributeId = attribute.Id,
                Label = label
            });
        }
    }

    public async Task<AttributeDto> UpdateAsync(Guid id, UpdateAttributeDto dto)
    {
        using var transaction = await db.Database.BeginTransactionAsync();
        var attribute = await GetAttributeEntityByIdAsync(id);

        if (attribute.IsBuiltin)
            throw new ValidationException("Attribute", "Built-in attributes cannot be modified.");

        if (!string.IsNullOrWhiteSpace(dto.Name))
            attribute.Name = dto.Name;

        SetVersion(attribute, dto.Version);

        if (dto.DropdownOptions != null)
        {
            ReplaceDropdownOptions(attribute, dto.DropdownOptions);
        }

        try
        {
            await db.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new ConflictException("The attribute was modified by another user. Please refresh and try again.");
        }
        catch (DbUpdateException)
        {
            throw new ConflictException($"An attribute with the name '{dto.Name}' already exists.");
        }

        await ReloadNavigationsAsync(attribute);
        return MapToDto(attribute, db);
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

    public async Task<bool> DeleteAsync(Guid id)
    {
        var attribute = await GetAttributeEntityByIdAsync(id);

        if (attribute.IsBuiltin)
            throw new ValidationException("Attribute", "Built-in attributes cannot be deleted.");

        db.Attributes.Remove(attribute);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<AttributeDto> GetAttributeDtoByIdAsync(Guid id)
    {
        var attribute = await GetAttributeEntityByIdAsync(id);
        return MapToDto(attribute, db);
    }

    public async Task<AppAttribute> GetAttributeEntityByIdAsync(Guid id)
    {
        var attribute = await db.Attributes
            .Include(a => a.Type)
            .Include(a => a.Category)
            .Include(a => a.DropdownOptions)
            .FirstOrDefaultAsync(a => a.Id == id);

        return attribute ?? throw new NotFoundException(nameof(AppAttribute), id);
    }


    public async Task<PagedResponse<AttributeDto>> SearchAsync(AttributeSearchQueryDto dto)
    {
        var query = BuildSearchQuery(dto);
        var result = await PagedResponse.CreateAsync(
            query,
            dto.Page,
            dto.PageSize,
            maxPageSize: 50
        );
        return result;
    }

    private IQueryable<AttributeDto> BuildSearchQuery(AttributeSearchQueryDto dto)
    {
        var baseQuery = GetBaseAttributeQuery();
        var filteredQuery = AddSearchFilters(baseQuery, dto.Prefix, dto.CategoryId);
        var sortedQuery = ApplySorting(filteredQuery, dto.Recent);
        return MapQueryToAttributeDto(sortedQuery);
    }

    private IQueryable<AppAttribute> GetBaseAttributeQuery()
    {
        return db.Attributes
            .Include(a => a.Type)
            .Include(a => a.Category)
            .Include(a => a.DropdownOptions);
    }

    private IQueryable<AppAttribute> AddSearchFilters(IQueryable<AppAttribute> query, string? prefix, int? categoryId)
    {
        if (!string.IsNullOrWhiteSpace(prefix))
            query = query.Where(a => a.Name.ToLower().StartsWith(prefix.ToLower()));
        if (categoryId.HasValue)
            query = query.Where(a => a.CategoryId == categoryId.Value);
        return query;
    }

    private IQueryable<AppAttribute> ApplySorting(IQueryable<AppAttribute> query, bool recent)
    {
        if (recent)
            return query.OrderByDescending(a => a.CreatedAt).ThenByDescending(a => a.Id);
        return query;
    }

    private IQueryable<AttributeDto> MapQueryToAttributeDto(IQueryable<AppAttribute> query)
    {
        var q = query.Select(a => new AttributeDto
        {
            Id = a.Id,
            Name = a.Name,
            Description = a.Description ?? string.Empty,
            TypeId = a.TypeId ?? 0,
            TypeName = a.Type != null ? a.Type.Name : string.Empty,
            CategoryId = a.CategoryId ?? 0,
            CategoryName = a.Category != null ? a.Category.Name : string.Empty,
            IsBuiltin = a.IsBuiltin,
            DropdownOptions = a.DropdownOptions
                            .Select(o => new DropdownOptionDto(o.Id, o.Label))
                            .ToList(),
            Version = db.Entry(a).Property<uint>("Version").CurrentValue
        });
        return q;
    }

    public async Task<List<AttributeCategoryDto>> GetCategoriesAsync()
    {
        var categories = await db.AttributeCategories.ToListAsync();
        return categories.Select(c => new AttributeCategoryDto(c.Id, c.Name)).ToList();
    }

    public async Task<List<AttributeType>> GetAttributeTypesAsync()
    {
        var types = await db.AttributeTypes.ToListAsync();
        if (types == null || types.Count == 0)
            throw new NotFoundException(nameof(AttributeType), "No attribute types found.");
        return types;
    }

    public async Task<AttributeType> GetAttributeTypeAsync(string name)
    {
        var type = await db.AttributeTypes.FirstOrDefaultAsync(t => t.Name == name);
        return type ?? throw new NotFoundException(nameof(AttributeType), name);
    }

    public async Task<AttributeCategory> GetCategoryAsync(string name)
    {
        var category = await db.AttributeCategories.FirstOrDefaultAsync(c => c.Name == name);
        return category ?? throw new NotFoundException(nameof(AttributeCategory), name);
    }

    public async Task<List<AppAttribute>> GetBuiltInAttributesAsync()
    {
        var attributes = await db.Attributes
            .Where(a => a.IsBuiltin)
            .ToListAsync();

        if (attributes == null || attributes.Count == 0)
            throw new NotFoundException("Built-in Attributes", "No built-in attributes found.");

        return attributes;
    }

    public async Task<AppAttribute> GetAttributeByNameAsync(string name)
    {
        var attribute = await db.Attributes
            .Include(a => a.Type)
            .Include(a => a.Category)
            .Include(a => a.DropdownOptions)
            .FirstOrDefaultAsync(a => a.Name == name);

        return attribute ?? throw new NotFoundException(nameof(AppAttribute), name);
    }


    private async Task ReloadNavigationsAsync(AppAttribute attribute)
    {
        await db.Entry(attribute).Reference(a => a.Type).LoadAsync();
        await db.Entry(attribute).Reference(a => a.Category).LoadAsync();
        await db.Entry(attribute).Collection(a => a.DropdownOptions).LoadAsync();
    }

    public static AttributeDto MapToDto(AppAttribute attr, ApplicationDbContext db)
    {
        var version = db.Entry(attr).Property<uint>("Version").CurrentValue;
        return new AttributeDto
        {
            Id = attr.Id,
            Name = attr.Name,
            TypeId = attr.TypeId ?? 0,
            TypeName = attr.Type?.Name ?? string.Empty,
            CategoryId = attr.CategoryId ?? 0,
            CategoryName = attr.Category?.Name ?? string.Empty,
            IsBuiltin = attr.IsBuiltin,
            DropdownOptions = attr.DropdownOptions
                .Select(o => new DropdownOptionDto(o.Id, o.Label))
                .ToList(),
            Version = version
        };
    }
}
