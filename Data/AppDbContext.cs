using Microsoft.EntityFrameworkCore;
using MealPlanPlatform.API.Models;

namespace MealPlanPlatform.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<UserHealthProfile> UserHealthProfiles { get; set; }
        public DbSet<MealPlan> MealPlans { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<Coach> Coaches { get; set; }
        public DbSet<UserCoach> UserCoaches { get; set; }
        public DbSet<Progress> Progresses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User - HealthProfile (One to One)
            modelBuilder.Entity<UserHealthProfile>()
                .HasOne(h => h.User)
                .WithOne(u => u.HealthProfile)
                .HasForeignKey<UserHealthProfile>(h => h.UserId);

            // User - MealPlans (One to Many)
            modelBuilder.Entity<MealPlan>()
                .HasOne(m => m.User)
                .WithMany(u => u.MealPlans)
                .HasForeignKey(m => m.UserId);

            // User - Subscriptions (One to Many)
            modelBuilder.Entity<Subscription>()
                .HasOne(s => s.User)
                .WithMany(u => u.Subscriptions)
                .HasForeignKey(s => s.UserId);

            // User - Progress (One to Many)
            modelBuilder.Entity<Progress>()
                .HasOne(p => p.User)
                .WithMany(u => u.ProgressRecords)
                .HasForeignKey(p => p.UserId);

            // UserCoach (Many to Many bridge)
            modelBuilder.Entity<UserCoach>()
                .HasOne(uc => uc.User)
                .WithMany(u => u.UserCoaches)
                .HasForeignKey(uc => uc.UserId);

            modelBuilder.Entity<UserCoach>()
                .HasOne(uc => uc.Coach)
                .WithMany(c => c.UserCoaches)
                .HasForeignKey(uc => uc.CoachId);
        }
    }
}