using diskusjonsforum_v2.Models;

namespace diskusjonsforum_v2.DAL;

public interface ICategoryRepository
{
    List<Category> GetCategories();
    //All methods below are implemented, but not used in the application 
    List<Diskusjonsforum.Models.Thread> GetThreads(Category category);
    Category GetCategoryByName(string name);
    IQueryable<Diskusjonsforum.Models.Thread> GetThreadsByCategory(Category category);
}