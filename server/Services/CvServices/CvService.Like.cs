using Microsoft.EntityFrameworkCore;
using server.Entities;
using server.Exceptions;

namespace server.Services.CvServices;

public partial class CvService
{
    public async Task LikeCvAsync(Guid cvId, string recruiterId)
    {
        var cv = await FindCvOrThrowAsync(cvId);
        await EnsureNotLikedAsync(cvId, recruiterId);
        await AddLikeAsync(cv, recruiterId);
    }

    public async Task UnlikeCvAsync(Guid cvId, string recruiterId)
    {
        var cv = await FindCvOrThrowAsync(cvId);
        var like = await FindLikeOrThrowAsync(cvId, recruiterId);
        await RemoveLikeAsync(cv, like);
    }

    private async Task EnsureNotLikedAsync(Guid cvId, string rId)
    {
        if (await db.Set<CvLike>().AnyAsync(l => l.CvId == cvId && l.RecruiterId == rId))
            throw new ConflictException("You have already liked this CV.");
    }

    private async Task AddLikeAsync(Cv cv, string rId)
    {
        db.Set<CvLike>().Add(new CvLike { CvId = cv.Id, RecruiterId = rId, CreatedAt = DateTime.UtcNow });
        cv.LikeCount++;
        await db.SaveChangesAsync();
    }

    private async Task<CvLike> FindLikeOrThrowAsync(Guid cvId, string rId)
        => await db.Set<CvLike>().FirstOrDefaultAsync(l => l.CvId == cvId && l.RecruiterId == rId)
           ?? throw new NotFoundException("Like", cvId);

    private async Task RemoveLikeAsync(Cv cv, CvLike like)
    {
        db.Set<CvLike>().Remove(like);
        cv.LikeCount = Math.Max(0, cv.LikeCount - 1);
        await db.SaveChangesAsync();
    }
}
