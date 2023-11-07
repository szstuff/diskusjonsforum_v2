using Thread = diskusjonsforum_v2.Models.Thread;

namespace diskusjonsforum_v2.DAL;

public interface IThreadRepository
{
    IEnumerable<Thread> GetAll();
    Thread GetThreadById(int threadId);
    Task <bool> Add(Thread thread);
    Task<bool>Update(Thread thread);
    Task Remove(Thread thread);
    Task SaveChangesAsync();
}
