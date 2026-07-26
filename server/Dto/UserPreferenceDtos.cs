using System.ComponentModel.DataAnnotations;

namespace server.Dto
{
    public record UserPreferenceDto
    {
        public string Theme { get; init; } = "light";
        public string Language { get; init; } = "en";
    }

    public record UpdateThemeDto
    {
        [Required(ErrorMessage = "Theme is required.")]
        [AllowedValues("light", "dark", ErrorMessage = "Theme must be 'light' or 'dark'.")]
        public string Theme { get; init; } = "light";
    }

    public record UpdateLanguageDto
    {
        [Required(ErrorMessage = "Language is required.")]
        [AllowedValues("en", "bn", ErrorMessage = "Language must be 'en' or 'bn'.")]
        public string Language { get; init; } = "en";
    }
}
