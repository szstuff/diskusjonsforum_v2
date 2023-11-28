using diskusjonsforum_v2.Models;
using Microsoft.EntityFrameworkCore;
using Thread = diskusjonsforum_v2.Models.Thread;

namespace diskusjonsforum_v2.DAL;

public class ThreadRepository : IThreadRepository
{
    private readonly ThreadDbContext _threadDbContext;
    private readonly ILogger<ThreadRepository> _logger;

    public ThreadRepository(ThreadDbContext threadDbContext, ILogger<ThreadRepository> logger)
    {
        _threadDbContext = threadDbContext;
        _logger = logger;
    }

    public IEnumerable<Thread> GetAll()
    {
        return _threadDbContext.Threads
            .Include(t => t.ThreadComments)
            .ToList();
    }

    public Thread GetThreadById(int threadId)
    {
        var thread = _threadDbContext.Threads
            .Include(t => t.ThreadComments)
            .FirstOrDefault(t => t.ThreadId == threadId);
        _threadDbContext.Entry(thread);
            return thread;
    }

    public async Task<bool> Add(Thread thread)
    {
        try
        {
            _threadDbContext.Threads.Add(thread);
            await _threadDbContext.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError("[ThreadRepository] creation failed for thread {@thread}, error message: {e}", thread, e.Message);
            return false;
        }
    }

    public async Task<bool> Update(Thread thread)
    {
        _threadDbContext.Threads.Update(thread);
        await _threadDbContext.SaveChangesAsync();
        return true;
    }

    public async Task Remove(Thread thread)
    {
        _threadDbContext.Threads.Remove(thread);
    }

    public async Task SaveChangesAsync()
    {
        await _threadDbContext.SaveChangesAsync();
    }

}
