using System.Text.Json;

namespace server.Data
{
    public static class JsonDeserializer
    {
        public static string ToString(string value)
        {
            if (string.IsNullOrEmpty(value)) return value;
            try
            {
                var doc = JsonDocument.Parse(value);
                if (doc.RootElement.ValueKind == JsonValueKind.String)
                {
                    return doc.RootElement.GetString() ?? value;
                }
                return value;
            }
            catch (JsonException)
            {
                return value;
            }
        }
    }
}
