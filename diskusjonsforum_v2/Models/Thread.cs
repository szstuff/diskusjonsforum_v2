using System.ComponentModel.DataAnnotations.Schema;

namespace diskusjonsforum_v2.Models
{
    public class Thread
    {
        public int ThreadId { get; set; } = 0;
        public string ThreadTitle { get; set; } = null!; //Promises the compiler that value will not be null 
        public string ThreadBody { get; set; } = null!;
        public DateTime ThreadCreatedAt { get; set; }  = DateTime.Now;
        public DateTime ThreadLastEditedAt { get; set; } = DateTime.Now;

 
        public string? CreatedBy { get; set; } 
        public List<Comment>? ThreadComments { get; set; } 
    }
}
