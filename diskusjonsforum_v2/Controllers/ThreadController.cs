using Microsoft.AspNetCore.Mvc;
using diskusjonsforum_v2.Models;
using diskusjonsforum_v2.DAL;
using Thread = diskusjonsforum_v2.Models.Thread;

//The comment below disables certain irrelevant warnings in JetBrains IDE
// ReSharper disable RedundantAssignment
namespace diskusjonsforum_v2.Controllers
{
    [Route("api/threads")]
    [ApiController]
    public class ThreadController : ControllerBase
    {
        //Initialise controllers and interfaces for constructor
        private readonly IThreadRepository _threadRepository;
        private readonly ICommentRepository _commentRepository;
        private readonly ILogger<ThreadController> _logger;
        //private static List<Thread> Threads = new List<Thread>();
        
        public ThreadController(IThreadRepository threadRepository,
            ICommentRepository commentRepository,
            ILogger<ThreadController> logger)
        {
            _threadRepository = threadRepository;
            _commentRepository = commentRepository;
            _logger = logger;
        }

        //Returns all threads 
        [HttpGet("getall")]
        public IActionResult GetThreads()
        {
            try
            {
                var threads = _threadRepository.GetAll().ToList();
        
                foreach (var thread in threads)
                {
                    var comments = GetComments(thread).ToList();
            
                    // To avoid depth error
                    thread.ThreadComments = comments.Select(c => new Comment { CommentId = c.CommentId }).ToList();
                }

                return Ok(threads); // Use Ok() to return a 200 status code along with the threads
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ThreadController] An error occurred in the GetAllThreads action.");
                return StatusCode(500, "An error occurred while loading threads");
            }
        }

        private IQueryable<Comment> GetComments(Thread thread)
        {
            try
            {
                return _commentRepository.GetThreadComments(thread.ThreadId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ThreadController] An error occurred in the GetComments method.");
                return Enumerable.Empty<Comment>().AsQueryable(); // Returns empty collection
            }
        }


