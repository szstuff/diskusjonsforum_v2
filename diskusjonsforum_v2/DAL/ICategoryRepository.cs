using diskusjonsforum_v2.Models;
using Thread = diskusjonsforum_v2.Models.Thread;

namespace diskusjonsforum_v2.DAL;

public interface ICategoryRepository
{
    List<Category> GetCategories();
    //All methods below are implemented, but not used in the application 
    List<diskusjonsforum_v2.Models.Thread> GetThreads(Category category);
    Category GetCategoryByName(string name);
    IQueryable<Thread> GetThreadsByCategory(Category category);
}