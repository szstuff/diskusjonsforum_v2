using diskusjonsforum_v2.Controllers;
using diskusjonsforum_v2.DAL;
using Microsoft.AspNetCore.Mvc;
using diskusjonsforum_v2.Models;
using Microsoft.Extensions.Logging;
using Moq;

namespace xUnitTestDiskusjonsforum.Controllers;

public class CommentControllerTests
{
    [Fact]
    public void TestGetComments()
    {
        // Arrange
        var comments = new List<Comment>
        {
            new Comment { CommentId = 1, CommentBody = "Test 1" },
            new Comment { CommentId = 2, CommentBody = "Test 2" }
        };
        var mockCommentRepository = new Mock<ICommentRepository>();
        var mockLogger = new Mock<ILogger<CommentController>>();
        var parentThreadId = 1;
        
        mockCommentRepository.Setup(repo => repo.GetThreadComments(parentThreadId)).Returns(comments.AsQueryable);
        var commentController = new CommentController(mockCommentRepository.Object, mockLogger.Object);

        // Act
        var result = commentController.GetComments(parentThreadId);

        //Assert that result object is OkObjectResult and that it returns a list of comments 
        var result1 = Assert.IsType<OkObjectResult>(result);
        var returnedlistQueryable = Assert.IsAssignableFrom<IQueryable<Comment>>(result1.Value);
        var returnedlist = returnedlistQueryable.ToList();
        Assert.Equal(comments.Count, returnedlist.Count());

        //Assert contents of returned comments 
        Assert.Equal("Test 1", returnedlist[0].CommentBody);
        Assert.Equal("Test 2", returnedlist[1].CommentBody);
    }

    [Fact]
    public void TestCreateComment()
    {
        // Arrange
        var validComment = new Comment()
        {
            CommentId = 1, CommentBody = "Hei",
        };
        
        var mockCommentRepository = new Mock<ICommentRepository>();
        var mockLogger = new Mock<ILogger<CommentController>>();
        
        mockCommentRepository.Setup(repo => repo.Add(validComment)).ReturnsAsync(true);
        var commentController = new CommentController(mockCommentRepository.Object, mockLogger.Object);

        // Act
        var result = commentController.Create(1, validComment);

        //Assert that result object is OkObjectResult with expected status code  
        var result1 = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, result1.StatusCode);

    }
    
    [Fact]
    public void TestCreateComment_invalid()
    {
        // Arrange
        var invalidComment = new Comment();
        var invalidComment2 = new Comment()
        {
            CommentId = 1, CommentBody = "Hei",
        };
        
        var mockCommentRepository = new Mock<ICommentRepository>();
        var mockLogger = new Mock<ILogger<CommentController>>();
        
        mockCommentRepository.Setup(repo => repo.Add(It.IsAny<Comment>())).ReturnsAsync(false);
        var commentController = new CommentController(mockCommentRepository.Object, mockLogger.Object);

        // Act
        var act1 = commentController.Create(1, invalidComment);
        var act2 = commentController.Create(1, invalidComment2);


        //Assert that result object is ObjectResult with expected status code  
        var result1 = Assert.IsType<ObjectResult>(act1);
        Assert.Equal(500, result1.StatusCode);
        var result2 = Assert.IsType<ObjectResult>(act2);
        Assert.Equal(500, result2.StatusCode);

    }

    [Fact]
    public void TestUpdateComment()
    {
        //Arrange
        var comment = new Comment()
        {
            CommentId = 1, CommentBody = "Hei",
        };
        var mockCommentRepository = new Mock<ICommentRepository>();
        var mockLogger = new Mock<ILogger<CommentController>>();
        
        mockCommentRepository.Setup(repo => repo.GetById(comment.CommentId)).Returns(comment);
        mockCommentRepository.Setup(repo => repo.Update(It.IsAny<Comment>())).ReturnsAsync(true);
        var commentController = new CommentController(mockCommentRepository.Object, mockLogger.Object);

        //Act
        var result = commentController.UpdateComment(comment.CommentId, comment);
        
        //Assert
        var result1 = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(200, result1.StatusCode);

    }
    
    [Fact]
    public void TestUpdateComment_invalid()
    {
        //Arrange
        var invalidcomment = new Comment()
        {
            CommentId = 1, CommentBody = "Hei",
        };
        var mockCommentRepository = new Mock<ICommentRepository>();
        var mockLogger = new Mock<ILogger<CommentController>>();
        
        mockCommentRepository.Setup(repo => repo.Update(It.IsAny<Comment>())).ReturnsAsync(false);
        var commentController = new CommentController(mockCommentRepository.Object, mockLogger.Object);

        //Act
        var result = commentController.UpdateComment(invalidcomment.CommentId, invalidcomment);
        
        //Assert
        var result1 = Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.Equal(404, result1.StatusCode);
    }

    [Fact]
    public void TestDeleteComment()
    {
        //Arrange
        var commentIdToDelete = 1;
        
        var mockCommentRepository = new Mock<ICommentRepository>();
        var mockLogger = new Mock<ILogger<CommentController>>();
        
        mockCommentRepository.Setup(repo => repo.Remove(commentIdToDelete)).Returns(Task.FromResult(true));
        var commentController = new CommentController(mockCommentRepository.Object, mockLogger.Object);

        //Act
        var result = commentController.DeleteComment(commentIdToDelete);
        
        //Assert
        var result1 = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, result1.StatusCode);
    }
    
    [Fact]
    public void TestDeleteComment_invalid()
    {
        //Arrange
        var commentIdToDelete = 20;
        
        var mockCommentRepository = new Mock<ICommentRepository>();
        var mockLogger = new Mock<ILogger<CommentController>>();
        
        mockCommentRepository.Setup(repo => repo.Remove(commentIdToDelete)).Returns(Task.FromResult(false));
        var commentController = new CommentController(mockCommentRepository.Object, mockLogger.Object);

        //Act
        var result = commentController.DeleteComment(commentIdToDelete);
        
        //Assert
        var result1 = Assert.IsType<NotFoundResult>(result);
        Assert.Equal(404, result1.StatusCode);
    }
}

/*

   [Fact]
   public async Task TestDeleteThread()
   {
   // Arrange
   int threadIdToDelete = 1;
   var mockThreadRepository = new Mock<IThreadRepository>();
   mockThreadRepository.Setup(repo => repo.GetThreadById(It.IsAny<int>())).Returns(new Thread { ThreadId = threadIdToDelete });
   var mockLogger = new Mock<ILogger<ThreadController>>();
   var threadController = new ThreadController(mockThreadRepository.Object, null!, mockLogger.Object);
   
   // Act
   var result = await threadController.DeleteThread(threadIdToDelete);
   
   // Assert
   var result1 = Assert.IsType<OkObjectResult>(result);
   Assert.Equal(200, result1.StatusCode);
   }
   
   [Fact]
   public async Task TestDeleteThread_Invalid()
   {
   // Arrange
   int threadId = 20;
   var mockThreadRepository = new Mock<IThreadRepository>();
   mockThreadRepository.Setup(repo => repo.GetThreadById(It.IsAny<int>())).Returns((Thread)null!);
   var mockLogger = new Mock<ILogger<ThreadController>>();
   var threadController = new ThreadController(mockThreadRepository.Object, null!, mockLogger.Object);
   
   // Act
   var result = await threadController.DeleteThread(threadId);
   
   // Assert
   var result1 = Assert.IsType<NotFoundResult>(result);
   Assert.Equal(404, result1.StatusCode);
   }
   
   
   */