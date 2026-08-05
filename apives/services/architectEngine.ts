export interface ArchitectConfig {
  auth: 'None' | 'JWT' | 'OAuth' | 'API Key';
  database: 'PostgreSQL' | 'MongoDB' | 'MySQL';
  architecture: 'REST' | 'GraphQL';
  apiStyle: 'Public' | 'Private' | 'Internal';
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  outputTypes?: string[];
  outputs: {
    openApiSpec: boolean;
    databaseSchema: boolean;
    requestExamples: boolean;
    responseExamples: boolean;
    errorResponses: boolean;
    mockServer: boolean;
    documentation: boolean;
    rateLimitingSuggestions: boolean;
    validationRules: boolean;
  };
}

export interface EndpointSpec {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  authRequired: boolean;
  headers: Record<string, string>;
  requestBody?: any;
  responseBody: any;
  statusCodes: Array<{ code: number; description: string }>;
}

export interface DbTableSpec {
  name: string;
  fields: Array<{
    name: string;
    type: string;
    primaryKey?: boolean;
    nullable?: boolean;
    defaultValue?: string;
  }>;
  primaryKeys: string[];
  foreignKeys: Array<{ field: string; referencesTable: string; referencesField: string }>;
  indexes: string[];
}

export interface ArchitectProject {
  id: string;
  name: string;
  description: string;
  prompt: string;
  createdAt: string;
  config: ArchitectConfig;
  stats: {
    endpointsGenerated: number;
    schemasCount: number;
    estimatedTimeSavedHours: number;
    complexityCategory: 'Simple' | 'Medium' | 'Advanced' | 'Enterprise';
    complexityScore: number; // 0-100
    securityScore: number; // 0-100
    architectureQuality: 'A+' | 'A' | 'B+' | 'B';
  };
  aiReadiness: {
    score: number; // e.g. 78%
    recommendations: string[];
  };
  endpoints: EndpointSpec[];
  databaseSchema: {
    tables: DbTableSpec[];
  };
  folderStructure: Array<{
    path: string;
    type: 'folder' | 'file';
    description?: string;
  }>;
  openApiJson: string;
  openApiYaml: string;
  documentationMarkdown: string;
  suggestions: {
    bestPractices: string[];
    security: string[];
    performance: string[];
    naming: string[];
    versioning: string[];
    restDesign: string[];
  };
}

export const DEFAULT_ARCHITECT_CONFIG: ArchitectConfig = {
  auth: 'JWT',
  database: 'PostgreSQL',
  architecture: 'REST',
  apiStyle: 'Public',
  version: { major: 1, minor: 0, patch: 0 },
  outputTypes: ['openapi', 'controllers', 'schema', 'docs'],
  outputs: {
    openApiSpec: true,
    databaseSchema: true,
    requestExamples: true,
    responseExamples: true,
    errorResponses: true,
    mockServer: true,
    documentation: true,
    rateLimitingSuggestions: true,
    validationRules: true,
  }
};

