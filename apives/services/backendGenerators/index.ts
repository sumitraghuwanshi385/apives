import { ArchitectProject } from '../architectEngine';
import { SupportedFramework, FrameworkCodePreview } from './types';
import { generateExpressBackend } from './expressGenerator';
import { generateNestBackend } from './nestGenerator';
import { generateFastApiBackend } from './fastApiGenerator';
import { generateGoFiberBackend } from './goFiberGenerator';
import { generateSpringBootBackend } from './springBootGenerator';
import { generateLaravelBackend } from './laravelGenerator';
import { generateDotnetBackend } from './dotnetGenerator';

export * from './types';
export * from './expressGenerator';
export * from './nestGenerator';
export * from './fastApiGenerator';
export * from './goFiberGenerator';
export * from './springBootGenerator';
export * from './laravelGenerator';
export * from './dotnetGenerator';
export * from './cicdGenerators';

export function generateFrameworkBackend(
  framework: SupportedFramework,
  project: ArchitectProject
): FrameworkCodePreview {
  switch (framework) {
    case 'Express.js':
      return generateExpressBackend(project);
    case 'NestJS':
      return generateNestBackend(project);
    case 'FastAPI':
      return generateFastApiBackend(project);
    case 'Go Fiber':
      return generateGoFiberBackend(project);
    case 'Spring Boot':
      return generateSpringBootBackend(project);
    case 'Laravel':
      return generateLaravelBackend(project);
    case 'ASP.NET Core':
    default:
      return generateDotnetBackend(project);
  }
}
