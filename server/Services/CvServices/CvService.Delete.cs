using System;
using System.Threading.Tasks;

namespace server.Services.CvServices;

public partial class CvService
{
    public async Task DeleteCvAsync(Guid cvId)
    {
        var cv = await FindCvOrThrowAsync(cvId);
        db.Cvs.Remove(cv);
        await db.SaveChangesAsync();
    }
}
