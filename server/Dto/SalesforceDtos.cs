using System.ComponentModel.DataAnnotations;

namespace server.Dto
{
    public class SyncSalesforceProfileDto
    {
        [Required]
        public string CompanyName { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
    }
}
