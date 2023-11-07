using diskusjonsforum_v2.Models;
using Microsoft.EntityFrameworkCore;
using Thread = System.Threading.Thread;

namespace diskusjonsforum_v2.DAL;

public class CategoryRepository : ICategoryRepository
{
    private readonly ThreadDbContext _threadDbContext;

    public CategoryRepository(ThreadDbContext context)
    {
        _threadDbContext = context;
    }

    public List<Category> GetCategories()
    {
        return _threadDbContext.Categories
            .Include(c => c.ThreadsInCategory)
            .ToList();
    }
    
    //All the methods below are implemented, but not used in the application. 
    public List<diskusjonsforum_v2.Models.Thread> GetThreads(Category category)
    {
        return _threadDbContext.Threads
            .Where(thread => thread.Category == category)
            .ToList();
    }

    public Category GetCategoryByName(String name)
    {
        return _threadDbContext.Categories
            .Include(c => c.ThreadsInCategory)
            .FirstOrDefault(c => c.CategoryName == name);
    }

    public IQueryable<diskusjonsforum_v2.Models.Thread> GetThreadsByCategory(Category category)
    {
        return _threadDbContext.Threads.Where(thread => thread.Category == category);
    }
}
