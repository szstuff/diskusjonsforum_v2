using Microsoft.AspNetCore.Mvc;
using diskusjonsforum_v2.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Rendering;
using diskusjonsforum_v2.DAL;
using Thread = diskusjonsforum_v2.Models.Thread;
//The comment below disables certain irrelevant warnings in JetBrains IDE
// ReSharper disable RedundantAssignment

namespace diskusjonsforum_v2.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ThreadController : Controller
{
    private static List<Thread> Threads = new List<Thread>();

    [HttpGet]
    public List<Thread> GetAll()
    {
        return Threads;}
    
    //Initialise controllers and interfaces for constructor
    private readonly IThreadRepository _threadRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly ICommentRepository _commentRepository;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<ThreadController> _logger;

    public ThreadController(
        IThreadRepository threadDbContext, 
        ICategoryRepository categoryRepository,
        ICommentRepository commentRepository, 
        UserManager<ApplicationUser> userManager,
        ILogger<ThreadController> logger)
    {
        _threadRepository = threadDbContext;
        _categoryRepository = categoryRepository;
        _commentRepository = commentRepository;
        _userManager = userManager;
        _logger = logger;
    }

    //Returns Thread Table Razor view
    public IActionResult Table()
    {
        var errorMsg = "";
        try
        {
            var threads = _threadRepository.GetAll();
            foreach (var thread in threads)
            {
                thread.ThreadComments?.AddRange(GetComments(thread));
            }
            // Create view model for thread and displays them
            // var threadListViewModel = new ThreadListViewModel(threads, "Table");
            // return View(threadListViewModel); 
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[ThreadController] An error occurred in the Table action.");
            errorMsg = "An error occurred while loading threads";
            return RedirectToAction("Error", "Home", new { errorMsg });
        }
    }
    
    //Returns comments for a given thread 
    public IQueryable<Comment> GetComments(Thread thread)
    {
        try
        {
            return _commentRepository.GetThreadComments(thread);
        } catch (Exception ex)
        {
            _logger.LogError(ex, "[ThreadController] An error occurred in the GetComments method.");
            return Enumerable.Empty<Comment>().AsQueryable(); //Returns empty collection

        }
    }

    //Returns a list of threads
    public List<Thread> GetThreads()
    {
        try
        {
            var threads = new List<Thread>();
            return threads;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[ThreadController] An error occurred in the GetThreads method.");
            return new List<Thread>(); //Returns empty list 
        }
    }

    public IActionResult Thread(int threadId)
    {
        try
        {
            var thread = _threadRepository.GetThreadById(threadId);

            if (thread == null)
            {
                return NotFound();
            }

            thread.ThreadComments = SortComments(thread.ThreadComments!);

            return View(thread);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[ThreadController] An error occurred in the Thread action for thread ID: {0}", threadId);
            // Redirect to Error view if error occurs
            return RedirectToAction("Error", "Home", new { errorMsg = "An error occurred while loading the thread." });
            
        }

    }
    
    // Sort comments based on their parent-child
    public List<Comment> SortComments(List<Comment> comments)
    {
        try
        {
            var sortedComments = new List<Comment>();
            
            // Go through comments without a parent comment and sorts them
            foreach (var comment in comments.Where(c => c.ParentCommentId == null))
            {
                sortedComments.Add(comment);
                AddChildComments(comment, comments, sortedComments);
            }

            return sortedComments;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[ThreadController] An error occurred in the SortComments method.");
            return new List<Comment>();
        }
    }

