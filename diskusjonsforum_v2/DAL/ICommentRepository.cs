using diskusjonsforum_v2.Models;
using Thread = diskusjonsforum_v2.Models.Thread;

namespace diskusjonsforum_v2.DAL;


public interface ICommentRepository
{
    IEnumerable<Comment> GetAll();
    Comment GetById(int? commentId);
    IQueryable<Comment> GetThreadComments(int parentThreadId);
    Task<bool> Add(Comment comment);
    Task<bool> Update(Comment comment);
    Task<bool> Remove(int commentId);
    Task SaveChangesAsync();
    List<Comment> GetChildren(Comment parentComment);

    void DetachEntity(Comment comment);
}