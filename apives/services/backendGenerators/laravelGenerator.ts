import { ArchitectProject } from '../architectEngine';
import { FrameworkCodePreview } from './types';

export function generateLaravelBackend(project: ArchitectProject): FrameworkCodePreview {
  const nameSlug = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return {
    framework: 'Laravel',
    description: 'PHP 8.3 Laravel 11 REST API with Sanctum / Passport auth, Eloquent ORM, Request validation, and Scramble OpenAPI.',
    setupCommands: [
      `git clone https://github.com/apives/${nameSlug}-laravel.git`,
      `cd ${nameSlug}-laravel`,
      `composer install`,
      `cp .env.example .env`,
      `php artisan key:generate`,
      `php artisan migrate`,
      `php artisan serve`
    ],
    files: [
      {
        name: 'Folder Structure',
        path: 'structure.txt',
        category: 'Folder Structure',
        content: `${nameSlug}-laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Requests/
│   └── Models/
├── config/
├── database/
│   └── migrations/
├── routes/
│   └── api.php
├── .env.example
└── README.md`
      },
      {
        name: 'Laravel API Controller',
        path: 'app/Http/Controllers/Api/ResourceController.php',
        category: 'Controllers',
        content: `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Resource;
use Illuminate\\Http\\Request;

class ResourceController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Resource::paginate(15)
        ]);
    }
}`
      },
      {
        name: 'API Routes File',
        path: 'routes/api.php',
        category: 'Routes',
        content: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\ResourceController;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('resources', ResourceController::class);
});`
      },
      {
        name: 'Eloquent Model',
        path: 'app/Models/Resource.php',
        category: 'Models',
        content: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;

class Resource extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'status'];
}`
      },
      {
        name: 'Sanctum Auth Middleware',
        path: 'app/Http/Middleware/Authenticate.php',
        category: 'Authentication',
        content: `// Laravel Sanctum Guard initialized in config/auth.php`
      },
      {
        name: 'Form Request Validation',
        path: 'app/Http/Requests/StoreResourceRequest.php',
        category: 'Validation',
        content: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class StoreResourceRequest extends FormRequest
{
    public function rules()
    {
        return [
            'title' => 'required|string|min:3|max:100'
        ];
    }
}`
      },
      {
        name: 'Laravel .env',
        path: '.env.example',
        category: 'Environment Variables',
        content: `APP_NAME="${project.name}"
APP_ENV=local
APP_KEY=
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=apives`
      },
      {
        name: 'Eloquent Migration',
        path: 'database/migrations/2026_01_01_000000_create_resources_table.php',
        category: 'Database Connection',
        content: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('resources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('status')->default('ACTIVE');
            $table->timestamps();
        });
    }
};`
      },
      {
        name: 'PHP Dockerfile',
        path: 'Dockerfile',
        category: 'Docker Configuration',
        content: `FROM php:8.3-fpm-alpine
WORKDIR /var/www
RUN docker-php-ext-install pdo pdo_pgsql
COPY . .
CMD ["php", "artisan", "serve", "--host=0.0.0.0"]`
      },
      {
        name: 'Scramble OpenAPI',
        path: 'config/scramble.php',
        category: 'Swagger/OpenAPI Integration',
        content: `return ['api_path' => 'api', 'ui' => ['enabled' => true]];`
      },
      {
        name: 'Health Endpoint',
        path: 'routes/web.php',
        category: 'Health Check Endpoint',
        content: `Route::get('/health', fn() => response()->json(['status' => 'UP']));`
      },
      {
        name: 'Throttle Middleware',
        path: 'app/Providers/RouteServiceProvider.php',
        category: 'Rate Limiting',
        content: `RateLimiter::for('api', fn ($request) => Limit::perMinute(60));`
      },
      {
        name: 'Laravel Logger',
        path: 'config/logging.php',
        category: 'Logging',
        content: `// Log channel config`
      },
      {
        name: 'Handler Exception',
        path: 'bootstrap/app.php',
        category: 'Error Handling',
        content: `// Exception handling configuration`
      },
      {
        name: 'PHPUnit/Pest Test Scaffold',
        path: 'tests/Feature/ApiResourceTest.php',
        category: 'Unit Tests & Scaffolding',
        content: `<?php

namespace Tests\Feature;

import Tests\TestCase;

class ApiResourceTest extends TestCase
{
    public function test_health_check_returns_ok(): void
    {
        $response = $this->get('/health');
        $response->assertStatus(200)
                 ->assertJson(['status' => 'UP']);
    }

    public function test_resources_endpoint(): void
    {
        $response = $this->getJson('/api/v1/resources');
        $response->assertStatus(200);
    }
}`
      },
      {
        name: 'Laravel README',
        path: 'README.md',
        category: 'README Preview',
        content: `# ${project.name} (Laravel 11)`
      }
    ]
  };
}
