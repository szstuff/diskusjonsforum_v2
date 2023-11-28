using diskusjonsforum_v2.Controllers;
using diskusjonsforum_v2.DAL;
using Microsoft.AspNetCore.Mvc;
using diskusjonsforum_v2.Models;
using Microsoft.Extensions.Logging;
using Moq;
using NuGet.Protocol;
using Thread = diskusjonsforum_v2.Models.Thread;

namespace xUnitTestDiskusjonsforum.Controllers;

public class CommentControllerTests
{
    [Fact]
    public void TestGetComments()
    {
        // Arrange
        var comments = new List<Comment>
        {
            new Comment { CommentId = 1, CommentBody = "Test Comment 1" },
            new Comment { CommentId = 2, CommentBody = "Test Comment 2" }
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
        Assert.Equal("Test Comment 1", returnedlist[0].CommentBody);
        Assert.Equal("Test Comment 2", returnedlist[1].CommentBody);
    }
}