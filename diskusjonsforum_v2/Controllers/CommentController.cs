using Microsoft.AspNetCore.Mvc;
using diskusjonsforum_v2.Models;
using diskusjonsforum_v2.DAL;


namespace diskusjonsforum_v2.Controllers
{

    [Route("api/comments")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        //Initialise controllers and interfaces for constructor
        private readonly ICommentRepository _commentRepository;
        private readonly ILogger<CommentController> _logger;

        public CommentController(ICommentRepository commentRepository, 
            ILogger<CommentController> logger)
        {
            _commentRepository = commentRepository;
            _logger = logger;
        }

        //Returns all comments 
        [HttpGet("getByThread/{parentThreadId}")]
        public IActionResult GetComments(int parentThreadId)
        {
            try
            {
                var comments = _commentRepository.GetThreadComments(parentThreadId);
                return Ok(comments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[CommentController] An error occurred in GetComments action.");
                return StatusCode(500, "An error occurred while fetching comments");
            }
        }

        [HttpPost("addComment/{threadId}")]
        public ActionResult Create(int threadId, [FromBody] Comment newComment)
        {
            try
            {
                newComment.ThreadId = threadId;

                _commentRepository.Add(newComment);

                var response = new
                {
                    success = true,
                    message = $"Comment {newComment.CommentId} created successfully"
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[CommentController] An error occurred in Create action.");
                return StatusCode(500, "Error occurred while creating the comment.");
            }
        }


        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] Comment comment)
        {
            try
            {
                bool returnOk = await _commentRepository.Update(comment);
                if (returnOk)
                {
                    return NoContent();
                }

                return BadRequest("Comment updated failed.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[CommentController] An error occurred in UpdateComment action.");
                return StatusCode(500, "Error occurred while updating the comment.");
            }
        }

        [HttpDelete("delete/{id}")]
        public IActionResult DeleteComment(int id)
        {
            try
            {
                _commentRepository.Remove(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[CommentController] An error occurred in DeleteComment action.");
                return StatusCode(500, "Error occurred while deleting the comment.");
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
}