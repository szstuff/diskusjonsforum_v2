
using diskusjonsforum_v2.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace diskusjonsforum_v2.DAL;


public class diskusjonsforumIdentityDbContext : IdentityDbContext<ApplicationUser>
{
    public diskusjonsforumIdentityDbContext(DbContextOptions<diskusjonsforumIdentityDbContext> options)
        : base(options)
    {
    }
}