using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using UseCaseFinalSubmission.Database;
using UseCaseFinalSubmission.Repository;
using UseCaseFinalSubmission.Services;
using UseCaseFinalSubmission.Services.Interfaces;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Services
        builder.Services.AddScoped<IAdminService, AdminService>();
        builder.Services.AddScoped<ICourseService, CourseService>();
        builder.Services.AddScoped<IStudentService, StudentService>();




        builder.Services.AddDbContext<AppDbContext>(options =>
        {
            options.UseSqlServer(builder.Configuration.GetConnectionString("Main1"));
        });


        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowReactApp",
                policy =>
                {
                    policy.WithOrigins("http://localhost:3000") // React app URL
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
        });

        var key = Encoding.ASCII.GetBytes(builder.Configuration.GetValue<string>("Key"));

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;  //validating the token SuccessFul Or Not
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;//if failure occurs 
        }).AddJwtBearer(options =>
        {
            options.SaveToken = true;
            options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateIssuerSigningKey = true,
                
                IssuerSigningKey = new SymmetricSecurityKey(key)
            };
        });

        //telling to swagger
        builder.Services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme()
            {
                In = Microsoft.OpenApi.Models.ParameterLocation.Header, //where to add the token http header
                Description = "Please Enter Bearer [Space] and The Token Generated",
                Scheme = "Bearer",
                Name = "Authorization", //authization header
            });

            options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement()
            { //applying the scheme globally endpoint
                {
                    new Microsoft.OpenApi.Models.OpenApiSecurityScheme()
                    {
                        Reference=new Microsoft.OpenApi.Models.OpenApiReference()
                        {
                            Type=Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                            Id="Bearer"
                        }
                    },
                    new string[]{}
                }
            });
        });



var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors("AllowReactApp");

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}