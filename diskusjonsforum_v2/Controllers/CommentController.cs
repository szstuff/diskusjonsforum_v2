using Microsoft.AspNetCore.Mvc;
using diskusjonsforum_v2.DAL;
using diskusjonsforum_v2.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Thread = diskusjonsforum_v2.Models.Thread;


namespace diskusjonsforum_v2.Controllers;


public class CommentController : Controller
{
    //Initialise controllers and interfaces for constructor
    private readonly ICommentRepository _commentRepository;
    private readonly IThreadRepository _threadRepository;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<CommentController> _logger;
    public CommentController(ICommentRepository commentRepository, IThreadRepository threadRepository, UserManager<ApplicationUser> userManager, ILogger<CommentController> logger)
    {
        _commentRepository = commentRepository;
        _threadRepository = threadRepository;
        _userManager = userManager;
        _logger = logger;
    }

    //Returns list of all comments
    public Task<List<Comment>> GetComments()
    {
        var comments = new List<Comment>();
        return Task.FromResult(comments);
    }
    
    //Returns Comment/Create view
    [HttpGet("create/{parentCommentId}/{threadId}")] //URL when user replies to a comment or thread 
    [Authorize]
    public async Task<IActionResult> Create(int? parentCommentId, int threadId)
    {
        if (parentCommentId == 0) {parentCommentId = null;} //If parentCommentId == 0, the comment is a direct reply to the thread

        try
        {
            if (HttpContext.User.Identity!.IsAuthenticated) //If user is authenticated
            {
                Comment parentComment = _commentRepository.GetById(parentCommentId);
                var thread = _threadRepository.GetThreadById(threadId);
                thread.User = await _userManager.FindByIdAsync(thread.UserId); //User needs to be set to load Thread and Comment in Comment/Create view 
                // Retrieve query parameters
                // Create a CommentViewModel and populate it with data
                // var viewModel = new CommentCreateViewModel()
                // {
                //     ThreadId = threadId,
                //     ParentCommentId = parentCommentId,
                //     ParentComment = parentComment,
                //     Thread = thread
                // };

                // Pass the CommentViewModel to the view
                return null;
            }
            else
            {
                //Redirects to login page if user not logged in
                return RedirectToPage("/Account/Login", new { area = "Identity" });

            }
        }
        catch (Exception ex)
        {
            var errormsg = "[CommentController] An error occurred in the Create action";
            _logger.LogError(ex, "[CommentController] An error occurred in the Create action");
            return RedirectToAction("Error", "Home", new { errormsg });
        }
    }

    //Saves comment submitted through the Create view 
    [HttpPost("save")]
    [Authorize]
    public async Task<IActionResult> Save(Comment comment)
    {
        var errorMsg = "";
        try
        {
            var user = await _userManager.GetUserAsync(HttpContext.User); //Gets current user 
            if (user != null)
            {
                //Set comment details to current user 
                comment.UserId = user.Id;
                comment.User = user;
                ModelState.Remove(
                    "comment.User"); //Workaround for invalid modelstate. 

                if (string.IsNullOrWhiteSpace(comment.CommentBody))
                {
                    //Input validation: adds modelerror if submitted CommentBody is empty 
                    ModelState.AddModelError("CommentBody", "Comment can't be empty.");
                    //Recreates the Create-viewmodel and returns a new Comment/Create view
                    // var viewModel = new CommentCreateViewModel()
                    // {
                    //     ThreadId = comment.ThreadId,
                    //     ParentCommentId = comment.ParentCommentId,
                    //     ParentComment = _commentRepository.GetById(comment.ParentCommentId),
                    //     Thread = _threadRepository.GetThreadById(comment.ThreadId)
                    // };
                    // return View("Create", viewModel);
                    return null;
                }
            }

            if (ModelState.IsValid)
            {
                bool returnOk = await _commentRepository.Add(comment);
                if (returnOk)
                    return RedirectToAction("Thread", "Thread", new { comment.ThreadId }); //Returns the thread if comment submission was successful 
            } else {
                errorMsg = "There was an issue submitting your comment";
                return RedirectToAction("Error", "Home", new { errorMsg });
}
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[CommentController] An error occurred in the Create action");

            // Log the specific exception and its message
            _logger.LogError(ex, "[CommentController] Exception: {0}, Message: {1}", ex.GetType(), ex.Message);

            errorMsg = "Comment creation failed";
            return RedirectToAction("Error", "Home", new { errorMsg });
        }

        // If no other return occurred, return a generic error page or redirect
        errorMsg = "An error occurred while creating the comment.";
        return RedirectToAction("Error", "Home", new { errorMsg = errorMsg });
    }

