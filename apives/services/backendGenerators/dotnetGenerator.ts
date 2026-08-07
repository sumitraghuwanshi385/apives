import { ArchitectProject } from '../architectEngine';
import { FrameworkCodePreview } from './types';

export function generateDotnetBackend(project: ArchitectProject): FrameworkCodePreview {
  const nameSlug = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return {
    framework: 'ASP.NET Core',
    description: 'C# .NET 8 Web API with Entity Framework Core, JWT Bearer, Serilog, FluentValidation, and Swashbuckle Swagger.',
    setupCommands: [
      `git clone https://github.com/apives/${nameSlug}-dotnet.git`,
      `cd ${nameSlug}-dotnet`,
      `dotnet restore`,
      `dotnet ef database update`,
      `dotnet run`
    ],
    files: [
      {
        name: 'Folder Structure',
        path: 'structure.txt',
        category: 'Folder Structure',
        content: `${nameSlug}-dotnet/
├── Controllers/
│   └── ResourcesController.cs
├── Data/
│   └── AppDbContext.cs
├── Models/
│   └── Resource.cs
├── Middleware/
│   └── ExceptionMiddleware.cs
├── Program.cs
├── Dockerfile
├── appsettings.json
└── README.md`
      },
      {
        name: 'C# ApiController',
        path: 'Controllers/ResourcesController.cs',
        category: 'Controllers',
        content: `using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Apives.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize]
    public class ResourcesController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetResources()
        {
            return Ok(new[] { new { Id = "res_01", Title = ".NET 8 Node" } });
        }
    }
}`
      },
      {
        name: 'Attribute Routing',
        path: 'Program.cs',
        category: 'Routes',
        content: `app.MapControllers();`
      },
      {
        name: 'EF Core Model',
        path: 'Models/Resource.cs',
        category: 'Models',
        content: `using System.ComponentModel.DataAnnotations;

namespace Apives.Models
{
    public class Resource
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public required string Title { get; set; }
        public string Status { get; set; } = "ACTIVE";
    }
}`
      },
      {
        name: 'JWT Bearer Config',
        path: 'Program.cs',
        category: 'Authentication',
        content: `builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = "apives.com"
        };
    });`
      },
      {
        name: 'FluentValidation DTO',
        path: 'Validators/ResourceValidator.cs',
        category: 'Validation',
        content: `using FluentValidation;

public class ResourceValidator : AbstractValidator<ResourceDto> {
    public ResourceValidator() {
        RuleFor(x => x.Title).NotEmpty().MinimumLength(3);
    }
}`
      },
      {
        name: 'appsettings.json',
        path: 'appsettings.json',
        category: 'Environment Variables',
        content: `{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ApivesDb;User Id=sa;Password=Secret123!;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Secret": "dotnet_super_secret_jwt_key_9988"
  }
}`
      },
      {
        name: 'EF Core DbContext',
        path: 'Data/AppDbContext.cs',
        category: 'Database Connection',
        content: `using Microsoft.EntityFrameworkCore;
using Apives.Models;

namespace Apives.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
        public DbSet<Resource> Resources { get; set; }
    }
}`
      },
      {
        name: '.NET Dockerfile',
        path: 'Dockerfile',
        category: 'Docker Configuration',
        content: `FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY *.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 80
ENTRYPOINT ["dotnet", "Apives.dll"]`
      },
      {
        name: 'Swashbuckle Swagger',
        path: 'Program.cs',
        category: 'Swagger/OpenAPI Integration',
        content: `builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();`
      },
      {
        name: 'Health Check',
        path: 'Program.cs',
        category: 'Health Check Endpoint',
        content: `app.MapHealthChecks("/health");`
      },
      {
        name: 'Rate Limiter',
        path: 'Program.cs',
        category: 'Rate Limiting',
        content: `builder.Services.AddRateLimiter(_ => _
    .AddFixedWindowLimiter(policyName: "fixed", options => {
        options.PermitLimit = 100;
        options.Window = TimeSpan.FromMinutes(1);
    }));`
      },
      {
        name: 'Serilog Config',
        path: 'Program.cs',
        category: 'Logging',
        content: `builder.Host.UseSerilog((ctx, lc) => lc.WriteTo.Console());`
      },
      {
        name: 'Exception Middleware',
        path: 'Middleware/ExceptionMiddleware.cs',
        category: 'Error Handling',
        content: `public class ExceptionMiddleware {
    // Global exception handler
}`
      },
      {
        name: 'xUnit Unit Test Scaffold',
        path: 'tests/ApiControllerTests.cs',
        category: 'Unit Tests & Scaffolding',
        content: `using Xunit;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Apives.Tests
{
    public class ApiControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public ApiControllerTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetHealth_ReturnsSuccessAndCorrectContentType()
        {
            var response = await _client.GetAsync("/health");
            response.EnsureSuccessStatusCode();
            Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType.ToString());
        }
    }
}`
      },
      {
        name: 'C# README',
        path: 'README.md',
        category: 'README Preview',
        content: `# ${project.name} (.NET 8 Web API)`
      }
    ]
  };
}
