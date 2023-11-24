using System.ComponentModel.DataAnnotations.Schema;

namespace diskusjonsforum_v2.Models
{
    public class Thread
    {
        public int ThreadId { get; set; }
        public string ThreadTitle { get; set; } 
        [ForeignKey("Category")] 
        public string CategoryName { get; set; } 
        public Category Category { get; set; } 
        public string ThreadBody { get; set; }
        public DateTime ThreadCreatedAt { get; set; }  = DateTime.Now;
        public DateTime ThreadLastEditedAt { get; set; } = DateTime.Now;

        [ForeignKey("ApplicationUser")] 
        public string? UserId { get; set; } 
        public virtual ApplicationUser User { get; set; }  = default!; 
        public List<Comment>? ThreadComments { get; set; } 
    }
}
