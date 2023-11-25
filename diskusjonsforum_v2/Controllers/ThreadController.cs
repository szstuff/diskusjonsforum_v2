using diskusjonsforum_v2.DAL;
using diskusjonsforum_v2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
// Add this namespace
using Thread = diskusjonsforum_v2.Models.Thread;
//The comment below disables certain irrelevant warnings in JetBrains IDE
// ReSharper disable RedundantAssignment

namespace diskusjonsforum_v2.Controllers
{
    [Route("api/threads")]
    [ApiController]
    public class ThreadController : Controller
    {
        //Initialise controllers and interfaces for constructor
        private readonly IThreadRepository _threadRepository;
        private readonly ICommentRepository _commentRepository;
        private readonly ILogger<ThreadController> _logger;
        private static List<Thread> Threads = new List<Thread>();

        public ThreadController(IThreadRepository threadDbContext,
            ICommentRepository commentRepository,
            ILogger<ThreadController> logger)
        {
            _threadRepository = threadDbContext;
            _commentRepository = commentRepository;
            _logger = logger;
        }

        //Returns all threads
        [HttpGet("getall")]
        public async Task<ActionResult<IEnumerable<Thread>>> GetThreads()
        {
            var errorMsg = "";
            try
            {
                var threads = _threadRepository.GetAll().ToList();
                foreach (var thread in threads)
                {
                    thread.ThreadComments?.AddRange(GetComments(thread));
                }

                return Ok(threads); // Use Ok() to return a 200 status code along with the threads
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ThreadController] An error occurred in the Table action.");
                errorMsg = "An error occurred while loading threads";

                //RETURN HER MÅ FIKSES: Kan ikke returnere til Action siden det ikke er MVC
                return null;
            }
        }

        //Dette under er fra Demo uke 13, "HTTP Post Request", skal det bytte ut det over eller skal den over bli?

        //[HttpGet]
        //public async Task<IActionResult> GetAll()
        //{
        //    var threads = await _threadRepository.GetAll();
        //    if (threads == null)
        //    {
        //        _logger.LogError("[ThreadController] Thread list not found while executing _threadRepository.GetAll()");
        //        return NotFound("Thread list not found");
        //    }
        //    return Ok(threads);
        //}

        //Returns comments for a given thread 
        public IQueryable<Comment> GetComments(Thread thread)
        {
            try
            {
                return _commentRepository.GetThreadComments(thread);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ThreadController] An error occurred in the GetComments method.");
                return Enumerable.Empty<Comment>().AsQueryable(); //Returns empty collection

            }
        }

        //Returns an individual thread 
        [HttpGet("{id}")]
        public async Task<ActionResult<Thread>> Thread(int threadId)
        {
            try
            {
                var thread = _threadRepository.GetThreadById(threadId);

                if (thread == null)
                {
                    return NotFound();
                }

                thread.ThreadComments = SortComments(thread.ThreadComments!);

                return thread;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ThreadController] An error occurred in the Thread action for thread ID: {0}",
                    threadId);
                // Redirect to Error view if error occurs
                return RedirectToAction("Error", "Home",
                    new { errorMsg = "An error occurred while loading the thread." });

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
                return new List<Comment>(); //Returns no comments so that the Thread can be displayed without comments
                //instead of crashing/showing an error message. 
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
        /*
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
        */

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] Thread newThread)
        {
            if (newThread == null)
            {
                return BadRequest("Inavlid Thread Data.");
            }

            bool returnOk = await _threadRepository.Add(newThread);

            if (returnOk)
            {
                var response = new { success = true, message = "Thread" + newThread.ThreadTitle + " created successfully" };
                return Ok(response);
            }
            else
            {
                var reseponse = new { success = false, message = "Thread creation failed." };
                return BadRequest(reseponse);
            }

        }

        //private static int GetNextThreadId()
        //{
        //    if (Threads.Count == 0)
        //    {
        //        return 1;
        //    }
        //    return Threads.Max(thread => thread.ThreadId) + 1;
        //}
            
            /*
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
                        var categories = _categoryRepository.GetCategories(); // Fetch all categories from the database.
                        ViewBag.Categories = new SelectList(categories, "CategoryName", "CategoryName");
                        return BadRequest();
                    }

                    try
                    {
                        // If the  model is valid, add the thread
                        if (ModelState.IsValid)
                        {
                            bool returnOk = await _threadRepository.Add(thread);
                            if (returnOk)
                            {
                                return NoContent();
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
                return BadRequest();
            }
        */
            //errorMsg = "[ThreadController] An error occurred in the Edit method.";
            //_logger.LogError("[ThreadController] An error occurred in the Edit method.");
            //return RedirectToAction("Error", "Home", new { errorMsg });
        

        /*
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
        */

        // Saves edits made to a thread
        [HttpPut("{id}")]
        public async Task<IActionResult> SaveEdit(Thread thread)
        {
            string errorMsg = "An error occured when trying to save your edit";
            try
            {
                /*
                var user = await _userManager.GetUserAsync(HttpContext.User); //Gets the current user 
                if (user != null)
                {
                    ModelState.Remove(
                        "User"); //Workaround for invalid modelstate. The model isnt really invalid, but it was evaluated BEFORE the controller added User and UserId. Therefore the validty of the "User" key can be removed

                    // Add custom validation for the thread content
                    if (string.IsNullOrWhiteSpace(thread.ThreadBody) || string.IsNullOrWhiteSpace(thread.ThreadTitle))
                    {
                        // Content is empty, add a model error
                        ModelState.AddModelError("ThreadContent", "Thread content is required.");
                        // Gets thread categories and passes them to View. Used to generate dropdown list of available thread categories 
                        //var categories = _categoryRepository.GetCategories(); // Fetch all categories from the database.
                        //ViewBag.Categories = new SelectList(categories, "CategoryName", "CategoryName");
                        //Thread threadToEdit = _threadRepository.GetThreadById(thread.ThreadId);
                        return BadRequest();
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
                                return NoContent();
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
                */
                return null;
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

            /*
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
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ThreadController] Error deleting thread with ID: {0}", threadId);
                errorMsg = "An error occurred while deleting the thread.";
                return RedirectToAction("Error", "Home", new { errorMsg });
            }
            */
            return null;
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
}