    [HttpGet("edit/{{commentId}}/{{threadId}}")]
    [Authorize]
    public IActionResult Edit(int commentId, int threadId)
    {
        try
        {
            if (HttpContext.User.Identity!.IsAuthenticated)
            {
                Comment commentToEdit = _commentRepository.GetById(commentId);
                Comment parentComment =
                    _commentRepository.GetById(commentToEdit.ParentCommentId); //Throws no exception because parentComment can be null (if user replied directly to thread) 
                Thread thread = _threadRepository.GetThreadById(threadId);
                // Retrieve query parameters
                // Create a CommentViewModel and populate it with data
                /*var viewModel = new CommentCreateViewModel()
                {
                    ThreadId = threadId,
                    ParentCommentId = commentId,
                    ParentComment = parentComment,
                    CommentToEdit = commentToEdit,
                    Thread = thread
                };

                // Pass the CommentViewModel to the view
                 return View(viewModel);*/

                return null; 
            }
            else
            {
                //Redirects to login page if user not logged in
                return RedirectToPage("/Account/Login", new { area = "Identity" });
            }
        }
        catch (Exception ex) {
            var errormsg = "[CommentController] An error occurred in the Create action";
            _logger.LogError(ex, "[CommentController] An error occurred in the Edit action");
            return RedirectToAction("Error", "Home", new { errormsg });
        }
    }
    [HttpPost("comment/saveEdit")]
    [Authorize]
    public async Task<IActionResult> SaveEdit(Comment comment)
    {
        var errorMsg = "";
        var user = await _userManager.GetUserAsync(HttpContext.User);
        if (user != null)
        {
            
            var uneditedComment = _commentRepository.GetById(comment.CommentId);
            _commentRepository.DetachEntity(uneditedComment); // Detach the comment since there are two instances of the same comment.
            
            // Add custom validation for the thread content
            if (string.IsNullOrWhiteSpace(comment.CommentBody) || string.IsNullOrWhiteSpace(comment.CommentBody))
            {
                // Content is empty, add a model error
                ModelState.AddModelError("CommentBody", "Comment content is required.");
                /*var viewModel = new CommentCreateViewModel()
                {
                    ThreadId = uneditedComment.ThreadId,
                    ParentCommentId = uneditedComment.ParentCommentId,
                    ParentComment = uneditedComment.ParentComment,
                    CommentToEdit = _commentRepository.GetById(comment.CommentId),
                    Thread = uneditedComment.Thread
                };
                // Gets thread categories and passes them to View. Used to generate dropdown list of available thread categories 
                return View("Edit", viewModel);*/
                return null;
            }
            
            //Reconstruct the comment before saving 
            comment.User = uneditedComment.User;
            comment.UserId = uneditedComment.User.Id;
            comment.CommentLastEditedAt = DateTime.Now;
            comment.ThreadId = uneditedComment.ThreadId;
            comment.ParentCommentId = uneditedComment.ParentCommentId;
            comment.CommentCreatedAt = uneditedComment.CommentCreatedAt;
            ModelState.Remove("comment.User"); //Workaround for invalid modelstate. The model isnt really invalid, but it was evaluated BEFORE the controller added User and UserId. Therefore the validty of the "User" key can be removed 
            //Checks if user is owner or admin before editing
            var userRoles = await _userManager.GetRolesAsync(user);
            if (user.Id != comment.UserId && !userRoles.Contains("Admin"))
            {
                errorMsg = "Could not verify that you are the owner of the Thread";
                return RedirectToAction("Error", "Home", new { errorMsg });
            }
            if (ModelState.IsValid)
            {
                bool returnOk = await _commentRepository.Update(comment);
                if (returnOk)
                    return RedirectToAction("Thread", "Thread", new {comment.ThreadId});
            }
        }
        
        _logger.LogWarning("[CommentController] Comment edit failed {@comment}", comment);
        errorMsg = "Could not save your edits";
        return RedirectToAction("Error", "Home", new {errorMsg});
    }

    public async Task<IActionResult> DeleteComment(int commentId)
    {
        Comment comment = _commentRepository.GetById(commentId);

        try
        {
            // Checks if the user is either the owner of the comment or an admin before deleting
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var userRoles = await _userManager.GetRolesAsync(user);

            if (comment.UserId == user.Id || userRoles.Contains("Admin"))
            {
                List<Comment> childcomments = AddChildren(comment);

                foreach (var child in childcomments)
                {
                    //Deletes all child comments and saves changes
                    _commentRepository.Remove(child);
                    await _commentRepository.SaveChangesAsync();
                }

                _commentRepository.Remove(comment);
                await _commentRepository.SaveChangesAsync();

                return RedirectToAction("Thread", "Thread", new { comment.ThreadId });
            }
            else
            {
                var errorMsg = "You do not have permission to delete this comment.";
                _logger.LogError(errorMsg);
                return RedirectToAction("Error", "Home", new { errorMsg });
            }
        }
        catch (Exception ex)
        {
            var errorMsg = "An error occurred while deleting the comment.";
            _logger.LogError(ex, "[CommentController] An error occurred in the DeleteComment action.");
            return RedirectToAction("Error", "Home", new { errorMsg });
        }
    }

    //recursively finds all replies to the comment 
    private List<Comment> AddChildren(Comment parentComment)
    {
        List<Comment> newChildren = _commentRepository.GetChildren(parentComment);
        List<Comment> newerChildren = new List<Comment>();
        foreach (Comment child in newChildren)
        {
            newerChildren.AddRange(AddChildren(child));
        }
        newChildren.AddRange(newerChildren);
        return newChildren;
    }
}