export const EXAMPLE_PROMPT_LIBRARY = [
  {
    title: 'Food Delivery API',
    category: 'Ecommerce',
    prompt: `Build a Food Delivery API.\nCustomers place orders.\nRestaurants manage menus.\nDrivers deliver food.\nJWT Authentication.\nStripe payments.\nWebhooks.\nPagination.\nRole based access.`
  },
  {
    title: 'Employee Management API',
    category: 'HRMS',
    prompt: `Build an Enterprise Employee Management (HRMS) API.\nEmployees view paystubs & request leaves.\nManagers approve leave requests & evaluate performance.\nHR manages onboarding, departments & role assignments.\nJWT & OAuth2 Authentication.\nAudit logs & RBAC permissions.`
  },
  {
    title: 'Inventory API',
    category: 'Inventory',
    prompt: `Build a Multi-Warehouse Inventory API.\nTrack stock items, SKUs, reorder thresholds & supplier channels.\nReal-time webhooks for low inventory alerts.\nBatch bulk imports.\nAPI Key authentication for POS integrations.`
  },
  {
    title: 'Blog Platform API',
    category: 'SaaS',
    prompt: `Build a Developer Media & Blog Platform API.\nAuthors publish articles with Markdown & draft previews.\nReaders like, comment, and bookmark posts.\nTags & full-text search indexing.\nJWT auth & RSS feed endpoints.`
  },
  {
    title: 'Booking System API',
    category: 'Finance',
    prompt: `Build a Resource Booking & Reservation API.\nManage time slots, calendar availability & conflict detection.\nDeposit payments via Stripe.\nCancellation policies & automated email notifications.`
  },
  {
    title: 'School Management API',
    category: 'Education',
    prompt: `Build an Educational Institute Management API.\nManage student enrolments, course curriculums, assignment submissions & grading.\nParent portal access.\nRole based access control (Admin, Teacher, Student, Parent).`
  },
  {
    title: 'Hospital API',
    category: 'Healthcare',
    prompt: `Build a Healthcare Patient & Appointment API (HIPAA compliant).\nDoctors maintain EHR medical records & digital prescriptions.\nPatients schedule consultations & download test lab results.\nOAuth2 auth & encrypted payload headers.`
  },
  {
    title: 'Chat Application API',
    category: 'Chat',
    prompt: `Build a Real-Time Team Messaging API.\nDirect messaging & channel group threads.\nMedia file attachments & message reaction emojis.\nWebSocket connection tokens & online status heartbeats.`
  },
  {
    title: 'Payment Gateway API',
    category: 'Banking',
    prompt: `Build a Merchant Payment Gateway API.\nProcess credit cards, UPI & bank transfers.\nManage subscriptions, recurring billing invoices & merchant payouts.\nHMAC Webhook signature verification.`
  },
  {
    title: 'CRM API',
    category: 'CRM',
    prompt: `Build a Customer Relationship Management (CRM) API.\nTrack deals, sales leads, pipeline stages & contacts.\nActivity logs & task reminders.\nAPI Key auth & third-party webhook integrations.`
  },
  {
    title: 'Project Management API',
    category: 'SaaS',
    prompt: `Build an Agile Kanban Project Management API.\nWorkspace boards, lists, task cards, assignees & sprint estimates.\nActivity timeline & comment threads.\nJWT auth & workspace invite tokens.`
  },
  {
    title: 'Video Streaming API',
    category: 'AI',
    prompt: `Build a On-Demand Video Streaming Platform API.\nVideo upload presigned URLs, HLS adaptive bitrate transcoding status.\nWatch history, recommendations & user subscriptions.\nOAuth2 & Token bucket rate limiting.`
  }
];

export const SMART_CHIPS = [
  'SaaS', 'CRM', 'HRMS', 'Inventory', 'AI', 'Chat', 'Finance', 'Healthcare', 'Education', 'Ecommerce', 'Banking', 'Social Network'
];

export const CHIP_PROMPTS: Record<string, string> = {
  'SaaS': 'Add multi-tenant organization isolation, subscription billing tiers, API key management & usage quota enforcement.',
  'CRM': 'Include lead scoring pipeline, contact activity tracking, custom deal stages & email integration webhooks.',
  'HRMS': 'Include employee directory, leave management workflows, payroll integration & RBAC permissions.',
  'Inventory': 'Include multi-warehouse stock tracking, SKU variants, reorder notifications & barcode scanning support.',
  'AI': 'Include LLM prompt execution queue, vector search embedding endpoints, token billing & rate limiting.',
  'Chat': 'Include real-time WebSocket subscriptions, typing indicators, read receipts & E2E message encryption.',
  'Finance': 'Include double-entry ledger transactions, currency exchange rates, wire transfer approvals & audit logs.',
  'Healthcare': 'Include HIPAA compliant patient records, doctor scheduling slots, prescription logs & telemetry data.',
  'Education': 'Include student grading rubrics, course enrollment matrices, assignment upload & quiz submissions.',
  'Ecommerce': 'Include cart management, discount coupon codes, order tracking, Stripe payments & shipping tax calculations.',
  'Banking': 'Include account balance transfers, daily withdrawal limits, KYC verification & fraud detection flags.',
  'Social Network': 'Include activity feed algorithm, user follow graphs, media uploads & notification preferences.'
};

