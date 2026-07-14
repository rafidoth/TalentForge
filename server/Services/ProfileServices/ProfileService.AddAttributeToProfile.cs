using System.Text.Json;
using server.Data;
using server.Dto;
using server.Entities;

namespace server.Services.ProfileServices
{
    public partial class ProfileService
    {
        public async Task AddAttributeToProfileAsync(string userId, AddProfileAttributeDto dto)
        {

            var attribute = await attrs.GetAttributeEntityByIdAsync(dto.AttributeId);
            ValidateAttributeValueType(attribute, dto.Value);
            var profileAttribute = BuildProfileAttribute(dto.Value, userId, attribute);
            await db.ProfileAttributes.AddAsync(profileAttribute);
            await db.SaveChangesAsync();
        }

        private void ValidateAttributeValueType(AppAttribute attribute, JsonElement value)
        {
            ValidateStringRelatedTypes(value, attribute);

            switch (attribute.Type!.Name)
            {

                case AttributeTypes.Numeric:
                    ValidateNumericValue(value, attribute);
                    break;
                case AttributeTypes.Boolean:
                    ValidateBooleanValue(value, attribute);
                    break;
                case AttributeTypes.Date:
                    ValidateDateValue(value, attribute);
                    break;
                case AttributeTypes.Period:
                    ValidatePeriodValue(value, attribute);
                    break;
                case AttributeTypes.OneToMany:
                    ValidateOneToManyValue(value, attribute);
                    break;
                default:
                    throw new Exception($"Unsupported attribute type '{attribute.Type.Name}' for attribute '{attribute.Name}'.");
            }
        }

        private void ValidateStringRelatedTypes(JsonElement value, AppAttribute attribute)
        {
            var stringRelatedTypes = new List<string> {
                AttributeTypes.String,
                AttributeTypes.Text,
                AttributeTypes.Image,
            };

            if (stringRelatedTypes.Contains(attribute.Type!.Name))
            {
                ValidateStringValue(value, attribute);
            }
        }


        private void ValidateStringValue(JsonElement value, AppAttribute attribute)
        {
            if (value.ValueKind != JsonValueKind.String)
                throw new Exception($"Invalid value type for attribute '{attribute.Name}'. Expected a string representing the image URL.");
        }

        private void ValidateNumericValue(JsonElement value, AppAttribute attribute)
        {
            if (value.ValueKind != JsonValueKind.Number)
                throw new Exception($"Invalid value type for attribute '{attribute.Name}'. Expected a number.");
        }

        private void ValidateBooleanValue(JsonElement value, AppAttribute attribute)
        {
            if (value.ValueKind != JsonValueKind.True && value.ValueKind != JsonValueKind.False)
                throw new Exception($"Invalid value type for attribute '{attribute.Name}'. Expected a boolean.");
        }

        private void ValidateDateValue(JsonElement value, AppAttribute attribute)
        {
            if (value.ValueKind != JsonValueKind.String || !DateTime.TryParse(value.GetString(), out _))
                throw new Exception($"Invalid value type for attribute '{attribute.Name}'. Expected a date string.");
        }

        private void ValidatePeriodValue(JsonElement value, AppAttribute attribute)
        {
            if (value.ValueKind != JsonValueKind.Array)
                throw new Exception($"Invalid value type for attribute '{attribute.Name}'. Expected an array with 2 date values (start, end).");

            var items = value.EnumerateArray().ToList();

            if (items.Count != 2)
                throw new Exception($"Invalid value for attribute '{attribute.Name}'. Expected exactly 2 items: [start, end].");

            if (items[0].ValueKind != JsonValueKind.String || !DateTime.TryParse(items[0].GetString(), out DateTime startDate))
                throw new Exception($"Invalid start date for attribute '{attribute.Name}'. Expected a date string.");

            if (items[1].ValueKind != JsonValueKind.String || !DateTime.TryParse(items[1].GetString(), out DateTime endDate))
                throw new Exception($"Invalid end date for attribute '{attribute.Name}'. Expected a date string.");

            if (startDate > endDate)
                throw new Exception($"Invalid period for attribute '{attribute.Name}'. Start date must be before or equal to end date.");
        }

        private void ValidateOneToManyValue(JsonElement value, AppAttribute attribute)
        {
            if (value.ValueKind != JsonValueKind.Array)
                throw new Exception($"Invalid value type for attribute '{attribute.Name}'. Expected an array of strings representing the selected options.");

            foreach (var item in value.EnumerateArray())
            {
                if (item.ValueKind != JsonValueKind.String)
                    throw new Exception($"Invalid value type for attribute '{attribute.Name}'. Expected all items in the array to be strings.");
            }
        }

    }
}