import { ArchitectProject } from '../architectEngine';
import { FrameworkCodePreview } from './types';

export function generateGoFiberBackend(project: ArchitectProject): FrameworkCodePreview {
  const nameSlug = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return {
    framework: 'Go Fiber',
    description: 'Ultra-fast Go Fiber framework with GORM / DB driver, JWT middleware, Zerolog, and Swagger docs.',
    setupCommands: [
      `git clone https://github.com/apives/${nameSlug}-go.git`,
      `cd ${nameSlug}-go`,
      `go mod tidy`,
      `cp .env.example .env`,
      `go run main.go`
    ],
    files: [
      {
        name: 'Folder Structure',
        path: 'structure.txt',
        category: 'Folder Structure',
        content: `${nameSlug}-go/
├── cmd/
│   └── api/
│       └── main.go
├── internal/
│   ├── handlers/
│   ├── middleware/
│   ├── models/
│   ├── repository/
│   └── config/
├── Dockerfile
├── go.mod
└── README.md`
      },
      {
        name: 'Go Fiber Handler',
        path: 'internal/handlers/resource.go',
        category: 'Controllers',
        content: `package handlers

import (
	"github.com/gofiber/fiber/v2"
)

type ResourceHandler struct{}

func NewResourceHandler() *ResourceHandler {
	return &ResourceHandler{}
}

func (h *ResourceHandler) GetResources(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"data": []fiber.Map{
			{"id": "res_1", "name": "Go Microservice Node"},
		},
	})
}`
      },
      {
        name: 'Fiber Routes Registration',
        path: 'internal/routes/routes.go',
        category: 'Routes',
        content: `package routes

import (
	"github.com/gofiber/fiber/v2"
	"internal/handlers"
	"internal/middleware"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api/v1")
	h := handlers.NewResourceHandler()

	api.Get("/resources", middleware.Protected(), h.GetResources)
}`
      },
      {
        name: 'GORM Model Struct',
        path: 'internal/models/resource.go',
        category: 'Models',
        content: `package models

import "time"

type Resource struct {
	ID        string    \`gorm:"primaryKey" json:"id"\`
	Title     string    \`gorm:"size:255;not null" json:"title"\`
	Status    string    \`gorm:"default:'ACTIVE'" json:"status"\`
	CreatedAt time.Time \`json:"created_at"\`
}`
      },
      {
        name: 'Go JWT Middleware',
        path: 'internal/middleware/auth.go',
        category: 'Authentication',
        content: `package middleware

import (
	"github.com/gofiber/fiber/v2"
	jwtware "github.com/gofiber/jwt/v3"
)

func Protected() fiber.Handler {
	return jwtware.New(jwtware.Config{
		SigningKey: []byte("go_secret_key_9988"),
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized access",
			})
		},
	})
}`
      },
      {
        name: 'Go Validation',
        path: 'internal/handlers/validator.go',
        category: 'Validation',
        content: `package handlers

import "github.com/go-playground/validator/v10"

var validate = validator.New()`
      },
      {
        name: 'Environment File',
        path: '.env.example',
        category: 'Environment Variables',
        content: `PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=secret
DB_NAME=apives_go`
      },
      {
        name: 'Database GORM Connect',
        path: 'internal/config/database.go',
        category: 'Database Connection',
        content: `package config

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDB() (*gorm.DB, error) {
	dsn := "host=localhost user=postgres password=secret dbname=apives_go port=5432 sslmode=disable"
	return gorm.Open(postgres.Open(dsn), &gorm.Config{})
}`
      },
      {
        name: 'Go Dockerfile',
        path: 'Dockerfile',
        category: 'Docker Configuration',
        content: `FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/api/main.go

FROM scratch
COPY --from=builder /app/server /server
EXPOSE 3000
ENTRYPOINT ["/server"]`
      },
      {
        name: 'Swagger Generator',
        path: 'cmd/api/main.go',
        category: 'Swagger/OpenAPI Integration',
        content: `package main

import (
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})
	app.Listen(":3000")
}`
      },
      {
        name: 'Health Check',
        path: 'internal/handlers/health.go',
        category: 'Health Check Endpoint',
        content: `package handlers

import "github.com/gofiber/fiber/v2"

func HealthCheck(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"status": "UP", "engine": "Go Fiber"})
}`
      },
      {
        name: 'Rate Limiter',
        path: 'internal/middleware/limiter.go',
        category: 'Rate Limiting',
        content: `package middleware

import (
	"time"
	"github.com/gofiber/fiber/v2/middleware/limiter"
)

var RateLimiter = limiter.New(limiter.Config{
	Max:        100,
	Expiration: 1 * time.Minute,
})`
      },
      {
        name: 'Zerolog Logger',
        path: 'internal/utils/logger.go',
        category: 'Logging',
        content: `package utils

import "github.com/rs/zerolog/log"

func Info(msg string) {
	log.Info().Msg(msg)
}`
      },
      {
        name: 'Error Handler',
        path: 'internal/middleware/error.go',
        category: 'Error Handling',
        content: `package middleware

import "github.com/gofiber/fiber/v2"

func ErrorHandler(c *fiber.Ctx, err error) error {
	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
}`
      },
      {
        name: 'Go Unit Test Scaffold',
        path: 'tests/api_test.go',
        category: 'Unit Tests & Scaffolding',
        content: `package tests

import (
	"net/http/httptest"
	"testing"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func TestHealthCheckEndpoint(t *testing.T) {
	app := fiber.New()
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "UP"})
	})

	req := httptest.NewRequest("GET", "/health", nil)
	resp, err := app.Test(req)

	assert.Nil(t, err)
	assert.Equal(t, 200, resp.StatusCode)
}`
      },
      {
        name: 'README',
        path: 'README.md',
        category: 'README Preview',
        content: `# ${project.name} (Go Fiber Backend)

High performance Go microservice.`
      }
    ]
  };
}