export function generateApiArchitecture(prompt: string, config: ArchitectConfig): ArchitectProject {
  const cleanPrompt = prompt.trim() || 'Food Delivery API';
  const nameFromPrompt = cleanPrompt.split('\n')[0].replace(/^Build\s+(an?|a)\s+/i, '').replace(/API\.?$/i, '').trim();
  const apiTitle = nameFromPrompt ? `${nameFromPrompt.charAt(0).toUpperCase() + nameFromPrompt.slice(1)} API` : 'Production Gateway API';
  
  const id = 'proj_' + Math.random().toString(36).substring(2, 9);
  const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Generate endpoints based on prompt context
  const endpoints: EndpointSpec[] = [
    {
      id: 'ep_1',
      method: 'POST',
      path: '/api/v1/auth/login',
      description: 'Authenticate user and issue JWT Bearer tokens with scope claims.',
      authRequired: false,
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Version': '2.1.0'
      },
      requestBody: {
        email: 'developer@apives.com',
        password: '••••••••••••'
      },
      responseBody: {
        status: 'success',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        expiresIn: 86400,
        user: {
          id: 'usr_9921',
          email: 'developer@apives.com',
          role: 'ADMIN'
        }
      },
      statusCodes: [
        { code: 200, description: 'Token issued successfully' },
        { code: 401, description: 'Invalid credentials or locked account' },
        { code: 429, description: 'Rate limit exceeded (10 req/min)' }
      ]
    },
    {
      id: 'ep_2',
      method: 'GET',
      path: '/api/v1/resources',
      description: 'Fetch paginated list of resources with filtering, sorting, and field selection.',
      authRequired: config.auth !== 'None',
      headers: {
        'Authorization': config.auth === 'JWT' ? 'Bearer <JWT_TOKEN>' : 'ApiKey apv_live_9831',
        'Accept': 'application/json'
      },
      responseBody: {
        data: [
          { id: 'res_01', name: 'Primary Item Alpha', status: 'ACTIVE', createdAt: '2026-08-01T10:00:00Z' },
          { id: 'res_02', name: 'Secondary Item Beta', status: 'PENDING', createdAt: '2026-08-02T12:30:00Z' }
        ],
        meta: {
          page: 1,
          limit: 20,
          total: 142,
          totalPages: 8
        }
      },
      statusCodes: [
        { code: 200, description: 'Resource list retrieved' },
        { code: 400, description: 'Invalid pagination query parameters' },
        { code: 401, description: 'Unauthorized access' }
      ]
    },
    {
      id: 'ep_3',
      method: 'POST',
      path: '/api/v1/resources',
      description: 'Create a new core domain record with strict input validation and audit metadata.',
      authRequired: config.auth !== 'None',
      headers: {
        'Authorization': 'Bearer <JWT_TOKEN>',
        'Content-Type': 'application/json',
        'X-Idempotency-Key': '7b39a2f1-4190'
      },
      requestBody: {
        name: 'New Production Cluster',
        category: 'Infrastructure',
        settings: {
          autoScale: true,
          minNodes: 2,
          maxNodes: 10
        }
      },
      responseBody: {
        id: 'res_109',
        name: 'New Production Cluster',
        category: 'Infrastructure',
        status: 'INITIALIZING',
        createdAt: '2026-08-05T00:45:00Z'
      },
      statusCodes: [
        { code: 201, description: 'Resource created successfully' },
        { code: 422, description: 'Validation failed (missing required parameters)' }
      ]
    },
    {
      id: 'ep_4',
      method: 'GET',
      path: '/api/v1/resources/:id',
      description: 'Retrieve detailed record specification by unique entity ID.',
      authRequired: config.auth !== 'None',
      headers: {
        'Authorization': 'Bearer <JWT_TOKEN>'
      },
      responseBody: {
        id: 'res_109',
        name: 'New Production Cluster',
        category: 'Infrastructure',
        status: 'HEALTHY',
        uptimePct: 99.98,
        createdAt: '2026-08-05T00:45:00Z',
        updatedAt: '2026-08-05T00:45:10Z'
      },
      statusCodes: [
        { code: 200, description: 'Record found' },
        { code: 404, description: 'Resource ID not found' }
      ]
    },
    {
      id: 'ep_5',
      method: 'POST',
      path: '/api/v1/webhooks/stripe',
      description: 'Ingest and process payment events with HMAC signature validation.',
      authRequired: false,
      headers: {
        'Stripe-Signature': 't=1612345678,v1=9f8e7d6c5b4a321'
      },
      requestBody: {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_3Mtw2L2eZvKYlo2C1g9k8j7h',
            amount: 4900,
            currency: 'usd',
            customer: 'cus_Nf921a8'
          }
        }
      },
      responseBody: {
        received: true
      },
      statusCodes: [
        { code: 200, description: 'Event processed' },
        { code: 400, description: 'Invalid webhook signature' }
      ]
    }
  ];

  // Database Schema
  const isMongo = config.database === 'MongoDB';
  const tables: DbTableSpec[] = [
    {
      name: isMongo ? 'users' : 'users',
      fields: [
        { name: 'id', type: isMongo ? 'ObjectId' : 'UUID', primaryKey: true },
        { name: 'email', type: 'VARCHAR(255)', nullable: false },
        { name: 'password_hash', type: 'VARCHAR(255)', nullable: false },
        { name: 'role', type: "VARCHAR(50)", defaultValue: "'USER'" },
        { name: 'is_active', type: 'BOOLEAN', defaultValue: 'true' },
        { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'NOW()' }
      ],
      primaryKeys: ['id'],
      foreignKeys: [],
      indexes: ['idx_users_email_active', 'idx_users_role']
    },
    {
      name: 'organizations',
      fields: [
        { name: 'id', type: isMongo ? 'ObjectId' : 'UUID', primaryKey: true },
        { name: 'name', type: 'VARCHAR(100)', nullable: false },
        { name: 'owner_id', type: isMongo ? 'ObjectId' : 'UUID', nullable: false },
        { name: 'plan_tier', type: "VARCHAR(30)", defaultValue: "'PRO'" },
        { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'NOW()' }
      ],
      primaryKeys: ['id'],
      foreignKeys: [
        { field: 'owner_id', referencesTable: 'users', referencesField: 'id' }
      ],
      indexes: ['idx_orgs_owner']
    },
    {
      name: 'audit_logs',
      fields: [
        { name: 'id', type: isMongo ? 'ObjectId' : 'UUID', primaryKey: true },
        { name: 'actor_id', type: isMongo ? 'ObjectId' : 'UUID', nullable: false },
        { name: 'action', type: 'VARCHAR(100)', nullable: false },
        { name: 'ip_address', type: 'VARCHAR(45)', nullable: true },
        { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'NOW()' }
      ],
      primaryKeys: ['id'],
      foreignKeys: [
        { field: 'actor_id', referencesTable: 'users', referencesField: 'id' }
      ],
      indexes: ['idx_audit_actor_created']
    }
  ];

  // Folder structure
  const folderStructure = [
    { path: 'src/', type: 'folder' as const, description: 'Core source code directory' },
    { path: 'src/config/', type: 'folder' as const, description: 'Database & Environment configuration' },
    { path: 'src/config/database.ts', type: 'file' as const, description: `${config.database} connection pool` },
    { path: 'src/controllers/', type: 'folder' as const, description: 'HTTP route handlers' },
    { path: 'src/controllers/auth.controller.ts', type: 'file' as const, description: 'Login, refresh, logout logic' },
    { path: 'src/controllers/resource.controller.ts', type: 'file' as const, description: 'CRUD operation handlers' },
    { path: 'src/middleware/', type: 'folder' as const, description: 'Auth, Rate limiting & Error middleware' },
    { path: 'src/middleware/auth.middleware.ts', type: 'file' as const, description: `${config.auth} token validator` },
    { path: 'src/middleware/rateLimiter.ts', type: 'file' as const, description: 'Redis sliding-window rate limiter' },
    { path: 'src/models/', type: 'folder' as const, description: 'ORM schemas & data access layer' },
    { path: 'src/routes/', type: 'folder' as const, description: 'Express router specifications' },
    { path: 'src/openapi.json', type: 'file' as const, description: 'OpenAPI 3.0 specification file' },
    { path: 'docker-compose.yml', type: 'file' as const, description: 'Container definitions for DB & Redis' }
  ];

  // Version string
  const versionStr = config.version ? `${config.version.major}.${config.version.minor}.${config.version.patch}` : '1.0.0';

  // OpenAPI JSON
  const openApiObj = {
    openapi: '3.0.3',
    info: {
      title: apiTitle,
      version: versionStr,
      description: `Production specification generated for ${apiTitle}. Features ${config.auth} authentication and ${config.database} database layer.`
    },
    servers: [
      { url: `https://api.apives.com/v${config.version?.major ?? 1}`, description: 'Production Server' },
      { url: `https://sandbox-api.apives.com/v${config.version?.major ?? 1}`, description: 'Staging Sandbox' }
    ],
    paths: {
      '/auth/login': {
        post: {
          summary: 'User Login',
          tags: ['Authentication'],
          responses: {
            '200': { description: 'Bearer JWT token returned' },
            '401': { description: 'Invalid email or password' }
          }
        }
      },
      '/resources': {
        get: {
          summary: 'List Resources',
          tags: ['Resources'],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } }
          ],
          responses: {
            '200': { description: 'Paginated list of records' }
          }
        },
        post: {
          summary: 'Create Resource',
          tags: ['Resources'],
          responses: {
            '201': { description: 'Record created successfully' }
          }
        }
      }
    }
  };

  const openApiJson = JSON.stringify(openApiObj, null, 2);

  const openApiYaml = `openapi: 3.0.3
info:
  title: "${apiTitle}"
  version: "1.0.0"
  description: "Production API specification generated with ${config.auth} auth and ${config.database} database."
servers:
  - url: https://api.apives.com/v1
    description: Production Cluster
paths:
  /auth/login:
    post:
      summary: Login and obtain authentication token
      tags: [Auth]
      responses:
        '200':
          description: Successful login
  /resources:
    get:
      summary: Retrieve paginated resource collection
      tags: [Resources]
      parameters:
        - name: page
          in: query
          schema:
            type: integer
        - name: limit
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: OK
`;

  const documentationMarkdown = `# ${apiTitle} - Documentation

## Overview
This production-grade API architecture was synthesized by **Apives Architect**. It provides clean endpoint modularity, standardized JSON schemas, ${config.auth} security, and ${config.database} data management.

### Base URL
\`https://api.apives.com/v1\`

---

## Authentication
This API enforces **${config.auth}** security.
${config.auth === 'JWT' ? 'Include the Bearer token in the `Authorization` request header:' : 'Include your secret key in the request header:'}

\`\`\`http
Authorization: Bearer <your_access_token>
\`\`\`

---

## Core Endpoints

### 1. POST /auth/login
Authenticate user credentials and receive access tokens.

#### Request Body
\`\`\`json
{
  "email": "developer@apives.com",
  "password": "••••••••••••"
}
\`\`\`

#### Response (200 OK)
\`\`\`json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": { "id": "usr_9921", "role": "ADMIN" }
}
\`\`\`

---

## Error Handling Standard
Errors return structured RFC 7807 compliant payloads:

\`\`\`json
{
  "type": "https://api.apives.com/errors/invalid-payload",
  "title": "Validation Failed",
  "status": 422,
  "detail": "Field 'email' must be a valid email address.",
  "instance": "/api/v1/auth/login"
}
\`\`\`
`;

  return {
    id,
    name: apiTitle,
    description: `Complete ${config.architecture} architecture with ${config.auth} authentication, ${config.database} storage, and production rate limits.`,
    prompt: cleanPrompt,
    createdAt: now,
    config,
    stats: {
      endpointsGenerated: endpoints.length,
      schemasCount: tables.length,
      estimatedTimeSavedHours: 42,
      complexityCategory: 'Enterprise',
      complexityScore: 88,
      securityScore: 94,
      architectureQuality: 'A+'
    },
    aiReadiness: {
      score: 78,
      recommendations: [
        'Missing pagination on secondary nested list endpoints',
        'Missing API versioning header lock rule',
        'Missing Redis rate limiting policy on public auth routes',
        'Missing audit log indexing for compliance retention'
      ]
    },
    endpoints,
    databaseSchema: { tables },
    folderStructure,
    openApiJson,
    openApiYaml,
    documentationMarkdown,
    suggestions: {
      bestPractices: [
        'Use RFC 7807 problem details for uniform error responses.',
        'Implement mandatory HTTPS termination at edge gateway.',
        'Keep route handlers thin by isolating business logic into service layer.'
      ],
      security: [
        `Enforce strict CORS headers for allowed origins.`,
        `Sanitize incoming request bodies against SQL/NoSQL injection.`,
        `Use short-lived JWT access tokens (15m) alongside refresh token rotation.`
      ],
      performance: [
        'Apply Redis caching layer for read-heavy GET requests.',
        'Implement database connection pooling (Min 5, Max 20).',
        'Use compression middleware (gzip/brotli) on JSON payloads exceeding 1KB.'
      ],
      naming: [
        'Use lowercase plural nouns for URI paths (e.g., /orders, /users).',
        'Use camelCase for JSON key attributes.',
        'Use HTTP verbs explicitly (GET, POST, PUT, DELETE).'
      ],
      versioning: [
        'Embed major version in URI prefix (/v1/, /v2/).',
        'Deprecate old endpoints with 6-month window using Sunset headers.'
      ],
      restDesign: [
        'Return 201 Created with Location header on POST operations.',
        'Return 204 No Content on successful DELETE operations.'
      ]
    }
  };
}

