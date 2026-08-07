import { ArchitectProject } from '../architectEngine';

export type SupportedFramework = 
  | 'Express.js' 
  | 'NestJS' 
  | 'FastAPI' 
  | 'Go Fiber' 
  | 'Spring Boot' 
  | 'Laravel' 
  | 'ASP.NET Core';

export interface FrameworkCodePreview {
  framework: SupportedFramework;
  description: string;
  setupCommands: string[];
  files: Array<{
    name: string;
    path: string;
    category: 
      | 'Folder Structure'
      | 'Controllers'
      | 'Routes'
      | 'Models'
      | 'Middleware'
      | 'Authentication'
      | 'Validation'
      | 'Environment Variables'
      | 'Database Connection'
      | 'Docker Configuration'
      | 'Swagger/OpenAPI Integration'
      | 'Health Check Endpoint'
      | 'Rate Limiting'
      | 'Logging'
      | 'Error Handling'
      | 'Unit Tests & Scaffolding'
      | 'README Preview';
    content: string;
  }>;
}

export interface CiCdConfigPreview {
  githubActions: string;
  gitlabCi: string;
}
