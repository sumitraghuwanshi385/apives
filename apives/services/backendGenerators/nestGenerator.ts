import { ArchitectProject } from '../architectEngine';
import { FrameworkCodePreview } from './types';

export function generateNestBackend(project: ArchitectProject): FrameworkCodePreview {
  const nameSlug = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const dbType = project.config.database;

  return {
    framework: 'NestJS',
    description: 'Enterprise modular NestJS framework with TypeScript, TypeORM/Prisma, Guards, DTO validation, and Swagger OpenAPI.',
    setupCommands: [
      `git clone https://github.com/apives/${nameSlug}-nestjs.git`,
      `cd ${nameSlug}-nestjs`,
      `npm install`,
      `cp .env.example .env`,
      `npm run start:dev`
    ],
    files: [
      {
        name: 'Folder Structure',
        path: 'structure.txt',
        category: 'Folder Structure',
        content: `${nameSlug}-nestjs/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── jwt.strategy.ts
│   ├── api/
│   │   ├── api.controller.ts
│   │   ├── api.module.ts
│   │   └── api.service.ts
│   ├── common/
│   │   ├── filters/http-exception.filter.ts
│   │   └── guards/roles.guard.ts
│   ├── database/
│   │   └── database.module.ts
│   ├── main.ts
│   └── app.module.ts
├── Dockerfile
├── .env.example
└── README.md`
      },
      {
        name: 'NestJS Controller',
        path: 'src/api/api.controller.ts',
        category: 'Controllers',
        content: `import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiService } from './api.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Resources')
@Controller('api/v1/resources')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch tenant resources' })
  async getResources() {
    return this.apiService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createResource(@Body() dto: CreateResourceDto) {
    return this.apiService.create(dto);
  }
}`
      },
      {
        name: 'NestJS Module Routes',
        path: 'src/api/api.module.ts',
        category: 'Routes',
        content: `import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  controllers: [ApiController],
  providers: [ApiService],
  exports: [ApiService]
})
export class ApiModule {}`
      },
      {
        name: 'NestJS Entity Model',
        path: 'src/api/entities/resource.entity.ts',
        category: 'Models',
        content: `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('resources')
export class ResourceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: 'ACTIVE' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}`
      },
      {
        name: 'Auth Guard & Strategy',
        path: 'src/auth/jwt-auth.guard.ts',
        category: 'Authentication',
        content: `import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}`
      },
      {
        name: 'DTO Validation',
        path: 'src/api/dto/create-resource.dto.ts',
        category: 'Validation',
        content: `import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResourceDto {
  @ApiProperty({ example: 'Primary Node' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: 'DATABASE', required: false })
  @IsString()
  @IsOptional()
  category?: string;
}`
      },
      {
        name: 'Environment Config',
        path: '.env.example',
        category: 'Environment Variables',
        content: `PORT=3000
DATABASE_URL="${dbType === 'PostgreSQL' ? 'postgres://postgres:pass@localhost:5432/apives' : 'mysql://root:pass@localhost:3306/apives'}"
JWT_SECRET=nest_jwt_secret_9987`
      },
      {
        name: 'TypeORM / Prisma Database Module',
        path: 'src/database/database.module.ts',
        category: 'Database Connection',
        content: `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: '${dbType === 'MySQL' ? 'mysql' : 'postgres'}',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true
    })
  ]
})
export class DatabaseModule {}`
      },
      {
        name: 'NestJS Dockerfile',
        path: 'Dockerfile',
        category: 'Docker Configuration',
        content: `FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
CMD ["node", "dist/main"]`
      },
      {
        name: 'Swagger Setup in Main',
        path: 'src/main.ts',
        category: 'Swagger/OpenAPI Integration',
        content: `import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('${project.name}')
    .setDescription('${project.description}')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();`
      },
      {
        name: 'Health Check Controller',
        path: 'src/health/health.controller.ts',
        category: 'Health Check Endpoint',
        content: `import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date() };
  }
}`
      },
      {
        name: 'Throttler / Rate Limit Module',
        path: 'src/app.module.ts',
        category: 'Rate Limiting',
        content: `import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
  ],
})
export class AppModule {}`
      },
      {
        name: 'Logger Service',
        path: 'src/common/logger.service.ts',
        category: 'Logging',
        content: `import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class AppLogger extends Logger {}`
      },
      {
        name: 'Exception Filter',
        path: 'src/common/filters/http-exception.filter.ts',
        category: 'Error Handling',
        content: `import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message
    });
  }
}`
      },
      {
        name: 'Unit Tests Scaffold (Jest)',
        path: 'tests/unit/api.controller.spec.ts',
        category: 'Unit Tests & Scaffolding',
        content: `import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from '../../src/api/api.controller';
import { ApiService } from '../../src/api/api.service';

describe('ApiController Unit Test Suite', () => {
  let controller: ApiController;
  let service: ApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        {
          provide: ApiService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([{ id: '1', title: 'Test Cluster' }]),
            create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: '2', ...dto }))
          }
        }
      ],
    }).compile();

    controller = module.get<ApiController>(ApiController);
    service = module.get<ApiService>(ApiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getResources should return mock array', async () => {
    const res = await controller.getResources();
    expect(res).toEqual([{ id: '1', title: 'Test Cluster' }]);
  });
});`
      },
      {
        name: 'E2E Testing Scaffold',
        path: 'tests/e2e/app.e2e-spec.ts',
        category: 'Unit Tests & Scaffolding',
        content: `import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200);
  });
});`
      },
      {
        name: 'NestJS README',
        path: 'README.md',
        category: 'README Preview',
        content: `# ${project.name} (NestJS Enterprise Backend)

Built with NestJS, TypeScript, and TypeORM.`
      }
    ]
  };
}
