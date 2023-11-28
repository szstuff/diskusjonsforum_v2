using diskusjonsforum_v2.DAL;
using Microsoft.AspNetCore.Mvc;
using Thread = diskusjonsforum_v2.Models.Thread;

namespace diskusjonsforum_v2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class HomeController : Controller
    {
        //Initialise controllers and interfaces for constructor
        private readonly ILogger<HomeController> _logger;
        private readonly IThreadRepository _threadRepository;

        public HomeController(ILogger<HomeController> logger, IThreadRepository threadRepository)
        {
            _logger = logger;
            _threadRepository = threadRepository;
        }

        //Gets threads from repository and returns to client 
        [HttpGet]
        public IActionResult Index()
        {
            try
            {
                var threads = _threadRepository.GetAll(); // Retrieve all threads
                return Ok(threads); // Return list
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[HomeController] An error occurred in the GetThreads method.");
                return Ok(new List<Thread>()); // Return empty list if an error occurs
            }
        }
        
    }
}