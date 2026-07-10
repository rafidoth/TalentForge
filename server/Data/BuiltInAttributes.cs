using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using server.Entities;
using server.Services.AttributeLibraryServices;

namespace server.Data;

public class BuiltInAttributes(IAttributeService attrs)
{
    public static readonly string FirstName = "First Name";
    public static readonly string LastName = "Last Name";
    public static readonly string Address = "Address";
    public static readonly string ProfilePhoto = "Profile Photo";
    public async Task<List<AppAttribute>> GetAsync()
    {
        int piCategoryId = (await attrs.GetCategoryAsync("Personal Information")).Id;
        int stringTypeId = (await attrs.GetAttributeTypeAsync(AttributeTypes.String)).Id;
        int imageTypeId = (await attrs.GetAttributeTypeAsync(AttributeTypes.Image)).Id;

        if (piCategoryId == 0 || stringTypeId == 0 || imageTypeId == 0)
        {
            throw new Exception("Failed to retrieve required attribute type or category IDs.");
        }

        return
        [
            new AppAttribute
            {
                Name = FirstName,
                TypeId = stringTypeId,
                CategoryId = piCategoryId,
                IsBuiltin = true
            },
            new AppAttribute
            {
                Name = LastName,
                TypeId = stringTypeId,
                CategoryId = piCategoryId,
                IsBuiltin = true
            },
            new AppAttribute
            {
                Name = Address,
                TypeId = stringTypeId,
                CategoryId = piCategoryId,
                IsBuiltin = true
            },

            new AppAttribute
            {
                Name = ProfilePhoto,
                TypeId = imageTypeId,
                CategoryId = piCategoryId,
                IsBuiltin = true
            },
        ];
    }
}