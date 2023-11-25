using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace diskusjonsforum_v2.Models
{
    public class Comment
    {
        public int CommentId { get; set; } = 0;  
        [Required] 
        public String CommentBody { get; set; } = null!; //Promises to compiler that value will not be null

        public DateTime CommentCreatedAt { get; set; } = DateTime.Now;
        public DateTime CommentLastEditedAt { get; set; } = DateTime.Now; //Initialises as DateTime.Now since the last edit was at the time of creation
        [ForeignKey("Thread")] 
        public int ThreadId { get; set; } = 0;
        public virtual Thread? Thread { get; set; } = default!;  //Nullable as Thread is not always set correctly upon creation of comment. Instead, we set the Thread upon creation as this proved to be more reliable 
        [ForeignKey("Comment")]
        public int? ParentCommentId { get; set; } //Nullable: ParentcCommentId null means that the comment is a direct reply to the thread 
        public virtual Comment? ParentComment { get; set; } = default!; //Nullable for same reason as Thread 
        
        public string? CreatedBy { get; set; }
        
    }
}

