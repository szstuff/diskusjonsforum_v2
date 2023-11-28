using Microsoft.AspNetCore.Mvc;
using diskusjonsforum_v2.Models;
using diskusjonsforum_v2.DAL;


namespace diskusjonsforum_v2.Controllers
{
    // defines the base route and indicate that it is an API controller
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

        // Return all comments 
        [HttpGet("getByThread/{parentThreadId}")]
        public ActionResult GetComments(int parentThreadId)
        {
            try
            {

                var comments = _commentRepository.GetThreadComments(parentThreadId);
                return Ok(comments);
            }
            catch (Exception ex)
            {
                // if an exception occurs an error is logged
                _logger.LogError(ex, "[CommentController] An error occurred in GetComments action.");
                return StatusCode(500, "An error occurred while fetching comments");
            }
        }

        // Adds comment to the thread it belongs to by threadID
        [HttpPost("addComment/{threadId}")]
        public ActionResult Create(int threadId, [FromBody] Comment newComment)
        {
            try
            {
                // set comment details for user and adds the new comment
                newComment.ThreadId = threadId;
                _commentRepository.Add(newComment);
                // success message when the comment is successfully made
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

        // updates comment by id
        [HttpPut("update/{id}")]
        public async Task<ActionResult> UpdateComment(int id, [FromBody] Comment comment)
        {
            try
            {
                // returns NoContent if the update is successful and if not it returns a Badrequest response
                bool returnOk = await _commentRepository.Update(comment);
                if (returnOk)
                {
                    return NoContent();
                }

                return BadRequest("Comment updated failed.");
            }
            catch (Exception ex)
            {
                // the error is logged if an axception occurs an returns a statuscode
                _logger.LogError(ex, "[CommentController] An error occurred in UpdateComment action.");
                return StatusCode(500, "Error occurred while updating the comment.");
            }
        }

        // deletes comment by id
        [HttpDelete("delete/{id}")]
        public IActionResult DeleteComment(int id)
        {
            try
            {
                var deletedComment = _commentRepository.Remove(id);
                if (deletedComment == null)
                {
                    return NotFound(); // Return NotFound if the comment was not found
                }

                return Ok(new { success = true, message = "Comment deleted successfully", deletedComment });
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