
using diskusjonsforum_v2.DAL;
using Microsoft.AspNetCore.Mvc;
using diskusjonsforum_v2.Models;
using Microsoft.AspNetCore.Authorization;
using Thread = diskusjonsforum_v2.Models.Thread;


namespace diskusjonsforum_v2.Controllers;
[Route("api/[controller]")]
[ApiController]


public class CommentController : Controller
{
    //Initialise controllers and interfaces for constructor
    private readonly ICommentRepository _commentRepository;
    private readonly IThreadRepository _threadRepository;
    private readonly ILogger<CommentController> _logger;
    public CommentController(ICommentRepository commentRepository, IThreadRepository threadRepository, ILogger<CommentController> logger)
    {
        _commentRepository = commentRepository;
        _threadRepository = threadRepository;
        _logger = logger;
    }

    //Returns list of all comments 
    [HttpGet("getByThread/{parentThread}")]
    public Task<IQueryable<Comment>> GetComments(int parentThreadId)
    {
        var comments = _commentRepository.GetThreadComments(parentThreadId);
        return Task.FromResult(comments);
    }
    
    //create a new comment
    [HttpPost("create")]
    public IActionResult Create([FromBody] Comment newComment)
    {
        if (newComment == null)
        {
            return BadRequest("Invalid item data.");
        }

        //newComment.CommentId = GetNextCommentId(); //Kommentert ut for den gjør ingenting. ID settes automatisk av DB 
        _commentRepository.Add(newComment);

        var response = new { success = true, message = "Thread" + newComment.CommentId + " created successfully" };
        return Ok(response);

    }

    //Denne koden gjør ingenting? Comments er en lokal variabel som er tom ved initialisering (slettet nå)

    /*private static int GetNextCommentId()
    {
        if (Comments.Count == 0)
        {
            return 1;
        }
        return Comments.Max(item => item.CommentId) + 1;
    }
    */
    
    //Saves comment submitted through the Create view 
    [HttpPost("save")]
    [Authorize]
    public async Task<IActionResult> Save(Comment comment)
    {
        /*
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
                    /*
                    var viewModel = new CommentCreateViewModel()
                    
                    {
                        ThreadId = comment.ThreadId,
                        ParentCommentId = comment.ParentCommentId,
                        ParentComment = _commentRepository.GetById(comment.ParentCommentId),
                        Thread = _threadRepository.GetThreadById(comment.ThreadId)
                    };
                    
                    return BadRequest();
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
        */
        return null;
    }
/*
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
                var viewModel = new CommentCreateViewModel()
                {
                    ThreadId = threadId,
                    ParentCommentId = commentId,
                    ParentComment = parentComment,
                    CommentToEdit = commentToEdit,
                    Thread = thread
                };

                // Pass the CommentViewModel to the view
                 return View(viewModel);
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
    */

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> SaveEdit(Comment comment)
    {
        /*
        var errorMsg = "";
        var user = await _userManager.GetUserAsync(HttpContext.User);
        if (user != null)
        {
            comment.User = user;
            comment.UserId = user.Id;
            comment.CommentLastEditedAt = DateTime.Now;
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
        errorMsg = "Comment edit failed";
        return RedirectToAction("Error", "Home", new {errorMsg});
        */
        return null;
    }

    public async Task<IActionResult> DeleteComment(int commentId)
    {
        Comment comment = _commentRepository.GetById(commentId);
        /*
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
        */
        return null;
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

