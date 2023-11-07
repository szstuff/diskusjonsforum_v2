
/*class for category*/
using System.Collections;

namespace diskusjonsforum_v2.Models;

public class Category
{
    public string CategoryName { get; set; } //Doubles as PK 

    public List<Thread>? ThreadsInCategory { get; set; }
}
