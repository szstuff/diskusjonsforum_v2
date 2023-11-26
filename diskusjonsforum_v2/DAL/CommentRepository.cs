using diskusjonsforum_v2.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using ILogger = Castle.Core.Logging.ILogger;
using Thread = diskusjonsforum_v2.Models.Thread;

namespace diskusjonsforum_v2.DAL;

public class CommentRepository : ICommentRepository
{
    private readonly ThreadDbContext _threadDbContext; 

    private readonly ILogger<CommentRepository> _logger;
    
    public CommentRepository(ThreadDbContext threadDbContext, ILogger<CommentRepository> logger)
    {
        _logger = logger;
        _threadDbContext = threadDbContext;
    }

    public IEnumerable<Comment> GetAll()
    {
        return _threadDbContext.Comments.ToList();
    }

    public Comment GetById(int? commentId)
    {
        return _threadDbContext.Comments
            .FirstOrDefault(c => c.CommentId == commentId)!;
    }

    public IQueryable<Comment> GetThreadComments(int parentThreadId)
    {
        return _threadDbContext.Comments.Where(comment => comment.ThreadId == parentThreadId).Include(t=>t.ParentComment);
    }


    public async Task<bool> Add(Comment comment)
    {
        try
        {
            _threadDbContext.Comments.Add(comment);
            await _threadDbContext.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError("[CommentRepository] comment creation failed for comment {@comment}, error message: {e}", comment, e.Message);
            return false;
        }
    }

    public async Task<bool> Update(Comment comment)
    {
        try
        {
            _threadDbContext.Comments.Update(comment);
            await _threadDbContext.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError("[CommentRepository] comment creation failed for comment {@comment}, error message: {e}", comment, e.Message);
            return false;
        }
    }

    public void Remove(Comment comment)
    {
        _threadDbContext.Comments.Remove(comment);
    }

    public async Task SaveChangesAsync()
    {
        await _threadDbContext.SaveChangesAsync();
    }

    public List<Comment> GetChildren(Comment parentComment)
    {
        return _threadDbContext.Comments.Where(c => c.ParentCommentId == parentComment.CommentId).ToList();
    }

    public void DetachEntity(Comment comment)
    {
        //Detach a loaded entity. This is used when two comments with identical commentId are loaded in the context
        //When two identical entities exist (such as in CommentController/SaveEdit, EFCore does not know which one to modify. 
        EntityEntry<Comment> entry = _threadDbContext.Entry(comment);
        if (entry.State != EntityState.Detached)
        {
            entry.State = EntityState.Detached;
        }    }
}