        // Returns an individual thread 
        [HttpGet("getThread/{id}")]
        public IActionResult GetThread(int id)
        {
            try
            {
                var thread = _threadRepository.GetThreadById(id);

                if (thread == null)
                {
                    return NotFound();
                }

                thread.ThreadComments = SortComments(thread.ThreadComments!);

                return Ok(thread);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ThreadController] An error occurred in the Thread action for thread ID: {0},",
                    id);
                return StatusCode(500, "An error occurred while loading the thread");

            }

        }

        //This method is used for organising child comments.
        //Child comment functionaity is not implemented in this assignment
        private List<Comment> SortComments(List<Comment> comments)
        {
            try
            {
                var sortedComments = new List<Comment>();
                var visitedComments = new HashSet<int>(); // Use a HashSet to efficiently check visited comments

                // Go through comments without a parent comment and sorts them
                foreach (var comment in comments.Where(c => c.ParentCommentId == null))
                {
                    AddChildComments(comment, comments, sortedComments, visitedComments);
                }

                return sortedComments;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ThreadController] An error occurred in the SortComments method.");
                return new List<Comment>(); // Returns no comments to prevent crashing/showing an error message.
            }
        }

        // Add child comments to sortedComments list
        //Child comment functionaity is not implemented in this assignment
        private void AddChildComments(Comment parent, List<Comment> allComments, List<Comment> sortedComments, HashSet<int> visitedComments)
        {
            try
            {
                // Find child comments for respective parent comment and add them to the sorted comment list
                var childComments = allComments.Where(c => c.ParentCommentId == parent.CommentId).ToList();
                foreach (var comment in childComments)
                {
                    sortedComments.Add(comment);
                    AddChildComments(comment, allComments, sortedComments, visitedComments); // Find children of this child comment
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ThreadController] An error occurred in the AddChildComments method.");
            }
        }

        [HttpPost("create")]
        public async Task<ActionResult> CreateThread([FromBody] Thread newThread)
        {
            if (newThread == null)
            {
                return BadRequest("Invalid Thread Data.");
            }

            try
            {
                bool returnOk = await _threadRepository.Add(newThread);

                if (returnOk)
                {
                    var response = new
                        { success = true, message = $"Thread {newThread.ThreadTitle} created successfully" };
                    return Ok(response);
                }
                else
                {
                    var response = new { success = false, message = "Thread creation failed." };
                    return BadRequest(response);
                }
            }
            catch (Exception)
            {
                _logger.LogError("[ThreadController] CreateThread error.");
                return StatusCode(500, "Error occurred while creating the thread.");
            }
        }


        // Saves edits made to a thread
        [HttpPut("update/{id}")]
        public async Task<ActionResult> UpdateThread(int id, [FromBody] Thread thread)
        {
            thread.ThreadLastEditedAt = DateTime.Now;
            string errorMsg = "An error occurred when trying to save your edit";
            try
            {
                // Add custom validation for the thread content
                if (string.IsNullOrWhiteSpace(thread.ThreadBody) || string.IsNullOrWhiteSpace(thread.ThreadTitle))
                {
                    // Content is empty, return bad request error 
                    return BadRequest();
                }

                bool updateSuccess = await _threadRepository.Update(thread);

                if (updateSuccess)
                {
                    // Fetch the updated thread after the update
                    Thread updatedThread = _threadRepository.GetThreadById(id);

                    if (updatedThread != null)
                    {
                        // Return the updated thread in the response
                        return Ok(new { success = true, message = "Thread updated successfully.", updatedThread = "updatedThread" });
                    }
                }
                else
                {
                    // Thread update failed
                    errorMsg = "Thread update failed.";
                }
            }
            catch (Exception ex)
            {
                errorMsg = "Could not edit your thread due to a database error.";
                _logger.LogError(ex, "[ThreadController] Error editing thread: {0}", id);
            }
            return StatusCode(500, new { message = errorMsg });
        }
        
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteThread(int id)
        {
            try
            {
                var threadToDelete = _threadRepository.GetThreadById(id);

                if (threadToDelete == null)
                {
                    return NotFound();
                }

                await _threadRepository.Remove(threadToDelete);
                await _threadRepository.SaveChangesAsync();
                
                var response = new { success = true, message = $"Thread {id} deleted successfully" };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ThreadController] An error occurred while deleting the thread with ID: {threadId}", id);
                return StatusCode(500, "An error occurred while deleting your thread");
            }
        }



        [HttpGet("search/{searchQuery}")]
        public IActionResult SearchThreads(string searchQuery)
        {
            try
            {
                var threads = _threadRepository.GetAll();

                // Checks if whatever the user is typing exists
                if (!string.IsNullOrEmpty(searchQuery))
                {
                    threads = threads
                        .Where(t => t.ThreadTitle.Contains(searchQuery, StringComparison.OrdinalIgnoreCase))
                        .ToList();
                }

                // Create an object with both threadTitle and threadId
                var searchResults = threads.Select(t => new { threadTitle = t.ThreadTitle, threadId = t.ThreadId });

                return Ok(searchResults);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ThreadController] Error in searching thread.");
                return StatusCode(500, "Error while searching threads.");
            }
        }

        [HttpGet("getByRecent")]
        public IActionResult GetThreadsByRecent()
        {
            try
            {
                // Implement logic to get threads by most recent
                var threads = _threadRepository.GetThreadsByRecent().ToList();
                return Ok(threads);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ThreadController] An error occurred in the GetThreadsByRecent action.");
                return StatusCode(500, "An error occurred while fetching threads by recent.");
            }
        }

        [HttpGet("getByComments")]
        public IActionResult GetThreadsByComments()
        {
            try
            {
                // Implement logic to get threads by most comments
                var threads = _threadRepository.GetThreadsByComments().ToList();
                return Ok(threads);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[ThreadController] An error occurred in the GetThreadsByComments action.");
                return StatusCode(500, "An error occurred while fetching threads by comments.");
            }
        }
    }
}