using server.Dto;
using server.Entities;
using server.Exceptions;
using server.Services.ProfileServices;
using server.Data;
using Microsoft.AspNetCore.Identity;
using Salesforce.Force;
using System.Text.Json;

namespace server.Services.SalesforceServices
{
    public class SalesforceService(
        IConfiguration configuration,
        UserManager<ApplicationUser> userManager,
        IHttpClientFactory httpClientFactory,
        IProfileService profileService) : ISalesforceService
    {
        private const string ApiVersion = "v59.0";
        private const string DefaultLoginUrl = "https://login.salesforce.com/services/oauth2/token";

        public bool IsUserSyncedToSalesforce(ApplicationUser user)
        {
            return !string.IsNullOrEmpty(user.SalesforceContactId);
        }

        public async Task<bool> SyncUserToSalesforceAsync(ApplicationUser user, SyncSalesforceProfileDto dto)
        {
            try
            {
                var forceClient = await AuthenticateAsync();

                var meSection = await profileService.GetMeSectionAsync(user.Id);
                var fName = GetAttributeValue(meSection, BuiltInAttributes.FirstName) ?? "Unknown";
                var lName = GetAttributeValue(meSection, BuiltInAttributes.LastName) ?? (string.IsNullOrEmpty(user.UserName) ? "Unknown" : user.UserName);
                var address = GetAttributeValue(meSection, BuiltInAttributes.Address);

                if (string.IsNullOrEmpty(user.SalesforceContactId))
                    await CreateAccountWithContactAsync(forceClient, user, dto, fName, lName, address);
                else
                    await UpdateExistingContactAsync(forceClient, user, dto, fName, lName, address);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Salesforce Sync Error: {ex.Message}");
                return false;
            }
        }

        private async Task<ForceClient> AuthenticateAsync()
        {
            var (accessToken, instanceUrl) = await RequestAccessTokenAsync();
            return new ForceClient(instanceUrl, accessToken, ApiVersion);
        }

        private async Task<(string AccessToken, string InstanceUrl)> RequestAccessTokenAsync()
        {
            var tokenRequest = BuildTokenRequest();
            var loginUrl = configuration["Salesforce:TokenUrl"] ?? throw new InvalidOperationException("Salesforce:TokenUrl is not configured.");

            var httpClient = httpClientFactory.CreateClient();
            var tokenResponse = await httpClient.PostAsync(loginUrl, tokenRequest);

            return await ParseTokenResponseAsync(tokenResponse);
        }

        private FormUrlEncodedContent BuildTokenRequest()
        {
            var clientId = configuration["Salesforce:ClientId"]
                ?? throw new InvalidOperationException("Salesforce:ClientId is not configured.");
            var clientSecret = configuration["Salesforce:ClientSecret"]
                ?? throw new InvalidOperationException("Salesforce:ClientSecret is not configured.");

            return new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "client_credentials"),
                new KeyValuePair<string, string>("client_id", clientId),
                new KeyValuePair<string, string>("client_secret", clientSecret)
            });
        }

        private static async Task<(string AccessToken, string InstanceUrl)> ParseTokenResponseAsync(
            HttpResponseMessage response)
        {
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new BadRequestException($"Failed to authenticate with Salesforce: {error}");
            }

            var tokenData = await JsonSerializer.DeserializeAsync<JsonElement>(
                await response.Content.ReadAsStreamAsync());

            var accessToken = tokenData.GetProperty("access_token").GetString();
            var instanceUrl = tokenData.GetProperty("instance_url").GetString();

            if (string.IsNullOrEmpty(accessToken) || string.IsNullOrEmpty(instanceUrl))
                throw new BadRequestException("Invalid token response from Salesforce.");

            return (accessToken, instanceUrl);
        }

        private async Task CreateAccountWithContactAsync(
            ForceClient forceClient, ApplicationUser user, SyncSalesforceProfileDto dto, string fName, string lName, string? address)
        {
            var accountId = await CreateAccountAsync(forceClient, user);

            try
            {
                var contactId = await CreateContactAsync(forceClient, user, dto, accountId, fName, lName, address);
                await SaveContactIdAsync(user, contactId);
            }
            catch
            {
                await forceClient.DeleteAsync("Account", accountId);
                throw;
            }
        }

        private static async Task<string> CreateAccountAsync(ForceClient forceClient, ApplicationUser user)
        {
            var account = new { Name = user.Email };
            var result = await forceClient.CreateAsync("Account", account);

            if (!result.Success) throw new BadRequestException("Failed to create Account in Salesforce.");
            return result.Id;
        }

        private static async Task<string> CreateContactAsync(
            ForceClient forceClient, ApplicationUser user, SyncSalesforceProfileDto dto, string accountId, string fName, string lName, string? address)
        {
            var contact = BuildContactPayload(user, dto, accountId, fName, lName, address);
            var result = await forceClient.CreateAsync("Contact", contact);

            if (!result.Success) throw new BadRequestException("Failed to create Contact in Salesforce.");
            return result.Id;
        }

        private static object BuildContactPayload(ApplicationUser user, SyncSalesforceProfileDto dto, string accountId, string fName, string lName, string? address)
        {
            return new
            {
                FirstName = fName,
                LastName = lName,
                Email = user.Email,
                Title = dto.JobTitle,
                Phone = dto.PhoneNumber,
                MailingStreet = address,
                Company_Name__c = dto.CompanyName,
                Industry_Name__c = dto.Industry,
                AccountId = accountId
            };
        }

        private async Task SaveContactIdAsync(ApplicationUser user, string contactId)
        {
            user.SalesforceContactId = contactId;
            await userManager.UpdateAsync(user);
        }

        private static async Task UpdateExistingContactAsync(
            ForceClient forceClient, ApplicationUser user, SyncSalesforceProfileDto dto, string fName, string lName, string? address)
        {
            var contactUpdate = new
            {
                FirstName = fName,
                LastName = lName,
                Title = dto.JobTitle,
                Phone = dto.PhoneNumber,
                Email = user.Email,
                MailingStreet = address,
                Company_Name__c = dto.CompanyName,
                Industry_Name__c = dto.Industry
            };
            await forceClient.UpdateAsync("Contact", user.SalesforceContactId!, contactUpdate);
        }

        private static string? GetAttributeValue(MeSectionDto meSection, string attributeName)
        {
            var attr = meSection.MeAttributes.FirstOrDefault(a => a.AttributeName == attributeName);
            if (attr == null) return null;
            if (attr.Value.ValueKind == JsonValueKind.String)
                return attr.Value.GetString();
            return attr.Value.ToString();
        }
    }
}
