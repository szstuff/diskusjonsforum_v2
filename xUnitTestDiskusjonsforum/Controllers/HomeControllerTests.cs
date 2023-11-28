using diskusjonsforum_v2.Controllers;
using diskusjonsforum_v2.DAL;
using Microsoft.AspNetCore.Mvc;
using diskusjonsforum_v2.Models;
using Microsoft.Extensions.Logging;
using Moq;
using Thread = diskusjonsforum_v2.Models.Thread;

namespace xUnitTestDiskusjonsforum.Controllers;

public class HomeControllerTests
{
    [Fact]
    public async Task IndexTest()
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
        mockThreadRepository.Setup(repo => repo.GetAll()).Returns(threadList);
        var mockLogger = new Mock<ILogger<HomeController>>();
        var homeController =
            new HomeController(mockLogger.Object, mockThreadRepository.Object);
        
        //Act
        var result = homeController.Index();
        
        //Assert that result object is OkObjectResult and that it returns a list of threads 
        var viewResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, viewResult.StatusCode);
        var threadListResult = Assert.IsAssignableFrom<List<Thread>>(viewResult.Value);
        Assert.Equal(2, threadListResult.Count);
        
        
    }
}