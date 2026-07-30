using server.Dto;
using server.Entities;

namespace server.Services.SalesforceServices
{
    public interface ISalesforceService
    {
        Task<bool> SyncUserToSalesforceAsync(ApplicationUser user, SyncSalesforceProfileDto dto);
        bool IsUserSyncedToSalesforce(ApplicationUser user);
    }
}
