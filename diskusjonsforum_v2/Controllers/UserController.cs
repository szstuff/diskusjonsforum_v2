using diskusjonsforum_v2.DAL;
using diskusjonsforum_v2.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using User = diskusjonsforum_v2.Models.ApplicationUser;
using Thread = diskusjonsforum_v2.Models.Thread;

namespace diskusjonsforum_v2.Controllers;
[Route("api/[controller]")]
[ApiController]
public class UserController : Controller
{
    //Initialise controllers and interfaces for constructor
	private UserManager<ApplicationUser> _userManager;
    private readonly IThreadRepository _threadRepository;
    private readonly ICommentRepository _commentRepository;
	private readonly ILogger<UserController> _logger;
	public UserController(UserManager<ApplicationUser> userManager, IThreadRepository threadRepository, ICommentRepository commentRepository, ILogger<UserController> logger)
	{
		_userManager = userManager;
		_logger = logger;
        _threadRepository = threadRepository;
        _commentRepository = commentRepository;
    }
    
    //Get all users
    [HttpGet]
	public async Task<ActionResult<IEnumerable<User>>> Table()
    {
        var errorMsg = "";
        var user = await _userManager.GetUserAsync(HttpContext.User);
        var userRoles = await _userManager.GetRolesAsync(user);
        
        // Check if current user is admin, if not, redirect to error page
        if (!userRoles.Contains("Admin"))
        {
            errorMsg = "You are not authorised to access this page";
            return RedirectToAction("Error", "Home", new { errorMsg });
        }

        try
        {
            // Fetch all users and create view model for user table view
            var users = _userManager.Users.ToList();
            //var userListViewModel = new UserListViewModel(users, "Table");
            return users;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[UserController] An error occurred in the Table method.");
            errorMsg = "[UserController] An error occured in the Table method.";
            return RedirectToAction("Error", "Home", new {errorMsg});
        }
    }
    
    public List<ApplicationUser> GetUsers()
    {
        try
        {
            var users = new List<ApplicationUser>(); 
            return users;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[UserController] An error occurred in the GetUsers method.");
            return new List<ApplicationUser>();
        }
    }


    // Change role of current user to/from admin role
    public async Task<IActionResult> MakeAdmin()
    {
        var errorMsg = "An error occured when attempting to switch your roles";
        try
        {
            if (HttpContext.User.Identity!.IsAuthenticated)
            {
                var user = await _userManager.GetUserAsync(HttpContext.User); // Fetch current user

                if (user != null)
                {
                    var userRoles = await _userManager.GetRolesAsync(user); // Fetch roles of current user

                    if (userRoles.Contains("Admin"))
                    {
                        await _userManager.RemoveFromRoleAsync(user, "Admin"); // Remove user from admin role
                    }
                    else
                    {
                        await _userManager.AddToRoleAsync(user, "Admin"); // Add user to admin role
                    }
                }
                else
                {
                    errorMsg = "An error occured when authenticating you"; 
                    _logger.LogError("[UserController] An error occurred in the MakeAdmin method.");
                    return RedirectToAction("Error", "Home", new {errorMsg});
                }
            } else
            {
                errorMsg = "An error occured when authenticating you"; 
                _logger.LogError("[UserController] An error occurred in the MakeAdmin method.");
                return RedirectToAction("Error", "Home", new {errorMsg});
            }

            return RedirectToAction("Index", "Home"); // Redirect to Index page from HomeController after changing role
        }
        catch (Exception ex)
        {
            errorMsg = "An error occured when attempting to switch your roles. Verify that the requested role exists."; 
            _logger.LogError(ex, "[UserController] An error occurred in the MakeAdmin method.");
            return RedirectToAction("Error", "Home", new {errorMsg});
        }
    }
}