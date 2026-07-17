using server.Entities;
using server.Exceptions;

namespace server.Services.PositionServices
{
    public partial class PositionService
    {
        public async Task<bool> DeletePositionAsync(Guid id)
        {
            db.Positions.Remove(await db.Positions.FindAsync(id) ?? throw new NotFoundException(nameof(Position), id));
            await db.SaveChangesAsync();
            return true;
        }
    }
}