    // Add child comment to sortedComments list
    private void AddChildComments(Comment parent, List<Comment> allComments, List<Comment> sortedComments)
    {
        try
        {
            // Find child comments for respective parent comment and add them to the sorted comment list
            var childComments = allComments.Where(c => c.ParentCommentId == parent.CommentId).ToList();
            foreach (var comment in childComments)
            {
                sortedComments.Add(comment);
                AddChildComments(comment, allComments, sortedComments); // Find children of this child comment
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[ThreadController] An error occurred in the AddChildComments method.");
        }
    }

    // If user is authenticated, retrieve thread categories from repository to the view
    [HttpGet]
    public IActionResult Create()
    {
        try
        {
            if (HttpContext.User.Identity!.IsAuthenticated) // Check if user is logged in
            {
                // Gets thread categories and passes them to View. Used to generate dropdown list of available thread categories 
                var categories = _categoryRepository.GetCategories();// Fetch all categories from the database.
                ViewBag.Categories = new SelectList(categories, "CategoryName", "CategoryName");
                return View();

            }
            // Redirects to the login page if the user is not logged in
            return RedirectToPage("/Account/Login", new { area = "Identity" });

        }
        catch (Exception ex)
        {
            var errormsg = "[ThreadController] An error occurred in the Create method.";
            _logger.LogError(ex, "[ThreadController] An error occurred in the Create method.");
            return RedirectToAction("Error", "Home", new { errormsg });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create(Thread thread)
    {
        var errorMsg = "";

        if (HttpContext.User.Identity!.IsAuthenticated) // Check if user is logged in
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if (user != null) // Check user is retrieved
            {
                thread.UserId = user.Id;
                thread.User = user;
                ModelState.Remove("User");
                ModelState.Remove("Category");

                // Add custom validation for the thread content
                if (string.IsNullOrWhiteSpace(thread.ThreadBody) || string.IsNullOrWhiteSpace(thread.ThreadTitle))
                {
                    // Content is empty, add a model error
                    ModelState.AddModelError("ThreadContent", "Thread content is required.");
                    // Gets thread categories and passes them to View. Used to generate dropdown list of available thread categories 
                    var categories = _categoryRepository.GetCategories();// Fetch all categories from the database.
                    ViewBag.Categories = new SelectList(categories, "CategoryName", "CategoryName");
                    return View(thread);
                }

                try
                {
                    // If the  model is valid, add the thread
                    if (ModelState.IsValid)
                    {
                        bool returnOk = await _threadRepository.Add(thread);
                        if (returnOk)
                        {
                            return RedirectToAction(nameof(Table));
                        }
                    }
                    else
                    {
                        errorMsg = "Could not create your thread because there was an issue validating its content";
                        return RedirectToAction("Error", "Home", new { errorMsg });
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "[ThreadController] Error creating a thread: {0}", thread.ThreadTitle);
                    errorMsg = "Could not create your thread due to a database error.";
                    return RedirectToAction("Error", "Home", new { errorMsg });
                }
            }
            else
            {
                _logger.LogError("[ThreadController] Error when loading Create view.");
                errorMsg = "An error occured when loading the page";
                return RedirectToAction("Error", "Home", new { errorMsg });
            }
        }
        else
        {
            _logger.LogWarning("[ThreadController] User is not authenticated in the Create action.");
            return View(thread);
        }
        errorMsg = "[ThreadController] An error occurred in the Edit method.";
        _logger.LogError("[ThreadController] An error occurred in the Edit method.");
        return RedirectToAction("Error", "Home", new { errorMsg });
    }

    [HttpGet("edit/{threadId}")]
    public async Task<IActionResult> Edit(int threadId)
    {
        try
        {
            if (HttpContext.User.Identity!.IsAuthenticated)
            {
                // Gets thread categories and passes them to View. Used to generate dropdown list of available thread categories 
                var categories = _categoryRepository.GetCategories(); //Fetch all categories from the database.
                ViewBag.Categories = new SelectList(categories, "CategoryName", "CategoryName");
                
                Thread threadToEdit = _threadRepository.GetThreadById(threadId);  // Retrieve thread to edit with threadId
                var user = await _userManager.GetUserAsync(HttpContext.User); // Get the user
                var userIsAdmin = await _userManager.IsInRoleAsync(user, "Admin");
                
                // Checks if the user is the owner or admin before allowing to edit
                if (user.Id == threadToEdit.UserId || userIsAdmin) 
                {
                    return View(threadToEdit);
                }
                else
                {
                    // Redirects to login page if the user is not logged in
                    return RedirectToPage("/Account/Login", new { area = "Identity" });
                }
            }

            var errorMsg = "Error when trying to load Edit Thread view";
            _logger.LogError("[ThreadController] An error occurred in the Edit method.");
            return RedirectToAction("Error", "Home", new { errorMsg });
        }
        catch (Exception ex)
        {
            var errorMsg = "[ThreadController] An error occurred in the Edit method.";
            _logger.LogError(ex, "[ThreadController] An error occurred in the Edit method.");
            return RedirectToAction("Error", "Home", new { errorMsg });
        }
    }

    [HttpPost]
    // Saves edits made to a thread
    public async Task<IActionResult> SaveEdit(Thread thread)
    {
        var errorMsg = "An error occured when trying to save your edit";
        try
        {
            var user = await _userManager.GetUserAsync(HttpContext.User); //Gets the current user 
            if (user != null)
            {
                ModelState.Remove("User"); //Workaround for invalid modelstate. The model isnt really invalid, but it was evaluated BEFORE the controller added User and UserId. Therefore the validty of the "User" key can be removed

                // Add custom validation for the thread content
                if (string.IsNullOrWhiteSpace(thread.ThreadBody) || string.IsNullOrWhiteSpace(thread.ThreadTitle))
                {
                    // Content is empty, add a model error
                    ModelState.AddModelError("ThreadContent", "Thread content is required.");
                    // Gets thread categories and passes them to View. Used to generate dropdown list of available thread categories 
                    var categories = _categoryRepository.GetCategories(); // Fetch all categories from the database.
                    ViewBag.Categories = new SelectList(categories, "CategoryName", "CategoryName");
                    Thread threadToEdit = _threadRepository.GetThreadById(thread.ThreadId);
                    return View("Edit", threadToEdit);
                }

                // Checks if the user is the owner or admin before editing
                var userRoles = await _userManager.GetRolesAsync(user);
                if (user.Id != thread.UserId && !userRoles.Contains("Admin"))
                {
                    errorMsg = "Could not verify that you are the owner of the Thread";
                    _logger.LogError(errorMsg);
                    return RedirectToAction("Error", "Home", new { errorMsg });
                }

                ModelState.Remove("Category");
                try
                {
                    if (ModelState.IsValid)
                    {
                        bool returnOk = await _threadRepository.Update(thread);
                        if (returnOk)
                            return RedirectToAction("Thread", "Thread", new { thread.ThreadId });
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "[ThreadController] Error editing thread: {0}", thread.ThreadId);
                    errorMsg = "Could not edit your thread due to a database error.";
                    return RedirectToAction("Error", "Home", new { errorMsg });
                }
            }

            _logger.LogError("[ThreadController] Error occurred when saving the changes you made to the thread");
            errorMsg = "Error occurred when saving the changes you made to the thread";
            return RedirectToAction("Error", "Home", new { errorMsg });
        }
        catch (Exception ex)
        {
            errorMsg = "Error occurred when saving the changes you made to the thread";
            _logger.LogError(ex, "[ThreadController] An error occurred in the SaveEdit method.");
            return RedirectToAction("Error", "Home", new { errorMsg });
        }
    }
    
    // Delete thread with given threadId if user has permission
    public async Task<IActionResult> DeleteThread(int threadId)
    {
        Thread thread = _threadRepository.GetThreadById(threadId);
        
        // Checks if the user is either the owner of the comment or an admin before deleting
        var user = await _userManager.GetUserAsync(HttpContext.User);
        var userRoles = await _userManager.GetRolesAsync(user);
        string errorMsg = "";

        try
        {
            if (thread.UserId != user.Id && !userRoles.Contains("Admin")) //If user is admin or owner
            {
                errorMsg = "You do not have permission to delete this thread.";
                return RedirectToAction("Error", "Home", new { errorMsg });
            }

            await _threadRepository.Remove(thread);
            await _threadRepository.SaveChangesAsync();
            return RedirectToAction("Table", "Thread");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[ThreadController] Error deleting thread with ID: {0}", threadId);
            errorMsg = "An error occurred while deleting the thread.";
            return RedirectToAction("Error", "Home", new { errorMsg });
        }
    }
    
    // Search for posts in the database with provided search query
    public IActionResult SearchPosts(string searchQuery)
    {
        var threads = _threadRepository.GetAll();
        
        // Checks if whatever the user is typing exists
        if (!string.IsNullOrEmpty(searchQuery))
        {
            threads = threads.Where(t => t.ThreadTitle.Contains(searchQuery, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }

        // Create an object with both threadTitle and threadId
        var searchResults = threads.Select(t => new { threadTitle = t.ThreadTitle, threadId = t.ThreadId });

        // Return the search results as JSON
        return Json(searchResults);
    }



}