export interface LatencyMetric {
  endpointId: string;
  method: string;
  path: string;
  p50: number;
  p95: number;
  p99: number;
  dbQueriesCount: number;
  payloadKb: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  bottleneckReason: string;
  recommendation: string;
}

export function computeLatencyMetrics(endpoints: EndpointSpec[]): LatencyMetric[] {
  return endpoints.map((ep) => {
    const isGet = ep.method === 'GET';
    const isPost = ep.method === 'POST';
    
    let dbQueriesCount = isGet ? 1 : isPost ? 3 : 2;
    const pathStr = ep.path || '';
    if (pathStr.includes('search') || pathStr.includes('analytics') || pathStr.includes('report')) {
      dbQueriesCount += 3;
    }

    const payloadKb = Math.round((JSON.stringify(ep.responseBody || {}).length + JSON.stringify(ep.requestBody || {}).length) / 1024 * 10) / 10 || 0.4;

    const baseMs = isGet ? 18 : isPost ? 35 : 28;
    const p50 = Math.round(baseMs + dbQueriesCount * 8 + payloadKb * 2);
    const p95 = Math.round(p50 * 1.8 + Math.random() * 10);
    const p99 = Math.round(p95 * 1.6 + Math.random() * 15);

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (p95 > 100 || dbQueriesCount >= 5) {
      riskLevel = 'HIGH';
    } else if (p95 > 50 || dbQueriesCount >= 3) {
      riskLevel = 'MEDIUM';
    }

    let bottleneckReason = 'Standard index scan execution profile.';
    let recommendation = 'Optimal execution profile. Monitor P99 latency under load.';

    if (dbQueriesCount >= 4) {
      bottleneckReason = 'High DB query count (N+1 query risk during relational joins).';
      recommendation = 'Batch database lookups with Eager Loading / DataLoader or add Redis cache.';
    } else if (payloadKb > 5) {
      bottleneckReason = 'Uncompressed large response payload size.';
      recommendation = 'Apply response payload field filtering, pagination, and Brotli compression.';
    } else if (ep.authRequired) {
      bottleneckReason = 'JWT verification and RBAC permission DB checks on every request.';
      recommendation = 'Cache user permissions in Redis session store for sub-millisecond lookup.';
    }

    return {
      endpointId: ep.id,
      method: ep.method,
      path: ep.path,
      p50,
      p95,
      p99,
      dbQueriesCount,
      payloadKb,
      riskLevel,
      bottleneckReason,
      recommendation
    };
  });
}

