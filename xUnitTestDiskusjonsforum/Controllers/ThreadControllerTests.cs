using diskusjonsforum_v2.Controllers;
using diskusjonsforum_v2.DAL;
using Microsoft.AspNetCore.Mvc;
using diskusjonsforum_v2.Models;
using Microsoft.Extensions.Logging;
using Moq;
using NuGet.Protocol;
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
        mockCommentRepository.Setup(repo => repo.GetThreadComments(It.IsAny<int>()))
            .Returns((int threadId) => commentList.Where(c => c.ThreadId == threadId).AsQueryable());
        var mockLogger = new Mock<ILogger<ThreadController>>();
        var threadController =
            new ThreadController(mockThreadRepository.Object, mockCommentRepository.Object, mockLogger.Object);
        
        //Act
        var result = threadController.GetThreads();
        
        //Assert that result object is OkObjectResult and that it returns a list of threads 
        var viewResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, viewResult.StatusCode);
        var threadListResult = Assert.IsAssignableFrom<List<Thread>>(viewResult.Value);
        Assert.Equal(2, threadListResult.Count);

        //Assert that comments are returned and associated with the correct thread. 
        var firstThreadComments = commentList.Where(comment => comment.ThreadId == 1).ToList();
        var secondThreadComments = commentList.Where(comment => comment.ThreadId == 2).ToList();
        Assert.NotNull(firstThreadComments);
        Assert.NotNull(secondThreadComments);
        
        //Assert that thread 1 and thread 2 contain the correct comments 
        Assert.Equal(firstThreadComments[0].CommentId, threadListResult[0].ThreadComments![0].CommentId);
        Assert.Equal(secondThreadComments[0].CommentId, threadListResult[1].ThreadComments![0].CommentId);
        //By testing GetThreads and asserting that the Thread contains the expected comments,
        //we also test the functionality of the GetThreadComments method
        
    }
    
    [Fact]
    public async Task TestGetThread()
    { 
        //Arrange
        Thread thread = new Thread
        {
            ThreadId = 1,
            ThreadBody = "Test body",
            ThreadComments = new List<Comment>(),
            ThreadTitle = "Test title",
            ThreadCreatedAt = new DateTime(2023, 10, 10, 10, 10, 10),
            ThreadLastEditedAt = new DateTime(2023, 10, 10, 10, 10, 10),
            CreatedBy = "Stilian"
        };
      
        var mockThreadRepository = new Mock<IThreadRepository>();
        var mockCommentRepository = new Mock<ICommentRepository>();
        mockThreadRepository.Setup(repo => repo.GetThreadById(thread.ThreadId)).Returns(thread);
        var mockLogger = new Mock<ILogger<ThreadController>>();
        var threadController =
            new ThreadController(mockThreadRepository.Object, null, mockLogger.Object);
        
        //Act
        var result = threadController.GetThread(thread.ThreadId);
        
        //Assert that result object is OkObjectResult and that it returns the expected thread
        var viewResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, viewResult.StatusCode);
        var threadResult = Assert.IsAssignableFrom<Thread>(viewResult.Value);
        Assert.Equal(thread, threadResult);
    }

    [Fact]
    public async Task TestCreateThread()
    {
        //Arrange
        var validThread = new Thread
        {
            ThreadBody = "Test body",
            ThreadTitle = "Test title",
            CreatedBy = "Stilian"
        };
        
        var mockThreadRepository = new Mock<IThreadRepository>();
        var mockLogger = new Mock<ILogger<ThreadController>>();
        mockThreadRepository.Setup(repo => repo.Add(validThread)).ReturnsAsync(true);

        var threadController =
            new ThreadController(mockThreadRepository.Object, null!, mockLogger.Object);

        //Act
        var result = threadController.CreateThread(validThread);

        //Assert 
        var result1 = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(200, result1.StatusCode);

        
    }
    
     [Fact]
    public async Task TestCreateThread_Invalid()
    {
        //Arrange
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
      
        var mockThreadRepository = new Mock<IThreadRepository>();
        var mockCommentRepository = new Mock<ICommentRepository>();
        var mockLogger = new Mock<ILogger<ThreadController>>();
        mockThreadRepository.Setup(repo => repo.Add(It.IsAny<Thread>())).ReturnsAsync(false);

        var threadController =
            new ThreadController(mockThreadRepository.Object, mockCommentRepository.Object, mockLogger.Object);

        //Act
        var act1 = threadController.CreateThread(invalidThread1);
        var act2 = threadController.CreateThread(invalidThread2);

        //Assert 
        var result1 = Assert.IsType<BadRequestObjectResult>(act1.Result);
        Assert.Equal(400, result1.StatusCode);
        var result2 = Assert.IsType<BadRequestObjectResult>(act2.Result);
        Assert.Equal(400, result2.StatusCode);


        
    }

    [Fact]
    public async Task TestUpdateThread()
    {
        //Arrange
        var thread1 = new Thread
        {
            ThreadBody = "Test body",
            ThreadTitle = "Test title",
            CreatedBy = "Stilian"
        };
        
        var mockThreadRepository = new Mock<IThreadRepository>();
        var mockLogger = new Mock<ILogger<ThreadController>>();

        mockThreadRepository.Setup(repo => repo.Update(thread1)).ReturnsAsync(true);
        mockThreadRepository.Setup(repo => repo.GetThreadById(thread1.ThreadId)).Returns(thread1);
        var threadController = new ThreadController(mockThreadRepository.Object, null!, mockLogger.Object);

        // Act
        var result = await threadController.UpdateThread(thread1.ThreadId, thread1);

        // Assert
        var result1 = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, result1.StatusCode);
    }
    
    [Fact]
    public async Task TestUpdateThread_invalid()
    {
        //Arrange
        var thread1 = new Thread
        {
            ThreadBody = null!
        };
        
        var mockThreadRepository = new Mock<IThreadRepository>();
        var mockLogger = new Mock<ILogger<ThreadController>>();

        mockThreadRepository.Setup(repo => repo.Update(thread1)).ReturnsAsync(false);
        var threadController = new ThreadController(mockThreadRepository.Object, null!, mockLogger.Object);

        // Act
        var result = await threadController.UpdateThread(thread1.ThreadId, thread1);

        // Assert
        var result1 = Assert.IsType<BadRequestResult>(result);
        Assert.Equal(400, result1.StatusCode);
    }
    
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

    [Fact]
    public async Task TestSearchThreads()
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
        
        var mockThreadRepository = new Mock<IThreadRepository>();
        var mockCommentRepository = new Mock<ICommentRepository>();
        mockThreadRepository.Setup(repo => repo.GetAll()).Returns(threadList);
        //commentRepository.GetThreadComments returns list of comments that belong to a specific thread 
        //It.IsAny<int> represents the argument of type Thread, which is used to pass the ThreadId to the method in ThreadController. 
        var mockLogger = new Mock<ILogger<ThreadController>>();
        var threadController =
            new ThreadController(mockThreadRepository.Object, null, mockLogger.Object);
        
        //Act
        var result = threadController.SearchThreads(threadList[1].ThreadTitle);
        
        //Assert that result object is OkObjectResult and that the object contains the title that was passed as a search query
        var viewResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, viewResult.StatusCode);
        var searchResult = viewResult.Value;
        Assert.Contains(threadList[1].ThreadTitle, searchResult.ToJson());

    }

    
}

