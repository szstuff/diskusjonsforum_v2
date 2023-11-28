using diskusjonsforum_v2.Controllers;
using diskusjonsforum_v2.DAL;
using Microsoft.AspNetCore.Mvc;
using diskusjonsforum_v2.Models;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Logging;
using Moq;
using Thread = diskusjonsforum_v2.Models.Thread;

namespace xUnitTestDiskusjonsforum.Controllers;

public class ThreadControllerTests
{
    [Fact]
    public async Task TestGetThreads()
    { 
        //Arrange
        var threadList = new List<Thread>
        {
            new Thread
            {
                ThreadId = 1,
                ThreadBody = "Test body",
                ThreadComments = new List<Comment>(),
                ThreadTitle = "Test title",
                ThreadCreatedAt = new DateTime(2023, 10, 10, 10, 10, 10),
                ThreadLastEditedAt = new DateTime(2023, 10, 10, 10, 10, 10),
                CreatedBy = "Stilian"
            }, new Thread
            {
                ThreadId = 2,
                ThreadBody = "Test body 2",
                ThreadComments = new List<Comment>(),
                ThreadTitle = "Test title 2",
                ThreadCreatedAt = new DateTime(2023, 10, 10, 10, 10, 10),
                ThreadLastEditedAt = new DateTime(2023, 11, 10, 10, 10, 10),
                CreatedBy = "Jovia"
            }
        };
        var commentList = new List<Comment>
        {
            new Comment
            {
                CommentId = 1,
                CommentBody = "Comment 1",
                CommentCreatedAt = new DateTime(2023, 10, 11, 10, 10, 10),
                CommentLastEditedAt = new DateTime(2023, 10, 11, 10, 10, 10),
                CreatedBy = "Stilian",
                ThreadId = 1,
            },
            new Comment
            {
                CommentId = 2,
                CommentBody = "Comment 2",
                CommentCreatedAt = new DateTime(2023, 11, 11, 10, 10, 10),
                CommentLastEditedAt = new DateTime(2023, 11, 12, 10, 10, 10),
                CreatedBy = "Jovia",
                ThreadId = 2,
            }
        };
        var mockThreadRepository = new Mock<IThreadRepository>();
        var mockCommentRepository = new Mock<ICommentRepository>();
        mockThreadRepository.Setup(repo => repo.GetAll()).Returns(threadList);
        //commentRepository.GetThreadComments returns list of comments that belong to a specific thread 
        //It.IsAny<int> represents the argument of type Thread, which is used to pass the ThreadId to the method in ThreadController. 
        mockCommentRepository.Setup(repo => repo.GetThreadComments(It.IsAny<int>())).Returns((int threadId) => commentList.Where(c => c.ThreadId == threadId).AsQueryable());
        var mockLogger = new Mock<ILogger<ThreadController>>();
        var threadController =
            new ThreadController(mockThreadRepository.Object, mockCommentRepository.Object, mockLogger.Object);
        
        //Act
        var result = threadController.GetThreads();
        
        //Assert that result object is OkObjectResult and that it returns a list of threads 
        var viewResult = Assert.IsType<OkObjectResult>(result);
        var threadListResult = Assert.IsAssignableFrom<List<Thread>>(viewResult.Value);
        Assert.Equal(2, threadListResult.Count);

        //Assert that comments are returned and associated with the correct thread. 
        var firstThreadComments = commentList.Where(comment => comment.ThreadId == 1).ToList();
        var secondThreadComments = commentList.Where(comment => comment.ThreadId == 2).ToList();
        Assert.NotNull(firstThreadComments);
        Assert.NotNull(secondThreadComments);
        
        //Assert that thread 1 and thread 2 contain the correct comments 
        Assert.Equal(firstThreadComments[0].CommentId, threadListResult[0].ThreadComments[0].CommentId);
        Assert.Equal(secondThreadComments[0].CommentId, threadListResult[1].ThreadComments[0].CommentId);
        //By testing GetThreads and asserting that the Thread contains the expected comments,
        //we also test the functionality of the GetThreadComments method
        
    }

    [Fact]
    public async Task TestCreateThread()
    {
        //Assert
        var validThread = new Thread
        {
            ThreadBody = "Test body",
            ThreadTitle = "Test title",
            CreatedBy = "Stilian"
        };
        
        var mockThreadRepository = new Mock<IThreadRepository>();
        var mockCommentRepository = new Mock<ICommentRepository>();
        var mockLogger = new Mock<ILogger<ThreadController>>();
        mockThreadRepository.Setup(repo => repo.Add(validThread)).ReturnsAsync(true);

        var threadController =
            new ThreadController(mockThreadRepository.Object, null, mockLogger.Object);

        //Act
        var result = threadController.CreateThread(validThread);

        //Assert 
        Assert.IsType<OkObjectResult>(result.Result);
        
    }
    
     [Fact]
    public async Task TestCreateThread_Invalid()
    {
        //Assert
        var invalidThread1 = new Thread();
        var invalidThread2 = new Thread
        {
            ThreadBody = "Test body",
            ThreadComments = new List<Comment>(),
            ThreadTitle = "Test title",
            ThreadCreatedAt = new DateTime(2023, 10, 10, 10, 10, 10),
            ThreadLastEditedAt = new DateTime(2023, 10, 10, 10, 10, 10),
            CreatedBy = "Stilian"
        };
        var invalidThread3 = new Thread
        {
            ThreadBody = "Test body",
            ThreadComments = new List<Comment>(),
            ThreadTitle = "Test title",
            ThreadCreatedAt = new DateTime(2023, 10, 10, 10, 10, 10),
            ThreadLastEditedAt = new DateTime(2023, 10, 10, 10, 10, 10),
            CreatedBy = "Stilian"
        };
        var mockThreadRepository = new Mock<IThreadRepository>();
        var mockCommentRepository = new Mock<ICommentRepository>();
        var mockLogger = new Mock<ILogger<ThreadController>>();
        var threadController =
            new ThreadController(mockThreadRepository.Object, mockCommentRepository.Object, mockLogger.Object);

        //Act
        var result1 = threadController.CreateThread(invalidThread1);
        var result2 = threadController.CreateThread(invalidThread2);
        var result3 = threadController.CreateThread(invalidThread3);

        //Assert 
        Assert.IsType<BadRequestObjectResult>(result1.Result);
        Assert.IsType<BadRequestObjectResult>(result2.Result);
        Assert.IsType<BadRequestObjectResult>(result3.Result);

        
    }

    [Fact]
    public async Task UpdateThreadTest()
    {
        //Assert
        var thread1 = new Thread
        {
            ThreadBody = "Test body",
            ThreadTitle = "Test title",
            CreatedBy = "Stilian"
        };
        
        //Assert
        var thread2 = new Thread
        {
            ThreadBody = "Test body2",
            ThreadTitle = "Test title2",
            CreatedBy = "Jovia"
        };
        
        var mockThreadRepository = new Mock<IThreadRepository>();
        var mockLogger = new Mock<ILogger<ThreadController>>();

        mockThreadRepository.Setup(repo => repo.Update(thread1)).ReturnsAsync(true);
        var threadController = new ThreadController(mockThreadRepository.Object, null, mockLogger.Object);

        // Act
        var result = await threadController.UpdateThread(thread1.ThreadId, thread1);

        // Assert
        var noContentResult = Assert.IsType<NoContentResult>(result);
        Assert.Equal(204, noContentResult.StatusCode);
    }
    
    public Task DeleteThreadTest()
    {
        throw new NotImplementedException();
    }

    public Task SearchThreadsTest()
    {
        throw new NotImplementedException();
    }

    
}

