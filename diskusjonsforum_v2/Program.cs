using diskusjonsforum_v2.DAL;
using diskusjonsforum_v2.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<ThreadDbContext>(options => {
    options.UseSqlite(
        builder.Configuration["ConnectionStrings:ThreadDbContextConnection"]);
});
builder.Services.AddScoped<IThreadRepository, ThreadRepository>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();


var loggerConfiguration = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.File($"Logs/app_{DateTime.Now:yyyyMMdd_HHmmss}.log");

loggerConfiguration.Filter.ByExcluding(e => e.Properties.TryGetValue("SourceContext", out var value) &&
                                       e.Level == LogEventLevel.Information &&
                                       e.MessageTemplate.Text.Contains("Executed DbCommand"));

var logger = loggerConfiguration.CreateLogger();
builder.Logging.AddSerilog(logger);


/*
 builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        // Password settings
        options.Password.RequireDigit = true;
        options.Password.RequiredLength = 8;
        options.Password.RequireNonAlphanumeric = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireLowercase = true;
        options.Password.RequiredUniqueChars = 1;

        // Lockout settings
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(60);
        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.AllowedForNewUsers = true;

        // User settings
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<ThreadDbContext>()
    .AddDefaultTokenProviders()
    .AddDefaultUI();
*/
builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.Cookie.Name = ".AdventureWorks.Session";
    options.IdleTimeout = TimeSpan.FromSeconds(3600); //1 hour
    options.Cookie.IsEssential = true;
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
}

app.UseStaticFiles();

app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();

