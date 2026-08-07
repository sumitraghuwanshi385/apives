import { ArchitectProject } from '../architectEngine';
import { FrameworkCodePreview } from './types';

export function generateExpressBackend(project: ArchitectProject): FrameworkCodePreview {
  const nameSlug = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const dbType = project.config.database;
  const authType = project.config.auth;

  return {
    framework: 'Express.js',
    description: 'Node.js Express backend with TypeScript, Prisma ORM, JWT auth, Winston logging, and Swagger OpenAPI.',
    setupCommands: [
      `git clone https://github.com/apives/${nameSlug}-express.git`,
      `cd ${nameSlug}-express`,
      `npm install`,
      `cp .env.example .env`,
      `npx prisma db push`,
      `npm run dev`
    ],
    files: [
      {
        name: 'Project Directory Tree',
        path: 'structure.txt',
        category: 'Folder Structure',
        content: `${nameSlug}-express/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── swagger.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── ${nameSlug}.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rateLimiter.middleware.ts
│   ├── models/
│   │   └── prisma.schema
│   ├── routes/
│   │   ├── index.ts
│   │   └── api.routes.ts
│   ├── utils/
│   │   └── logger.ts
│   ├── app.ts
│   └── server.ts
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json
└── README.md`
      },
      {
        name: 'API Controller',
        path: 'src/controllers/api.controller.ts',
        category: 'Controllers',
        content: `import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class ApiController {
  public static async getResources(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Fetching API resources for tenant', { tenantId: (req as any).user?.id });
      return res.status(200).json({
        success: true,
        data: [
          { id: 'res_01', name: 'Production Cluster', status: 'ACTIVE' },
          { id: 'res_02', name: 'Database Primary', status: 'HEALTHY' }
        ]
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createResource(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      logger.info('Creating new resource', { payload });
      return res.status(201).json({
        success: true,
        message: 'Resource created successfully',
        id: \`res_\${Date.now()}\`
      });
    } catch (error) {
      next(error);
    }
  }
}`
      },
      {
        name: 'API Routes',
        path: 'src/routes/api.routes.ts',
        category: 'Routes',
        content: `import { Router } from 'express';
import { ApiController } from '../controllers/api.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { rateLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

router.use(rateLimiter);

router.get('/resources', authenticateToken, ApiController.getResources);
router.post('/resources', authenticateToken, ApiController.createResource);

export default router;`
      },
      {
        name: 'Database Models (Prisma Schema)',
        path: 'prisma/schema.prisma',
        category: 'Models',
        content: `datasource db {
  provider = "${dbType === 'MongoDB' ? 'mongodb' : dbType === 'MySQL' ? 'mysql' : 'postgresql'}"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      String   @default("USER")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Resource {
  id        String   @id @default(uuid())
  title     String
  status    String   @default("PENDING")
  userId    String
  createdAt DateTime @default(now())
}`
      },
      {
        name: 'JWT Auth Middleware',
        path: 'src/middlewares/auth.middleware.ts',
        category: 'Authentication',
        content: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Access Token Missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'apives_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Forbidden: Invalid or Expired Token' });
    }
    (req as any).user = user;
    next();
  });
}`
      },
      {
        name: 'Rate Limiter Middleware',
        path: 'src/middlewares/rateLimiter.middleware.ts',
        category: 'Rate Limiting',
        content: `import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes'
  }
});`
      },
      {
        name: 'Validation Schema (Zod)',
        path: 'src/middlewares/validation.middleware.ts',
        category: 'Validation',
        content: `import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const CreateResourceSchema = z.object({
  title: z.string().min(3).max(100),
  category: z.string().optional(),
  amount: z.number().positive()
});

export const validateRequest = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
    });
  }
  next();
};`
      },
      {
        name: 'Environment Variables Template',
        path: '.env.example',
        category: 'Environment Variables',
        content: `PORT=3000
NODE_ENV=production
DATABASE_URL="${dbType === 'PostgreSQL' ? 'postgresql://postgres:secret@localhost:5432/apives_db' : 'mongodb://localhost:27017/apives_db'}"
JWT_SECRET=super_secret_jwt_key_apives_production_998
CORS_ORIGIN=*
LOG_LEVEL=info`
      },
      {
        name: 'Database Connection Manager',
        path: 'src/config/database.ts',
        category: 'Database Connection',
        content: `import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

export const prisma = new PrismaClient();

export async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('Database connection established successfully [${dbType}]');
  } catch (error) {
    logger.error('Failed to connect to database', error);
    process.exit(1);
  }
}`
      },
      {
        name: 'Dockerfile',
        path: 'Dockerfile',
        category: 'Docker Configuration',
        content: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/server.js"]`
      },
      {
        name: 'Swagger / OpenAPI Integration',
        path: 'src/config/swagger.ts',
        category: 'Swagger/OpenAPI Integration',
        content: `import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const openApiSpec = ${project.openApiJson};

export function setupSwagger(app: Express) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
}`
      },
      {
        name: 'Health Check Endpoint',
        path: 'src/routes/health.routes.ts',
        category: 'Health Check Endpoint',
        content: `import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    database: 'HEALTHY'
  });
});

export default router;`
      },
      {
        name: 'Winston Logger',
        path: 'src/utils/logger.ts',
        category: 'Logging',
        content: `import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});`
      },
      {
        name: 'Global Error Handling Middleware',
        path: 'src/middlewares/error.middleware.ts',
        category: 'Error Handling',
        content: `import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(err.message || 'Unhandled Internal Error', { stack: err.stack });
  
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR'
  });
}`
      },
      {
        name: 'Unit & Integration Tests (Jest/Vitest)',
        path: 'tests/unit/api.test.ts',
        category: 'Unit Tests & Scaffolding',
        content: `import { describe, it, expect, beforeEach } from 'vitest'; // or jest
import request from 'supertest';
import express from 'express';
import apiRoutes from '../../src/routes/api.routes';

const app = express();
app.use(express.json());
app.use('/api/v1', apiRoutes);

describe('Express API Controller Scaffold Suite', () => {
  beforeEach(() => {
    // Reset test state before each test run
  });

  it('GET /api/v1/resources - should return 200 OK with resource list', async () => {
    const res = await request(app)
      .get('/api/v1/resources')
      .set('Authorization', 'Bearer mock_jwt_test_token');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/v1/resources - should create resource and return 201 Created', async () => {
    const payload = { title: 'Test Cluster Node', amount: 5 };
    const res = await request(app)
      .post('/api/v1/resources')
      .set('Authorization', 'Bearer mock_jwt_test_token')
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('id');
  });
});`
      },
      {
        name: 'Test Setup Configuration',
        path: 'tests/setup.ts',
        category: 'Unit Tests & Scaffolding',
        content: `// Global test environment bootstrap for Vitest / Jest
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key_123';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/apives_test_db';

console.log('🧪 Automated API Unit Test Runner initialized.');`
      },
      {
        name: 'README Preview',
        path: 'README.md',
        category: 'README Preview',
        content: `# ${project.name} (Express.js Production Backend)

Production API backend generated by **Apives Architect**.

## Features
- Express.js + TypeScript + Prisma ORM
- Auth: ${authType}
- Database: ${dbType}
- Docker & Docker Compose setup
- Swagger Docs available at \`/docs\`
- Rate limiting & Winston structured logging

## Quick Start
\`\`\`bash
npm install
cp .env.example .env
npm run dev
\`\`\``
      }
    ]
  };
}
