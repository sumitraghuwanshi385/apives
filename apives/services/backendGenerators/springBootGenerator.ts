import { ArchitectProject } from '../architectEngine';
import { FrameworkCodePreview } from './types';

export function generateSpringBootBackend(project: ArchitectProject): FrameworkCodePreview {
  const nameSlug = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return {
    framework: 'Spring Boot',
    description: 'Java 21 Spring Boot 3 enterprise application with Spring Security, JPA/Hibernate, Spring Validation, and OpenAPI 3 / Springdoc.',
    setupCommands: [
      `git clone https://github.com/apives/${nameSlug}-springboot.git`,
      `cd ${nameSlug}-springboot`,
      `./mvnw clean install`,
      `./mvnw spring-boot:run`
    ],
    files: [
      {
        name: 'Folder Structure',
        path: 'structure.txt',
        category: 'Folder Structure',
        content: `${nameSlug}-springboot/
├── src/main/java/com/apives/app/
│   ├── controller/ResourceController.java
│   ├── entity/ResourceEntity.java
│   ├── repository/ResourceRepository.java
│   ├── service/ResourceService.java
│   ├── config/SecurityConfig.java
│   └── Application.java
├── src/main/resources/
│   └── application.yml
├── Dockerfile
└── pom.xml`
      },
      {
        name: 'Spring REST Controller',
        path: 'src/main/java/com/apives/app/controller/ResourceController.java',
        category: 'Controllers',
        content: `package com.apives.app.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/v1/resources")
public class ResourceController {

    @GetMapping
    public ResponseEntity<?> getResources() {
        return ResponseEntity.ok("Resource list fetched successfully");
    }
}`
      },
      {
        name: 'Spring Request Mapping',
        path: 'src/main/java/com/apives/app/controller/Routes.java',
        category: 'Routes',
        content: `// Spring Boot uses annotations on controllers for route definitions`
      },
      {
        name: 'JPA Entity',
        path: 'src/main/java/com/apives/app/entity/ResourceEntity.java',
        category: 'Models',
        content: `package com.apives.app.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
public class ResourceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;
    private String status;
    private LocalDateTime createdAt;
}`
      },
      {
        name: 'Spring Security Config',
        path: 'src/main/java/com/apives/app/config/SecurityConfig.java',
        category: 'Authentication',
        content: `package com.apives.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/health", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}`
      },
      {
        name: 'Jakarta Validation DTO',
        path: 'src/main/java/com/apives/app/dto/ResourceRequest.java',
        category: 'Validation',
        content: `package com.apives.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResourceRequest(
    @NotBlank @Size(min = 3, max = 100) String title
) {}`
      },
      {
        name: 'Spring application.yml',
        path: 'src/main/resources/application.yml',
        category: 'Environment Variables',
        content: `server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/apives
    username: postgres
    password: secret
  jpa:
    hibernate:
      ddl-auto: update`
      },
      {
        name: 'JPA Repository',
        path: 'src/main/java/com/apives/app/repository/ResourceRepository.java',
        category: 'Database Connection',
        content: `package com.apives.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.apives.app.entity.ResourceEntity;

public interface ResourceRepository extends JpaRepository<ResourceEntity, String> {}`
      },
      {
        name: 'Spring Dockerfile',
        path: 'Dockerfile',
        category: 'Docker Configuration',
        content: `FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]`
      },
      {
        name: 'Springdoc OpenAPI',
        path: 'src/main/java/com/apives/app/config/OpenApiConfig.java',
        category: 'Swagger/OpenAPI Integration',
        content: `package com.apives.app.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI().info(new Info().title("${project.name}").version("1.0"));
    }
}`
      },
      {
        name: 'Health Controller',
        path: 'src/main/java/com/apives/app/controller/HealthController.java',
        category: 'Health Check Endpoint',
        content: `package com.apives.app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
    @GetMapping("/health")
    public String health() { return "{\"status\":\"UP\"}"; }
}`
      },
      {
        name: 'Bucket4j Rate Limiter',
        path: 'src/main/java/com/apives/app/config/RateLimitFilter.java',
        category: 'Rate Limiting',
        content: `// Rate Limiter Filter with Bucket4j`
      },
      {
        name: 'SLF4J Logger',
        path: 'src/main/java/com/apives/app/service/ResourceService.java',
        category: 'Logging',
        content: `import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ResourceService {
    private static final Logger log = LoggerFactory.getLogger(ResourceService.class);
}`
      },
      {
        name: 'Global Exception Handler',
        path: 'src/main/java/com/apives/app/exception/GlobalExceptionHandler.java',
        category: 'Error Handling',
        content: `package com.apives.app.exception;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handle(Exception ex) {
        return ResponseEntity.internalServerError().body(ex.getMessage());
    }
}`
      },
      {
        name: 'JUnit 5 Unit Test Scaffold',
        path: 'src/test/java/com/apives/app/ApiControllerTest.java',
        category: 'Unit Tests & Scaffolding',
        content: `package com.apives.app;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testHealthCheck() throws Exception {
        mockMvc.perform(get("/health"))
               .andExpect(status().isOk());
    }
}`
      },
      {
        name: 'Spring README',
        path: 'README.md',
        category: 'README Preview',
        content: `# ${project.name} (Spring Boot 3)`
      }
    ]
  };
}
