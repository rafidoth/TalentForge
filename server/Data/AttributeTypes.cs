

namespace server.Data
{
    public static class AttributeTypes
    {

        public const string String = "String";
        public const string Text = "Text";
        public const string Numeric = "Numeric";
        public const string Image = "Image";
        public const string Boolean = "Boolean";
        public const string Date = "Date";
        public const string Period = "Period";
        public const string OneToMany = "One of Many";
        public static string[] All = [
            String,
            Text,
            Image,
            Numeric,
            Date,
            Period,
            Boolean,
            OneToMany
        ];

    }
}