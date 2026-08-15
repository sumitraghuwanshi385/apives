import React, {
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  X,
  Check,
  ChevronRight,
  ArrowLeft,
  Mail,
  Copy,
  Share2,
  MessageCircle,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

interface FAQ {
  question: string;
  answer: string;
}

interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  keywords: string[];
  faq: FAQ[];
}

/* =========================================================
   CONSTANTS
========================================================= */

const BLOG_IMAGE =
  "https://res.cloudinary.com/dp7avkarg/image/upload/v1786794737/Picsart_26-08-15_17-19-34-167_ozvdlb.png";

const GREEN = "#22c55e";
const GREEN_SOFT = "#4ade80";

/* =========================================================
   ARTICLES
========================================================= */

const ARTICLES: Article[] = [
  {
    id: 1,
    slug: "rest-vs-graphql-vs-grpc",
    title: "REST vs GraphQL vs gRPC: Which API Should You Use?",
    excerpt:
      "REST, GraphQL, and gRPC solve different API problems. Learn how they compare, where each architecture works best, and how to choose the right API technology for your product.",
    date: "August 14, 2026",
    keywords: [
      "REST API",
      "REST vs GraphQL",
      "GraphQL vs gRPC",
      "gRPC",
      "API architecture",
      "API design",
      "best API architecture",
    ],
    content: `
## Choosing an API Architecture Is a Product Decision

When developers start a new application, the API architecture is often one of the first technical decisions they make. REST, GraphQL, and gRPC are all mature technologies, but they were designed around different problems and different communication patterns.

The right choice is therefore not about finding the technology that is technically most advanced. It is about understanding how your clients communicate with your backend, how your data is structured, how much flexibility clients need, and what kind of performance your application actually requires.

For most startups and public developer platforms, REST remains the easiest place to begin. GraphQL becomes particularly attractive when applications need highly flexible data fetching, while gRPC is often a strong fit for communication between internal services.

## REST: The Practical Default

REST APIs are built around resources and standard HTTP semantics. A typical application might expose endpoints such as users, products, orders, invoices, payments, or subscriptions.

This approach is easy for developers to understand because HTTP already provides many of the concepts required by a REST API: methods, status codes, headers, caching, authentication middleware, and content negotiation.

That ecosystem is one of REST's biggest advantages.

A developer integrating a public REST API can usually make requests with curl, JavaScript, Python, Go, Java, or almost any modern programming language without requiring a specialized client runtime.

REST is particularly suitable for SaaS products, public APIs, ecommerce platforms, mobile backends, dashboards, and CRUD-heavy applications.

The official HTTP Semantics specification is also useful when designing APIs that make proper use of HTTP methods and status codes.

## GraphQL: Flexible Data for Complex Clients

GraphQL approaches API design differently.

Instead of defining many fixed response structures, a GraphQL server exposes a schema and allows clients to describe the data they need.

This becomes valuable when multiple clients have different requirements.

A desktop application might need twenty fields while a mobile application only needs five. With traditional REST endpoints, developers sometimes create multiple endpoints or return larger responses than necessary. GraphQL gives the client more control over the requested shape.

This flexibility makes GraphQL particularly useful for complex dashboards, applications with highly connected data, and products where frontend requirements change frequently.

However, flexibility also creates responsibility for the backend team.

Poor resolver design can create excessive database queries, expensive nested requests, and difficult-to-control workloads. Production GraphQL APIs therefore need sensible pagination, query complexity limits, batching, caching, and monitoring.

## gRPC: Efficient Service-to-Service Communication

gRPC was designed with a different use case in mind.

It is particularly useful when multiple backend services need to communicate efficiently and reliably. gRPC uses Protocol Buffers for strongly typed contracts and supports streaming and efficient binary serialization.

This makes it attractive for microservice architectures, internal infrastructure, high-throughput systems, and applications where service-to-service latency matters.

A company might expose a REST API to external developers while using gRPC internally between its payment service, user service, analytics service, and recommendation system.

This hybrid architecture can provide a simple public developer experience while keeping internal communication efficient and strongly typed.

## REST vs GraphQL vs gRPC

There is no requirement to choose only one technology.

A mature system can use REST at the public edge, GraphQL for a complex frontend, and gRPC between internal services. These technologies can coexist when each one has a clear purpose.

REST is generally the easiest choice for a public API.

GraphQL is useful when clients need flexible access to connected data.

gRPC is excellent when backend services need efficient typed communication.

The important thing is to avoid introducing complexity before the product actually needs it.

## What Should a Startup Choose?

For an early-stage startup, REST is usually the most practical starting point.

It has a huge ecosystem, simple debugging, excellent tooling, straightforward documentation, and a familiar mental model for developers.

As the application grows, the architecture can evolve.

Good API design is not about choosing the trendiest protocol. It is about creating a stable contract that developers can understand, applications can depend on, and engineering teams can maintain for years.

The best API architecture is therefore the one that matches the actual requirements of the product rather than adding unnecessary complexity for the sake of using a newer technology.
`,
    faq: [
      {
        question: "Is REST better than GraphQL?",
        answer:
          "Neither is universally better. REST is simpler and works extremely well for most public APIs, while GraphQL is useful when clients need flexible access to complex and connected data.",
      },
      {
        question: "When should I use gRPC instead of REST?",
        answer:
          "gRPC is particularly useful for internal microservices, high-performance service communication, streaming, and systems that benefit from strongly typed contracts.",
      },
      {
        question: "Can REST and GraphQL be used together?",
        answer:
          "Yes. Many systems expose REST endpoints publicly while using GraphQL for specific frontend workloads or internal aggregation layers.",
      },
      {
        question: "Is GraphQL faster than REST?",
        answer:
          "Not automatically. GraphQL can reduce unnecessary data fetching, but poorly designed resolvers can make database performance worse. Actual performance depends on implementation.",
      },
      {
        question: "What should a startup choose first?",
        answer:
          "REST is usually the simplest starting point. GraphQL or gRPC can be introduced later when the product has a clear requirement for their strengths.",
      },
    ],
  },

  {
    id: 2,
    slug: "best-llm-apis-2026",
    title: "Best LLM APIs in 2026: OpenAI vs Anthropic vs Gemini",
    excerpt:
      "A practical guide to modern LLM APIs covering model selection, latency, context windows, structured output, reliability, cost control, and multi-model AI architecture.",
    date: "August 12, 2026",
    keywords: [
      "LLM APIs",
      "AI APIs",
      "OpenAI API",
      "Anthropic API",
      "Gemini API",
      "best AI API 2026",
      "AI infrastructure",
    ],
    content: `
## LLM APIs Have Become Application Infrastructure

Language models are no longer limited to chat interfaces. Developers now use LLM APIs for customer support, document extraction, coding assistants, semantic search, workflow automation, data classification, research systems, and autonomous agents.

That shift has changed the API selection problem.

Choosing an LLM provider is no longer simply about asking which model produces the best answer. Production teams have to think about latency, token costs, context length, structured responses, tool calling, reliability, rate limits, privacy requirements, and how easily the application can move between models.

For startups, these decisions matter even more because early architecture choices can directly affect product margins and the speed at which new AI features can be shipped.

## OpenAI

OpenAI provides a mature developer platform for building AI-powered applications.

Its ecosystem is particularly useful for applications that need general-purpose language understanding, structured outputs, tool use, reasoning workflows, and developer-friendly APIs.

For startups, one advantage is the amount of existing documentation, community knowledge, SDK support, and third-party tooling around the platform.

The OpenAI API can be used for everything from conversational applications and content generation to structured extraction, agentic workflows, and developer tools.

## Anthropic

Anthropic's Claude family has become particularly popular for coding, long-form analysis, document workflows, and tasks where following complex instructions is important.

Claude can be useful for applications where the model needs to reason over large amounts of context while maintaining a consistent response style.

This makes it interesting for research applications, coding assistants, knowledge systems, and long-form document processing.

## Google Gemini

Gemini is particularly interesting for multimodal AI applications.

Depending on the model, applications can work with combinations of text, images, audio, video, and code. This makes Gemini relevant for applications that need to understand more than plain text.

For products involving visual analysis, media processing, or multimodal workflows, this can be a meaningful advantage.

## The Best Model Depends on the Job

A production AI application does not necessarily need the most powerful model for every request.

A small classification task might be handled by a smaller and cheaper model.

A customer support response may use a fast general-purpose model.

A complex research request might require a stronger reasoning model.

An image analysis workflow may require a multimodal model.

Model routing can therefore become an important part of AI application architecture.

Instead of thinking about one model as the permanent answer, teams can treat models as infrastructure components and choose them according to the workload.

## Cost Is an Engineering Problem

LLM costs can become significant when usage increases.

Teams should monitor token consumption, request volume, model selection, cache usage, and average cost per successful task.

A model that is twice as expensive but dramatically reduces failures might still be cheaper at the application level.

Likewise, sending every simple request to a premium model is usually unnecessary.

Good AI architecture balances quality and cost rather than optimizing only for benchmark performance.

## Reliability Matters

External AI APIs can experience rate limits, temporary failures, increased latency, or service interruptions.

Production applications should consider timeouts, retries with backoff, usage limits, observability, and provider fallback strategies.

The goal is to make the AI layer behave like reliable application infrastructure rather than an unpredictable external dependency.

## Building a Multi-Model AI Stack

A mature AI application may eventually use several providers.

This does not mean every startup needs a complicated model router on day one.

Start with the provider that best fits the product.

Once usage, cost, or reliability creates a real problem, introduce routing and fallback logic.

The best LLM API is ultimately the one that gives your application the right balance of quality, latency, cost, reliability, and developer experience.
`,
    faq: [
      {
        question: "Which LLM API is best in 2026?",
        answer:
          "There is no universal winner. OpenAI, Anthropic, and Gemini each have different strengths, so the right choice depends on your application's workload and requirements.",
      },
      {
        question: "Should startups use multiple LLM providers?",
        answer:
          "A startup can begin with one provider. Multiple providers become useful later when cost optimization, reliability, model specialization, or fallback requirements justify the added complexity.",
      },
      {
        question: "How should I reduce LLM API costs?",
        answer:
          "Use smaller models for simple tasks, control context size, cache repeatable results, monitor token usage, and route complex requests only to models that actually need their additional capability.",
      },
      {
        question: "Why is streaming important for AI applications?",
        answer:
          "Streaming allows users to see a response while it is being generated, significantly improving perceived responsiveness for chat and interactive AI applications.",
      },
      {
        question: "What should I monitor when using an LLM API?",
        answer:
          "Track request volume, latency, error rates, token consumption, model usage, cost per task, rate limits, and failed or retried requests.",
      },
    ],
  },

  {
    id: 3,
    slug: "api-security-best-practices",
    title: "API Security Best Practices: 10 Common API Security Risks",
    excerpt:
      "Learn the most important API security practices, from broken authorization and weak authentication to rate limiting, validation, secret management, and secure error handling.",
    date: "August 10, 2026",
    keywords: [
      "API security",
      "API security best practices",
      "OWASP API Security",
      "API vulnerabilities",
      "secure REST API",
      "API authentication",
    ],
    content: `
## API Security Starts With the Design

APIs frequently sit between users and sensitive application data. They expose account information, payments, files, business records, internal services, and sometimes administrative operations.

That makes an API a major part of an application's security boundary.

The most dangerous API vulnerabilities are often not complicated cryptographic failures. They are ordinary authorization mistakes, predictable IDs, overly permissive responses, weak authentication, missing rate limits, unsafe input handling, and secrets that were never meant to be public.

## Broken Object Level Authorization

One of the most important API security issues is failing to verify whether the authenticated user is allowed to access a particular object.

Imagine a request such as:

/api/orders/1001

A malicious user changes the ID to:

/api/orders/1002

Being logged in does not automatically mean the user owns order 1002.

The backend must check ownership or permission before returning the resource.

This check should happen on the server, not only in the frontend.

## Authentication Is Not Authorization

Authentication answers the question of who a user or service is.

Authorization answers what that identity is allowed to access.

A user can be correctly authenticated and still have no permission to read another user's invoice, modify an administrator setting, or access a private file.

Keeping these concepts separate makes API security easier to reason about and helps teams avoid treating login as a complete access-control system.

## Rate Limiting Prevents Abuse

Public APIs should normally have reasonable rate limits.

Without limits, attackers can abuse login endpoints, password-reset endpoints, expensive search queries, AI features, or other resource-heavy operations.

Rate limits should be designed around the endpoint and its cost rather than applying the same number everywhere.

For example, an expensive AI generation endpoint may need a much stricter policy than a lightweight health-check endpoint.

## Validate Untrusted Input

Every API request should be considered untrusted.

Validate request bodies, query parameters, IDs, uploaded files, headers, and nested JSON structures.

Input validation should happen before the data reaches sensitive business logic or database queries.

Good validation also gives API consumers predictable errors instead of allowing malformed requests to produce confusing backend failures.

## Avoid Excessive Data Exposure

An endpoint should return the information the client actually needs.

Returning an entire database record because it is convenient can accidentally expose internal fields, metadata, permissions, email addresses, or other sensitive information.

Explicit response schemas are often safer than simply serializing database objects.

## Protect Secrets

API keys, database credentials, signing keys, and production tokens should never be embedded in frontend JavaScript or committed to a public Git repository.

Use environment variables and dedicated secret-management systems where appropriate.

If a production secret is accidentally exposed, rotate it instead of simply deleting the leaked file.

## Secure Error Responses

Detailed errors are useful during development.

They can be dangerous in production.

Database stack traces, filesystem paths, internal service names, and secret configuration should not be returned to public clients.

Give developers enough information to understand the error without exposing internal implementation details.

## HTTPS Is Mandatory for Sensitive APIs

Authentication credentials and sensitive data should be transmitted over HTTPS.

TLS protects information while it moves between the client and server.

HTTP should not be used for production authentication flows simply because it is easier to test.

## Logging and Monitoring

Security controls are incomplete if there is no visibility.

Monitor authentication failures, permission errors, unusual request patterns, rate-limit events, suspicious traffic, and unexpected changes in access behavior.

Good logs also make incident investigation dramatically easier.

API security is not one middleware package or one authentication library. It is a collection of controls that work together to protect the entire API lifecycle.
`,
    faq: [
      {
        question: "What is the biggest API security risk?",
        answer:
          "Broken authorization, especially failing to verify access to individual objects, is one of the most important and common API security problems.",
      },
      {
        question: "Should every public API have rate limiting?",
        answer:
          "Most public APIs should have rate limits, particularly for authentication, search, AI, file processing, and other resource-intensive endpoints.",
      },
      {
        question: "Can API keys be exposed in frontend code?",
        answer:
          "Sensitive API keys should not be placed in frontend code because users can inspect and extract them. Secrets should remain on trusted backend infrastructure.",
      },
      {
        question: "Why is authorization different from authentication?",
        answer:
          "Authentication identifies the caller, while authorization determines which resources and actions that authenticated identity is allowed to access.",
      },
      {
        question: "What is OWASP API Security?",
        answer:
          "OWASP API Security is a security project that documents common API risks and provides guidance for building and reviewing secure APIs.",
      },
    ],
  },

  {
    id: 4,
    slug: "how-to-build-production-ready-api",
    title: "How to Build a Production-Ready API: 7 Essential Steps",
    excerpt:
      "A practical guide to building a production-ready API with clear contracts, authentication, validation, consistent errors, testing, monitoring, documentation, and scalability in mind.",
    date: "August 8, 2026",
    keywords: [
      "build API",
      "production API",
      "API development",
      "REST API development",
      "API best practices",
      "production ready API",
    ],
    content: `
## A Production API Is More Than Working Endpoints

A backend can return the correct JSON and still not be ready for production.

Production APIs need to handle authentication, authorization, invalid input, unexpected traffic, database failures, external service outages, observability, documentation, backwards compatibility, and changing requirements.

The best time to think about these things is before the API becomes difficult to change.

## 1. Start With the Consumer

Before creating endpoints, understand who will consume the API.

A public developer API needs clear authentication, documentation, examples, versioning, rate limits, and predictable errors.

An internal service may prioritize latency, reliability, and strong service-to-service contracts.

The architecture should reflect the actual consumer rather than forcing every API into the same design.

## 2. Define the API Contract

Design endpoints and response structures before implementing every backend detail.

An OpenAPI specification can become a shared contract between frontend developers, backend developers, QA teams, and external consumers.

The OpenAPI Specification provides a machine-readable standard for describing HTTP APIs.

A clear contract also reduces the amount of back-and-forth required when different teams build against the same backend.

## 3. Build Authentication and Authorization Early

Authentication should not be bolted onto an API after the business logic is finished.

Decide how users and services authenticate and how permissions are represented.

An authenticated user should still be checked against the requested resource.

This is especially important for APIs containing customer data, financial information, files, or administrative operations.

## 4. Validate Requests

API requests come from outside the trusted application boundary.

Validate required fields, data types, lengths, allowed values, identifiers, nested structures, and uploaded content.

Good validation prevents invalid data from travelling deep into the system and makes errors easier for API consumers to understand.

Validation should also be consistent across endpoints so that developers do not have to learn completely different error behaviors for every part of the API.

## 5. Create Consistent Errors

A good API does not force developers to guess what an error means.

Use predictable status codes and a consistent response structure.

For example:

{
  "error": {
    "code": "INVALID_EMAIL",
    "message": "The email address is invalid."
  }
}

Stable error codes are especially useful when clients need to handle specific problems programmatically.

## 6. Test Real Workflows

Unit tests are valuable, but production APIs also need integration and end-to-end testing.

Test authentication, authorization, invalid requests, database failures, external API failures, rate limits, large payloads, pagination, and realistic user workflows.

Load-testing tools can also help teams understand how an API behaves under increasing traffic.

## 7. Monitor Before Users Complain

A production API needs observability.

Track request volume, error rates, response latency, database performance, external service failures, and resource usage.

P95 and P99 latency are often more informative than averages because they expose slower requests that affect a smaller percentage of users.

## Documentation Is Part of the Product

A technically excellent API can still fail to gain adoption if developers cannot figure out how to use it.

Good API documentation should explain authentication, base URLs, endpoints, request examples, response examples, common errors, limits, pagination, and real-world workflows.

Documentation is not something to add at the very end. It is part of the developer experience and often determines how quickly someone can successfully integrate the API.

A production-ready API is ultimately a combination of good engineering and good developer experience.
`,
    faq: [
      {
        question: "What makes an API production-ready?",
        answer:
          "A production-ready API should have authentication, authorization, validation, consistent errors, testing, monitoring, documentation, reliability controls, and a clear strategy for future changes.",
      },
      {
        question: "Should APIs use OpenAPI?",
        answer:
          "OpenAPI is highly useful for documenting HTTP APIs and can also power generated types, SDKs, mock servers, validation, and developer tooling.",
      },
      {
        question: "What API tests are important before launch?",
        answer:
          "Test authentication, authorization, invalid input, database failures, external services, rate limits, pagination, realistic workflows, and performance under expected traffic.",
      },
      {
        question: "What does API observability include?",
        answer:
          "API observability typically includes request volume, latency, error rates, database performance, external dependency failures, logs, traces, and infrastructure metrics.",
      },
      {
        question: "Why is API documentation important?",
        answer:
          "Clear documentation reduces integration time and gives developers confidence about authentication, requests, responses, errors, limits, and expected API behavior.",
      },
    ],
  },

  {
    id: 5,
    slug: "openapi-specification-guide",
    title: "OpenAPI Specification: Why Your API Needs It",
    excerpt:
      "OpenAPI is more than documentation. Learn how one API specification can power SDKs, mock servers, generated types, tests, validation, and better developer experiences.",
    date: "August 6, 2026",
    keywords: [
      "OpenAPI",
      "OpenAPI specification",
      "Swagger",
      "API documentation",
      "API SDK generation",
      "API contract",
    ],
    content: `
## What Is OpenAPI?

OpenAPI is a standard machine-readable format for describing HTTP APIs.

It can describe endpoints, parameters, request bodies, response structures, authentication mechanisms, schemas, examples, and other parts of an API contract.

The official OpenAPI Specification is the best reference for understanding the standard and its current capabilities.

## OpenAPI Is More Than Documentation

Many developers first encounter OpenAPI through generated API documentation.

That is useful, but documentation is only one part of the story.

A well-maintained OpenAPI specification can become the source for SDK generation, mock APIs, type generation, validation, contract testing, API governance, and automated developer tooling.

That makes OpenAPI valuable throughout the API development lifecycle.

## One Contract for Multiple Teams

Frontend and backend teams often disagree about what an endpoint should return.

A shared OpenAPI contract creates a common reference.

The frontend team knows which fields are available.

The backend team knows which response structure must be implemented.

QA can understand expected requests and responses.

External developers can integrate against the documented contract.

This reduces ambiguity before it becomes production bugs and makes API changes easier to review before they reach users.

## Generate Client SDKs

Maintaining SDKs manually for JavaScript, Python, Go, Java, and other languages can become expensive.

OpenAPI-based tooling can generate large portions of these clients automatically.

That does not eliminate the need for thoughtful SDK design, but it can dramatically reduce repetitive implementation work.

Generated SDKs are particularly useful for developer platforms because they allow API consumers to start integrating without manually writing HTTP request wrappers.

## Generate Types

TypeScript teams can generate request and response types from an OpenAPI document.

This helps reduce the gap between frontend assumptions and backend reality.

When an API changes, generated types can expose the change during development instead of allowing an incompatible assumption to reach production.

## Mock APIs Before Backend Completion

A frontend team should not always have to wait for the backend to be finished.

An OpenAPI document can be used to create mock responses.

This makes parallel development possible and allows teams to discover API design problems before implementation is deeply embedded.

It also gives product teams something concrete to review before backend implementation is complete.

## Spec-First API Development

Some teams prefer to write the API specification before implementing the backend.

The process can look like this:

Define the API contract.

Review the contract.

Generate documentation and mocks.

Implement the service.

Validate the implementation against the contract.

This moves important API decisions earlier, when they are cheaper to change.

## Keep OpenAPI Accurate

The biggest problem is not having an OpenAPI file.

It is having an outdated one.

If the specification says the API returns one structure while the production server returns another, developers lose trust in the documentation.

OpenAPI works best when the contract is treated as a real engineering artifact rather than a document created once and forgotten.

For teams building public APIs, keeping this contract accurate can significantly improve developer onboarding and reduce integration friction.
`,
    faq: [
      {
        question: "What is OpenAPI used for?",
        answer:
          "OpenAPI can describe API endpoints and contracts and can also support documentation, SDK generation, mock servers, type generation, validation, and testing.",
      },
      {
        question: "Is OpenAPI the same as Swagger?",
        answer:
          "OpenAPI is the specification standard. Swagger refers to a family of tools that work with OpenAPI documents.",
      },
      {
        question: "Can OpenAPI generate SDKs?",
        answer:
          "Yes. Many tools can generate client libraries and types from OpenAPI specifications.",
      },
      {
        question: "What is spec-first API development?",
        answer:
          "Spec-first development means designing and reviewing the API contract before implementing the backend, allowing teams to agree on behavior early.",
      },
      {
        question: "Why does an outdated OpenAPI file cause problems?",
        answer:
          "If documentation and production behavior disagree, developers cannot confidently integrate the API. Keeping the specification synchronized is therefore essential.",
      },
    ],
  },

  {
    id: 6,
    slug: "webhook-best-practices",
    title: "Webhook Best Practices: How to Build Reliable Webhooks",
    excerpt:
      "Learn how to build reliable webhooks with signature verification, retries, idempotency, queues, fast responses, delivery logs, and failure handling.",
    date: "August 4, 2026",
    keywords: [
      "webhooks",
      "webhook best practices",
      "webhook security",
      "webhook retries",
      "webhook idempotency",
      "reliable webhooks",
    ],
    content: `
## Webhooks Are Simple Until They Fail

A webhook allows one application to notify another application when something happens.

A payment succeeds.

A customer signs up.

An order changes status.

A subscription is cancelled.

The provider sends an HTTP request to a URL controlled by the receiving application.

The basic mechanism is simple, but reliable webhook delivery requires careful engineering because networks fail, servers timeout, requests are duplicated, and events can arrive in an unexpected order.

## Respond Quickly

A webhook endpoint should usually avoid performing long-running work before responding.

A better architecture is:

Receive the event.

Verify its authenticity.

Store the event.

Put the work into a queue.

Return a successful response.

Process the event asynchronously.

This approach makes the endpoint faster and reduces timeout-related retries.

It also creates a clean boundary between receiving an event and actually performing business logic.

## Verify Webhook Signatures

If a provider includes a webhook signature, verify it before processing the event.

For example, Stripe provides detailed documentation for verifying webhook requests.

The important principle is simple: never trust incoming webhook data just because it reached your endpoint.

Signature verification should happen before sensitive side effects such as updating payment status, activating subscriptions, issuing credits, or changing account state.

## Expect Duplicate Events

Webhook systems should normally be designed around at-least-once delivery rather than assuming every event will arrive exactly once.

A provider may retry an event after a timeout even though your application successfully processed it.

Store an event identifier and make processing idempotent.

If the same event arrives again, the application should recognize it and avoid performing the same side effect twice.

## Handle Retries

Temporary failures happen.

A receiving API may be unavailable.

A database might be down.

A deployment might be in progress.

Webhook systems need retry strategies that handle temporary failures without creating an infinite loop.

Exponential backoff and maximum retry counts are common approaches.

## Events Can Arrive Out of Order

Developers should not assume that event A will always arrive before event B.

For example, an update event could arrive before a creation event because of network timing or retry behavior.

Use timestamps, versions, sequence numbers, or current-state lookups where appropriate.

## Build Delivery Logs

A good webhook platform should let developers understand what happened.

Useful information includes event ID, delivery attempt, timestamp, endpoint, HTTP status, response body, duration, retry count, and final delivery state.

Without these logs, webhook debugging can become extremely frustrating.

Developers should be able to quickly answer whether an event was sent, whether it reached their server, what response their server returned, and whether the provider is going to retry it.

## Webhooks Are Developer Experience

A reliable webhook system should make testing easy.

Developers should be able to inspect payloads, resend failed events, understand signature verification, view delivery attempts, and know exactly why a request failed.

The best webhook systems are designed around failure rather than assuming the network will always behave perfectly.

Reliable webhook infrastructure is therefore a combination of secure delivery, predictable retries, idempotent processing, observability, and good developer documentation.
`,
    faq: [
      {
        question: "Should webhook processing be asynchronous?",
        answer:
          "For most non-trivial workloads, yes. Store or queue the event and process expensive work asynchronously so the webhook endpoint can respond quickly.",
      },
      {
        question: "Can webhook events be delivered twice?",
        answer:
          "Yes. Providers may retry events, so consumers should use idempotency techniques to safely handle duplicate deliveries.",
      },
      {
        question: "Why should webhook signatures be verified?",
        answer:
          "Signature verification helps confirm that the event came from the expected provider and was not modified before your application processed it.",
      },
      {
        question: "What should webhook logs contain?",
        answer:
          "Useful webhook logs include event ID, delivery attempt, timestamp, HTTP status, response, duration, retry count, and final delivery state.",
      },
      {
        question: "Can webhook events arrive out of order?",
        answer:
          "Yes. Applications should not blindly assume chronological delivery and should use event versions, timestamps, or current-state validation when ordering matters.",
      },
    ],
  },

  {
    id: 7,
    slug: "oauth-2-pkce-client-credentials",
    title: "OAuth 2.0 Explained: PKCE vs Client Credentials",
    excerpt:
      "Understand the OAuth 2.0 flows developers actually use, including Authorization Code with PKCE, Client Credentials, access tokens, refresh tokens, scopes, and security best practices.",
    date: "August 2, 2026",
    keywords: [
      "OAuth 2.0",
      "OAuth PKCE",
      "Client Credentials",
      "OAuth authentication",
      "API authentication",
      "OAuth security",
    ],
    content: `
## What OAuth 2.0 Actually Solves

OAuth 2.0 is an authorization framework designed to allow applications to access resources without requiring users to share their passwords with those applications.

This distinction matters because OAuth is often described simply as an authentication system.

Its primary purpose is delegated authorization.

The official OAuth 2.0 specification provides the formal protocol definitions, while modern security recommendations provide additional guidance for secure deployments.

## Authorization Code With PKCE

Authorization Code with PKCE is widely used for public clients such as mobile applications and browser-based applications.

The client creates a temporary code verifier and sends a related challenge during the authorization process.

After the user authorizes the application, the authorization server returns a code. The client then exchanges that code using the verifier.

This makes authorization codes significantly harder to abuse if they are intercepted.

PKCE is now an important part of modern OAuth implementations for applications where a client secret cannot safely be kept private.

## Client Credentials

The Client Credentials flow solves a different problem.

There is no user involved.

Imagine a backend service that needs to call another API to process payments, retrieve analytics, or access internal data.

The service authenticates itself using its client credentials and receives an access token.

This is appropriate for machine-to-machine communication.

## Access Tokens and Refresh Tokens

Access tokens are generally designed to be short-lived.

When longer sessions are required, refresh tokens can be used to obtain new access tokens without forcing the user to authorize again.

Applications should protect refresh tokens carefully because they can represent significant access.

Token storage should be treated as a security decision rather than simply a frontend implementation detail.

## Scopes

Scopes allow an authorization server to express what an application is permitted to access.

Instead of granting unrestricted access, an application might receive permission to read profile data but not modify account settings.

Fine-grained scopes can reduce the impact of compromised credentials.

## Authentication vs Authorization

Authentication asks:

Who are you?

Authorization asks:

What are you allowed to access?

An API can successfully authenticate a user and still reject the request because that user does not have permission to access the requested resource.

Understanding this distinction is critical when designing secure APIs.

## Keep OAuth Boring

Good authentication infrastructure should be predictable.

Developers should know how to begin authorization, exchange codes, refresh tokens, understand scopes, handle expiration, and respond to authorization errors.

OAuth becomes difficult when implementations mix outdated flows, unclear token handling, inconsistent scopes, and poorly documented behavior.

A good OAuth implementation should make the secure path the easiest path for API consumers.

For public APIs, clear authentication documentation is just as important as the underlying protocol implementation because developers need to understand exactly how to obtain and use credentials.
`,
    faq: [
      {
        question: "What is PKCE in OAuth 2.0?",
        answer:
          "PKCE adds a temporary verifier and challenge to the authorization flow, helping protect authorization codes from interception.",
      },
      {
        question: "When should I use Client Credentials?",
        answer:
          "Client Credentials is designed for machine-to-machine authentication where a backend service needs to authenticate itself without a user being involved.",
      },
      {
        question: "Is OAuth authentication or authorization?",
        answer:
          "OAuth is primarily an authorization framework. Authentication and identity are often implemented with related standards such as OpenID Connect.",
      },
      {
        question: "Why should access tokens expire?",
        answer:
          "Short-lived tokens reduce the amount of time a compromised credential can be used, limiting potential damage.",
      },
      {
        question: "What are OAuth scopes?",
        answer:
          "Scopes describe the permissions an access token grants, allowing applications to receive limited access instead of unrestricted access to a user's resources.",
      },
    ],
  },

  {
    id: 8,
    slug: "graphql-n-plus-one-dataloader",
    title: "GraphQL at Scale: How to Fix the N+1 Query Problem",
    excerpt:
      "Learn why GraphQL applications can accidentally create hundreds of database queries and how batching, DataLoader, caching, pagination, and query limits solve the problem.",
    date: "July 30, 2026",
    keywords: [
      "GraphQL",
      "GraphQL N+1",
      "DataLoader",
      "GraphQL performance",
      "GraphQL scalability",
      "GraphQL optimization",
    ],
    content: `
## GraphQL Gives Clients Flexibility

One of GraphQL's biggest strengths is the ability for clients to request connected data in a single operation.

A dashboard might request users, organizations, projects, billing information, activity, and permissions in one query.

That flexibility is excellent for frontend development.

It can also expose serious backend performance problems when every resolver independently queries the database.

## Understanding the N+1 Problem

Imagine an API returns 100 users.

The backend performs one query to retrieve the users.

Then a resolver fetches the company for every user individually.

Instead of one database query, the application now performs 101 queries.

That is the classic N+1 problem.

The application may work perfectly during local development with ten users and then become unexpectedly slow when production traffic increases.

## Why Resolvers Cause It

GraphQL resolvers are often written in a modular way.

A user resolver knows how to retrieve a user.

A company resolver knows how to retrieve a company.

An organization resolver knows how to retrieve an organization.

The problem appears when each resolver is unaware that another resolver is requesting the same related data.

The result is many small database queries instead of a few efficient ones.

## DataLoader and Batching

DataLoader is a common approach to solving many N+1 patterns.

Instead of immediately querying the database for every company, the application collects the requested company IDs and performs a batched query.

One request for 100 companies can become a single query that retrieves all required records.

The results are then mapped back to the appropriate GraphQL fields.

## Caching Helps, But It Is Not Everything

Caching can reduce repeated work, but it should not hide poor database design.

Before adding aggressive caching, investigate indexes, query plans, joins, connection pools, pagination, and resolver behavior.

A fast cache cannot permanently compensate for an inefficient underlying data model.

## Pagination Is Essential

Public GraphQL APIs should not allow clients to request unlimited records.

A query that asks for every customer, every order, every transaction, and every related item can consume enormous resources.

Use sensible limits and pagination.

Cursor-based pagination is often useful for large datasets because it behaves more predictably as data changes.

## Query Complexity and Depth

GraphQL gives clients control over query structure.

That means public APIs should consider query depth and complexity.

A malicious or accidentally inefficient query should not be able to consume all available database or CPU resources.

Complexity analysis, depth limits, timeouts, and maximum page sizes can provide important protection.

## Monitor Resolver Performance

GraphQL monitoring should go beyond total request latency.

Track resolver execution time, database query count, cache hit rates, error rates, and slow query patterns.

Once these metrics are visible, performance problems become much easier to identify.

GraphQL scales well when its flexibility is paired with disciplined backend architecture and careful control over expensive queries.
`,
    faq: [
      {
        question: "What causes the GraphQL N+1 problem?",
        answer:
          "N+1 usually happens when nested resolvers execute separate database queries for each returned object instead of batching related data.",
      },
      {
        question: "How does DataLoader help?",
        answer:
          "DataLoader collects related requests and batches them into fewer database operations while also providing request-level caching.",
      },
      {
        question: "Should GraphQL APIs use pagination?",
        answer:
          "Yes. Production GraphQL APIs should use sensible page sizes and pagination to prevent clients from requesting extremely large datasets.",
      },
      {
        question: "Can caching solve every GraphQL performance issue?",
        answer:
          "No. Caching can help repeated work, but inefficient queries, missing indexes, excessive resolver calls, and poor pagination still need to be fixed.",
      },
      {
        question: "Why should public GraphQL APIs limit query complexity?",
        answer:
          "Complexity limits prevent clients from accidentally or intentionally sending extremely expensive nested queries that consume excessive backend resources.",
      },
    ],
  },

  {
    id: 9,
    slug: "api-load-testing-guide",
    title: "API Load Testing: How to Test an API Before Launch",
    excerpt:
      "A practical API load testing guide covering realistic traffic, P95 and P99 latency, error rates, database bottlenecks, capacity planning, and performance testing tools.",
    date: "July 28, 2026",
    keywords: [
      "API load testing",
      "API performance testing",
      "k6",
      "API stress testing",
      "API testing tools",
      "API scalability",
    ],
    content: `
## A Fast API Is Not Necessarily a Scalable API

An API can perform perfectly during development and still fail when real traffic arrives.

Local testing often uses one developer, a small database, and almost no concurrent requests.

Production is different.

Multiple users may authenticate simultaneously, search large datasets, upload files, trigger background jobs, and request external services at the same time.

Load testing helps reveal what happens when that pressure increases.

## Test Real User Workflows

Testing only /health is not enough.

A health endpoint might return in a few milliseconds while the actual application has slow database queries and expensive business logic.

A realistic performance test should include workflows such as authentication, search, reading data, creating resources, updating records, file processing, and other important operations.

The closer the test resembles real user behavior, the more useful the result becomes.

## Understand P95 and P99

Average response time can hide slow requests.

If almost every request is fast but a small percentage take several seconds, users can still experience serious performance problems.

P95 represents the latency under which approximately 95% of requests complete.

P99 focuses on the slowest one percent.

These metrics are especially useful when evaluating APIs with unpredictable workloads.

## k6 for Developer-Focused Load Testing

k6 is a popular load-testing tool that allows developers to define virtual users, scenarios, thresholds, and traffic patterns.

The purpose of a load test is not to create the largest possible number.

The purpose is to understand how the system behaves at expected and gradually increasing traffic levels.

## Watch the Database

The database is frequently the first major bottleneck.

During a load test, monitor slow queries, indexes, connection pools, locks, CPU, memory, and query counts.

An API endpoint can have excellent application-level code while still being slow because a database query performs a full table scan.

## Define Performance Targets

Before testing, define what success means.

For example:

P95 latency below a specific target.

Low 5xx error rates.

Stable database connection usage.

No memory leaks.

The exact numbers depend on the application and user expectations.

## Capacity Planning

Once the system is tested, the results can help estimate capacity.

If 20 servers can handle a specific workload while maintaining acceptable latency, the team can make more informed infrastructure decisions.

Load testing is therefore not only a debugging tool.

It can become part of capacity planning and release engineering.

Teams can also repeat the same performance tests after major infrastructure or database changes to identify regressions before they reach production.

The goal is simple: understand how your API behaves before your users are the ones discovering its limits.
`,
    faq: [
      {
        question: "What is API load testing?",
        answer:
          "API load testing measures how an API behaves under expected or increasing levels of traffic and helps identify performance and infrastructure bottlenecks.",
      },
      {
        question: "What is the difference between load testing and stress testing?",
        answer:
          "Load testing evaluates expected traffic levels, while stress testing intentionally pushes the system beyond normal capacity to understand failure behavior.",
      },
      {
        question: "Why are P95 and P99 important?",
        answer:
          "They expose slower requests that averages can hide, making them useful for understanding real user-facing latency.",
      },
      {
        question: "What should I monitor during load testing?",
        answer:
          "Monitor latency, throughput, error rates, CPU, memory, database queries, connection pools, external dependencies, and infrastructure utilization.",
      },
      {
        question: "Should every API be load tested before launch?",
        answer:
          "Important production APIs should be tested at realistic traffic levels, especially when they handle expensive operations, large datasets, or significant expected traffic.",
      },
    ],
  },

  {
    id: 10,
    slug: "best-serverless-platforms-api",
    title: "Best Serverless Platforms for APIs in 2026",
    excerpt:
      "Compare AWS Lambda, Cloudflare Workers, and Vercel Functions for API hosting, including runtime models, edge execution, scalability, deployment, and real-world use cases.",
    date: "July 25, 2026",
    keywords: [
      "serverless API",
      "AWS Lambda",
      "Cloudflare Workers",
      "Vercel Functions",
      "API hosting",
      "serverless architecture",
    ],
    content: `
## Serverless APIs Changed Backend Deployment

Serverless platforms allow developers to deploy backend functions without managing traditional servers directly.

The platform handles much of the infrastructure, scaling, deployment, and runtime management.

This can dramatically simplify application development, particularly for startups and small engineering teams.

But serverless is not one technology.

AWS Lambda, Cloudflare Workers, and Vercel Functions have different runtime models, deployment environments, networking capabilities, and strengths.

## AWS Lambda

AWS Lambda is one of the most established serverless compute platforms.

Its biggest advantage is the AWS ecosystem around it.

Teams already using S3, DynamoDB, SQS, EventBridge, IAM, RDS, CloudWatch, and other AWS services can build sophisticated event-driven architectures around Lambda.

Lambda is particularly attractive for enterprise applications and systems that require deep AWS integration.

## Cloudflare Workers

Cloudflare Workers take a different approach by running code close to users on Cloudflare's global network.

This can be particularly useful for edge APIs, authentication layers, API gateways, routing, caching, personalization, and globally distributed workloads.

For applications where geographic latency matters, edge execution can be a significant architectural advantage.

## Vercel Functions

Vercel Functions are particularly convenient for teams already deploying frontend applications through Vercel.

They make it straightforward to add server-side API functionality alongside a frontend application.

This developer experience is one of Vercel's biggest strengths.

For startups building a React or Next.js product, keeping frontend and backend deployment within one workflow can significantly reduce operational overhead.

## Cold Starts Are Only One Part of Performance

Cold starts are frequently discussed when comparing serverless platforms.

They matter, but they are not the complete performance story.

Database latency, external API calls, region selection, network distance, caching, payload size, and application logic can have a much larger impact on the final user experience.

A function that starts quickly can still produce a slow API if it waits 700ms for a database query.

## Serverless and Databases

Database connectivity deserves special attention.

Traditional server applications often maintain persistent database connections.

Serverless workloads can create large numbers of short-lived execution environments, which can overwhelm database connection limits if the architecture is not designed correctly.

Connection pooling, serverless-compatible databases, caching, and managed database services can become important parts of the architecture.

## Which Platform Should You Choose?

Choose AWS Lambda when the AWS ecosystem is central to your infrastructure.

Choose Cloudflare Workers when edge execution and global distribution are important.

Choose Vercel Functions when deployment simplicity and full-stack developer experience are priorities.

There is no requirement to use one platform for every service.

The best infrastructure is the infrastructure that matches the application's actual requirements rather than the one that looks most impressive on a benchmark chart.

For an early-stage product, simplicity is often more valuable than adopting a highly distributed architecture before there is a real need for it.
`,
    faq: [
      {
        question: "Which serverless platform is best for APIs?",
        answer:
          "It depends on the workload. Lambda is strong for AWS-based systems, Cloudflare Workers for edge workloads, and Vercel Functions for simple full-stack deployments.",
      },
      {
        question: "Are serverless APIs always faster?",
        answer:
          "No. Database latency, external APIs, networking, application code, caching, and region selection can have a larger impact than the function runtime itself.",
      },
      {
        question: "What are cold starts?",
        answer:
          "A cold start occurs when a serverless platform needs to initialize a new execution environment before processing a request.",
      },
      {
        question: "Can serverless overload a database?",
        answer:
          "Yes. Large numbers of concurrent serverless executions can create many database connections unless the architecture uses appropriate pooling or serverless-compatible database patterns.",
      },
      {
        question: "Can one product use multiple serverless platforms?",
        answer:
          "Yes. Different services can run on different platforms when there is a clear technical reason for doing so.",
      },
    ],
  },

  {
    id: 11,
    slug: "why-apives-verifies-apis",
    title: "Why Apives Verifies APIs Before Listing Them",
    excerpt:
      "API discovery should be more than a directory of links. Learn why verification, clear documentation, pricing, authentication details, and real API information matter to developers.",
    date: "July 22, 2026",
    keywords: [
      "Apives",
      "API directory",
      "verified APIs",
      "API discovery",
      "API marketplace",
      "API verification",
      "find APIs",
    ],
    content: `
## Finding an API Is Easy. Finding the Right API Is Not.

There are thousands of APIs available across the internet.

A developer looking for a weather API, payment API, AI API, geolocation API, search API, email API, financial API, or data API can find dozens of options within minutes.

The difficult part begins after the search.

Is the API actually available?

Is the documentation understandable?

What authentication method does it use?

Does it have a free tier?

What are the request limits?

Does the pricing model make sense?

Are the endpoints actually useful for the intended application?

API discovery should answer these questions before a developer spends hours integrating the wrong service.

## Why a Simple Directory Is Not Enough

A directory containing thousands of links may look impressive, but volume does not automatically create value.

Developers need useful information.

They need to understand what an API does, how they can access it, how much it costs, what limitations exist, and whether it is suitable for their specific project.

That is the problem Apives is designed around.

The goal is not simply to collect API links.

The goal is to make API research faster and more useful.

## Verification Creates Confidence

When developers discover an API, one of the first questions is whether it is actually usable.

An API listing should ideally provide meaningful information about availability, documentation, authentication, pricing, endpoints, and limitations.

Verification helps reduce the chance that developers spend valuable development time on an API that is unavailable, abandoned, incorrectly documented, or difficult to evaluate.

This becomes even more important when developers are comparing several similar APIs and need trustworthy information before choosing one for a production application.

## Authentication Should Be Obvious

Authentication is one of the first implementation details developers need.

An API listing should make it clear whether the service uses an API key, OAuth, JWT, Basic authentication, signed requests, or another mechanism.

If developers have to search through several pages just to understand authentication, the discovery experience is already creating unnecessary friction.

Clear authentication information also helps developers estimate the amount of integration work required before committing to an API.

## Pricing Is Part of API Research

Pricing is often a deciding factor.

Developers want to know whether an API is free, whether there is a free tier, how many requests are included, whether usage is charged by request or another unit, and what happens after the included quota is exhausted.

Clear pricing information makes API comparison significantly easier.

For startups and independent developers, pricing can determine whether an API is suitable for an MVP, while larger teams may care more about predictable usage costs and enterprise limits.

## Documentation Determines Integration Time

Two APIs can provide the same underlying functionality while creating completely different developer experiences.

A well-documented API provides a clear quickstart, authentication instructions, request examples, response examples, error explanations, rate limits, and useful endpoint descriptions.

OpenAPI can also make API documentation machine-readable and easier to integrate into developer tooling.

Good documentation does not just explain the API. It reduces the time between discovering a service and successfully making the first request.

## API Discovery Should End With Building

The ideal API discovery journey is short.

A developer has a requirement.

They search for an API.

They compare suitable options.

They understand pricing and authentication.

They test an endpoint.

They start building.

That is the experience Apives is trying to create.

The future of API discovery should not be about showing developers more links.

It should be about helping them make better API decisions faster.

Find an API.

Understand it.

Evaluate it.

Build with it.

That is the difference between a basic API directory and a developer-focused API discovery platform.
`,
    faq: [
      {
        question: "What is Apives?",
        answer:
          "Apives is an API discovery platform designed to help developers find, understand, compare, and evaluate APIs more efficiently.",
      },
      {
        question: "Why does API verification matter?",
        answer:
          "Verification can help developers avoid wasting time on APIs that are unavailable, poorly documented, incorrectly represented, or difficult to evaluate.",
      },
      {
        question: "What should an API listing include?",
        answer:
          "A useful listing should provide information such as the API's purpose, authentication, pricing, limits, documentation, endpoints, examples, and important integration details.",
      },
      {
        question: "Why is API pricing important during discovery?",
        answer:
          "Pricing affects whether an API is practical for a project. Clear pricing and quota information lets developers compare options before investing in integration work.",
      },
      {
        question: "What is the goal of API discovery?",
        answer:
          "The goal is to reduce the time between having a technical requirement and finding an API that developers can confidently understand, test, and integrate.",
      },
    ],
  },
];

/* =========================================================
   SEO HELPERS
========================================================= */

function setMeta(
  name: string,
  content: string,
  property = false
) {
  const attribute = property ? "property" : "name";

  let element = document.head.querySelector(
    `meta[${attribute}="${name}"]`
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function updateSEO(article?: Article | null) {
  const title = article
    ? `${article.title} | Apives`
    : "Apives Blog — API Guides, Engineering & Developer Insights";

  const description = article
    ? article.excerpt
    : "Practical API guides covering REST APIs, GraphQL, API security, authentication, AI APIs, webhooks, OpenAPI, testing and infrastructure.";

  const keywords = article
    ? article.keywords.join(", ")
    : "API blog, API guides, REST API, GraphQL, API security, AI APIs, OpenAPI, webhooks, API testing";

  document.title = title;

  setMeta("description", description);
  setMeta("keywords", keywords);

  setMeta("og:title", title, true);
  setMeta("og:description", description, true);
  setMeta("og:type", article ? "article" : "website", true);

  setMeta("twitter:card", "summary");
  setMeta("twitter:title", title);
  setMeta("twitter:description", description);

  const canonicalUrl = article
    ? `${window.location.origin}/blog/${article.slug}`
    : `${window.location.origin}/blog`;

  let canonical = document.head.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement | null;

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }

  canonical.href = canonicalUrl;
}

function updateStructuredData(article?: Article | null) {
  document
    .getElementById("apives-blog-schema")
    ?.remove();

  const script = document.createElement("script");

  script.id = "apives-blog-schema";
  script.type = "application/ld+json";

  if (article) {
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.excerpt,
      datePublished: article.date,
      author: {
        "@type": "Person",
        name: "Priince Gupta",
        url: "https://x.com/priiincegupta",
      },
      publisher: {
        "@type": "Organization",
        name: "Apives",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${window.location.origin}/blog/${article.slug}`,
      },
    });
  } else {
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Apives Blog",
      description:
        "Practical guides for building, securing and scaling APIs.",
      url: `${window.location.origin}/blog`,
      publisher: {
        "@type": "Organization",
        name: "Apives",
      },
    });
  }

  document.head.appendChild(script);
}

/* =========================================================
   INLINE MARKDOWN
========================================================= */

function renderInlineText(
  text: string,
  keyPrefix: string
) {
  const parts = text.split(
    /(\[[^\]]+\]\(https?:\/\/[^)]+\))/g
  );

  return parts.map((part, index) => {
    const match = part.match(
      /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/
    );

    if (!match) {
      return (
        <React.Fragment
          key={`${keyPrefix}-${index}`}
        >
          {part}
        </React.Fragment>
      );
    }

    return (
      <a
        key={`${keyPrefix}-${index}`}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="article-link"
      >
        {match[1]}
      </a>
    );
  });
}

/* =========================================================
   CONTENT RENDERER
========================================================= */

function renderContent(text: string) {
  const lines = text.trim().split("\n");

  return lines.map((line, index) => {
    const clean = line.trim();

    if (!clean) {
      return (
        <div
          key={`space-${index}`}
          className="article-space"
        />
      );
    }

    if (clean.startsWith("## ")) {
      return (
        <h2
          key={`heading-${index}`}
          className="article-heading"
        >
          {clean.slice(3)}
        </h2>
      );
    }

    if (
      clean.startsWith("{") ||
      clean.startsWith('"')
    ) {
      return (
        <pre
          key={`code-${index}`}
          className="article-code"
        >
          {clean}
        </pre>
      );
    }

    return (
      <p
        key={`paragraph-${index}`}
        className="article-paragraph"
      >
        {renderInlineText(
          clean,
          `line-${index}`
        )}
      </p>
    );
  });
}

/* =========================================================
   SOCIAL BRAND ICONS
========================================================= */

function FacebookIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5.1 7.2A2.1 2.1 0 1 0 5.1 3a2.1 2.1 0 0 0 0 4.2ZM3.2 9h3.8v11H3.2V9Zm6.1 0h3.6v1.5h.1c.5-.9 1.7-1.9 3.5-1.9 3.8 0 4.5 2.5 4.5 5.7V20h-3.8v-5c0-1.2 0-2.8-1.8-2.8s-2.1 1.3-2.1 2.7V20H9.3V9Z" />
    </svg>
  );
}

function RedditIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21 12.1c0-1.2-1-2.2-2.2-2.2-.6 0-1.1.2-1.5.6-1.4-.9-3.1-1.5-5-1.6l.8-3.5 2.4.5a1.9 1.9 0 1 0 .4-1.4l-3-.6c-.4-.1-.8.2-.9.6l-1 4.4c-1.9.1-3.7.7-5.1 1.6-.4-.4-1-.6-1.5-.6A2.2 2.2 0 0 0 2 12.1c0 .8.4 1.5 1 1.9v.5c0 3.4 4 6.2 9 6.2s9-2.8 9-6.2V14c.6-.4 1-1.1 1-1.9ZM8.2 14.4a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm7.7 2.8c-1 .9-2.3 1.3-3.9 1.3s-2.9-.4-3.9-1.3a.7.7 0 0 1 1-1c.7.6 1.7.9 2.9.9s2.2-.3 2.9-.9a.7.7 0 0 1 1 1Zm0-2.8a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.5 3.5A11.9 11.9 0 0 0 12.05 0C5.48 0 .14 5.34.14 11.91c0 2.1.55 4.15 1.6 5.96L.04 24l6.27-1.65a11.86 11.86 0 0 0 5.74 1.46h.01c6.56 0 11.9-5.34 11.9-11.91 0-3.18-1.23-6.17-3.46-8.4Zm-8.45 18.27h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.72.98.99-3.63-.23-.37a9.88 9.88 0 1 1 8.36 4.61Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

function XBrandIcon() {
  return (
    <span
      style={{
        fontSize: 15,
        fontWeight: 800,
        lineHeight: 1,
      }}
      aria-hidden="true"
    >
      𝕏
    </span>
  );
}

/* =========================================================
   SHARE BUTTON
========================================================= */

function ShareButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="share-button"
    >
      {children}

      <span className="share-tooltip">
        {label}
      </span>
    </button>
  );
}

/* =========================================================
   BLOG RETURN BUTTON
   ALWAYS RETURNS TO /blog
========================================================= */

function BlogReturnButton() {
  const goToBlog = () => {
    /*
      Important:
      This intentionally goes to /blog instead of
      window.history.back(), because history.back()
      could send the user to the landing page.
    */

    window.location.href = "/blog";
  };

  return (
    <button
      type="button"
      className="blog-return-button"
      onClick={goToBlog}
      aria-label="Back to blog"
    >
      <ArrowLeft size={15} />
      <span>Back to blog</span>
    </button>
  );
}

/* =========================================================
   ARTICLE DETAIL
========================================================= */

function ArticleDetail({
  article,
  articles,
  onSelect,
}: {
  article: Article;
  articles: Article[];
  onSelect: (article: Article) => void;
}) {
  const [copied, setCopied] =
    useState(false);

  useEffect(() => {
    updateSEO(article);
    updateStructuredData(article);

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });

    return () => {
      updateSEO(null);
      updateStructuredData(null);
    };
  }, [article]);

  const shareUrl =
    `${window.location.origin}/blog/${article.slug}`;

  const shareTitle =
    encodeURIComponent(article.title);

  const encodedUrl =
    encodeURIComponent(shareUrl);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        shareUrl
      );

      setCopied(true);

      window.setTimeout(
        () => setCopied(false),
        1800
      );
    } catch {
      const input =
        document.createElement("input");

      input.value = shareUrl;

      document.body.appendChild(input);

      input.select();

      document.execCommand("copy");

      input.remove();

      setCopied(true);

      window.setTimeout(
        () => setCopied(false),
        1800
      );
    }
  };

  const nativeShare = async () => {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: shareUrl,
        });

        return;
      } catch {
        return;
      }
    }

    await copyLink();
  };

  const share = (
    platform:
      | "email"
      | "facebook"
      | "reddit"
      | "x"
      | "linkedin"
      | "whatsapp"
  ) => {
    let url = "";

    switch (platform) {
      case "email":
        url =
          `mailto:?subject=${shareTitle}&body=${encodeURIComponent(
            `${article.excerpt}\n\nRead more: ${shareUrl}`
          )}`;
        break;

      case "facebook":
        url =
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;

      case "reddit":
        url =
          `https://www.reddit.com/submit?url=${encodedUrl}&title=${shareTitle}`;
        break;

      case "x":
        url =
          `https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodedUrl}`;
        break;

      case "linkedin":
        url =
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;

      case "whatsapp":
        url =
          `https://wa.me/?text=${encodeURIComponent(
            `${article.title}\n\n${shareUrl}`
          )}`;
        break;
    }

    if (url) {
      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  const related =
    articles
      .filter(
        (item) =>
          item.id !== article.id
      )
      .slice(0, 3);

  return (
    <main className="blog-root">

      {/* =========================================
          RETURN BUTTON
      ========================================= */}

      <div className="blog-back-button">
        <BlogReturnButton />
      </div>

      <article className="article-page">

        {/* =========================================
            ARTICLE HEADER
        ========================================= */}

        <header className="article-header">

          <h1 className="article-title">
            {article.title}
          </h1>

          <p className="article-excerpt">
            {article.excerpt}
          </p>

          <div className="article-meta">

            <span className="article-date">
              {article.date}
            </span>

            <span className="meta-dot">
              •
            </span>

            <span>
              Posted by{" "}
              <a
                href="https://x.com/priiincegupta"
                target="_blank"
                rel="noopener noreferrer"
                className="author-link"
              >
                @priiincegupta
              </a>
            </span>

          </div>

          {/* =====================================
              RESTORED SOCIAL SHARE BUTTONS
          ===================================== */}

          <div className="share-row">

            <ShareButton
              label="Email"
              onClick={() =>
                share("email")
              }
            >
              <Mail size={16} />
            </ShareButton>

            <ShareButton
              label="Facebook"
              onClick={() =>
                share("facebook")
              }
            >
              <FacebookIcon />
            </ShareButton>

            <ShareButton
              label="Reddit"
              onClick={() =>
                share("reddit")
              }
            >
              <RedditIcon />
            </ShareButton>

            <ShareButton
              label="X"
              onClick={() =>
                share("x")
              }
            >
              <XBrandIcon />
            </ShareButton>

            <ShareButton
              label="LinkedIn"
              onClick={() =>
                share("linkedin")
              }
            >
              <LinkedinIcon />
            </ShareButton>

            <ShareButton
              label="WhatsApp"
              onClick={() =>
                share("whatsapp")
              }
            >
              <WhatsappIcon />
            </ShareButton>

            <ShareButton
              label={
                copied
                  ? "Copied"
                  : "Copy link"
              }
              onClick={copyLink}
            >
              {copied ? (
                <Check size={16} />
              ) : (
                <Copy size={15} />
              )}
            </ShareButton>

          </div>

          <div className="article-divider" />

        </header>

        {/* =========================================
            ARTICLE CONTENT
        ========================================= */}

        <div className="article-content">
          {renderContent(
            article.content
          )}
        </div>

        {/* =========================================
            FAQ
        ========================================= */}

        <section className="faq-section">

          <h2>
            Frequently Asked Questions
          </h2>

          <p className="faq-intro">
            Practical answers to common
            questions developers have
            about this topic.
          </p>

          <div className="faq-list">

            {article.faq.map(
              (item, index) => (
                <details
                  key={index}
                  className="faq-item"
                >
                  <summary>

                    <span>
                      {item.question}
                    </span>

                    <ChevronRight
                      size={17}
                    />

                  </summary>

                  <p>
                    {item.answer}
                  </p>

                </details>
              )
            )}

          </div>

        </section>

        {/* =========================================
            RELATED
        ========================================= */}

        <section className="related-section">

          <h2>
            More from Apives
          </h2>

          <div>

            {related.map(
              (relatedArticle) => (
                <button
                  key={
                    relatedArticle.id
                  }
                  type="button"
                  className="related-item"
                  onClick={() => {
                    onSelect(
                      relatedArticle
                    );

                    window.scrollTo({
                      top: 0,
                      behavior: "auto",
                    });
                  }}
                >

                  <div>

                    <span className="related-date">
                      {
                        relatedArticle.date
                      }
                    </span>

                    <h3>
                      {
                        relatedArticle.title
                      }
                    </h3>

                    <p>
                      {
                        relatedArticle.excerpt
                      }
                    </p>

                  </div>

                  <ChevronRight
                    size={18}
                  />

                </button>
              )
            )}

          </div>

        </section>

      </article>

    </main>
  );
}

/* =========================================================
   ARTICLE LIST ITEM
========================================================= */

const ArticleListItem =
  memo(
    function ArticleListItem({
      article,
      onClick,
    }: {
      article: Article;
      onClick: () => void;
    }) {
      return (
        <button
          type="button"
          onClick={onClick}
          className="article-list-item"
        >

          <div className="list-date">
            {article.date}
          </div>

          <h2>
            {article.title}
          </h2>

          <p>
            {article.excerpt}
          </p>

        </button>
      );
    }
  );

/* =========================================================
   MAIN BLOG
========================================================= */

export default function ApivesBlog() {
  const [
    selectedArticle,
    setSelectedArticle,
  ] =
    useState<Article | null>(null);

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  useEffect(() => {
    updateSEO(null);
    updateStructuredData(null);

    return () => {
      document
        .getElementById(
          "apives-blog-schema"
        )
        ?.remove();
    };
  }, []);

  const filteredArticles =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      if (!query) {
        return ARTICLES;
      }

      return ARTICLES.filter(
        (article) =>
          article.title
            .toLowerCase()
            .includes(query) ||
          article.excerpt
            .toLowerCase()
            .includes(query) ||
          article.content
            .toLowerCase()
            .includes(query) ||
          article.keywords.some(
            (keyword) =>
              keyword
                .toLowerCase()
                .includes(query)
          )
      );
    }, [searchQuery]);

  /* =========================================
     ARTICLE DETAIL
  ========================================= */

  if (selectedArticle) {
    return (
      <>
        <BlogStyles />

        <ArticleDetail
          article={selectedArticle}
          articles={ARTICLES}
          onSelect={(article) => {
            setSelectedArticle(
              article
            );

            window.scrollTo({
              top: 0,
              behavior: "auto",
            });
          }}
        />
      </>
    );
  }

  /* =========================================
     BLOG LIST PAGE
  ========================================= */

  return (
    <>
      <BlogStyles />

      <main className="blog-root">

        {/* =====================================
            HERO
        ===================================== */}

        <section className="blog-hero">

          <img
            src={BLOG_IMAGE}
            alt="Apives Blog"
            className="blog-hero-image"
            loading="eager"
          />

          <p>
            Practical ideas for
            building better APIs.
          </p>

        </section>

        {/* =====================================
            SEARCH
        ===================================== */}

        <section className="search-section">

          <div className="search-box">

            <Search
              size={16}
              className="search-icon"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search articles..."
              aria-label="Search articles"
            />

            {searchQuery && (
              <button
                type="button"
                className="clear-search"
                onClick={() =>
                  setSearchQuery("")
                }
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}

          </div>

        </section>

        {/* =====================================
            ARTICLES
        ===================================== */}

        <section className="articles-section">

          <div className="articles-top-line" />

          {filteredArticles.length ? (
            filteredArticles.map(
              (article) => (
                <ArticleListItem
                  key={article.id}
                  article={article}
                  onClick={() => {
                    setSelectedArticle(
                      article
                    );

                    window.scrollTo({
                      top: 0,
                      behavior: "auto",
                    });
                  }}
                />
              )
            )
          ) : (
            <div className="empty-state">

              <p>
                No articles found.
              </p>

              <button
                type="button"
                onClick={() =>
                  setSearchQuery("")
                }
              >
                Clear search
              </button>

            </div>
          )}

        </section>

      </main>
    </>
  );
}

/* =========================================================
   STYLES
========================================================= */

function BlogStyles() {
  return (
    <style>{`

      html {
        scroll-behavior: smooth;
        background: #000;
      }

      body {
        margin: 0;
        background: #000 !important;
        color: #fff;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      ::selection {
        background: rgba(34,197,94,.22);
        color: #fff;
      }

      ::-webkit-scrollbar {
        width: 4px;
      }

      ::-webkit-scrollbar-track {
        background: #000;
      }

      ::-webkit-scrollbar-thumb {
        background: #242424;
        border-radius: 999px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: ${GREEN};
      }

      /* ============================================
         ROOT
      ============================================ */

      .blog-root {
        min-height: 100vh;
        width: 100%;

        background: #000;
        color: #fff;

        font-family:
          Inter,
          ui-sans-serif,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
      }

      /* ============================================
         BACK / RETURN BUTTON
         ALWAYS BLOG
      ============================================ */

      .blog-back-button {
        position: absolute;

        top: 5.65rem;
        left: 1rem;

        z-index: 30;
      }

      .blog-return-button {
        display: inline-flex;

        align-items: center;
        justify-content: center;

        gap: 7px;

        height: 34px;

        padding: 0 11px;

        border:
          1px solid
          rgba(255,255,255,.09);

        border-radius: 9px;

        background:
          rgba(255,255,255,.035);

        color: #777;

        font-family: inherit;

        font-size: 11px;
        font-weight: 550;

        cursor: pointer;

        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);

        box-shadow:
          inset 0 1px 0
          rgba(255,255,255,.045);

        transition:
          color .18s ease,
          background .18s ease,
          border-color .18s ease,
          transform .18s ease;
      }

      .blog-return-button svg {
        color: ${GREEN};

        flex-shrink: 0;

        transition:
          transform .18s ease;
      }

      .blog-return-button:hover {
        color: #fff;

        background:
          rgba(255,255,255,.065);

        border-color:
          rgba(34,197,94,.28);

        transform:
          translateX(-2px);
      }

      .blog-return-button:hover svg {
        transform:
          translateX(-2px);
      }

      @media (min-width: 1024px) {
        .blog-back-button {
          left: 2rem;
        }
      }

      /* ============================================
         BLOG HERO
      ============================================ */

      .blog-hero {
        max-width: 900px;

        margin: 0 auto;

        padding:
          105px 24px
          55px;

        text-align: center;
      }

      .blog-hero-image {
        display: block;

        width: 210px;
        height: auto;

        margin: 0 auto;

        object-fit: contain;

        border-radius: 12px;
      }

      .blog-hero p {
        max-width: 620px;

        margin:
          24px auto 0;

        color: #737373;

        font-size:
          clamp(17px, 2.2vw, 21px);

        line-height: 1.65;

        letter-spacing: -.15px;
      }

      /* ============================================
         SEARCH
      ============================================ */

      .search-section {
        max-width: 900px;

        margin: 0 auto;

        padding:
          0 24px
          34px;
      }

      .search-box {
        position: relative;

        max-width: 440px;

        height: 48px;

        margin: 0 auto;
      }

      .search-box input {
        width: 100%;
        height: 100%;

        padding:
          0 44px
          0 42px;

        border:
          1px solid
          rgba(255,255,255,.10);

        border-radius: 999px;

        outline: none;

        background:
          rgba(255,255,255,.025);

        color: #e5e7eb;

        font: inherit;

        font-size: 14px;

        transition:
          border-color .18s ease,
          background .18s ease,
          box-shadow .18s ease;
      }

      .search-box input::placeholder {
        color: #505050;
      }

      .search-box input:focus {
        border-color:
          rgba(34,197,94,.42);

        background:
          rgba(255,255,255,.035);

        box-shadow:
          0 0 0 3px
          rgba(34,197,94,.045);
      }

      .search-icon {
        position: absolute;

        z-index: 2;

        left: 16px;
        top: 50%;

        transform:
          translateY(-50%);

        color: #5c5c5c;

        pointer-events: none;
      }

      .clear-search {
        position: absolute;

        right: 9px;
        top: 50%;

        transform:
          translateY(-50%);

        width: 29px;
        height: 29px;

        display: flex;

        align-items: center;
        justify-content: center;

        border: 0;

        border-radius: 50%;

        background: transparent;

        color: #555;

        cursor: pointer;
      }

      .clear-search:hover {
        color: #fff;

        background:
          rgba(255,255,255,.07);
      }

      /* ============================================
         ARTICLE LIST
      ============================================ */

      .articles-section {
        max-width: 900px;

        margin: 0 auto;

        padding:
          0 24px
          110px;
      }

      .articles-top-line {
        height: 1px;

        background:
          rgba(255,255,255,.085);
      }

      .article-list-item {
        width: 100%;

        display: block;

        padding:
          36px 0
          39px;

        text-align: left;

        border: 0;

        border-bottom:
          1px solid
          rgba(255,255,255,.085);

        background: transparent;

        color: inherit;

        cursor: pointer;

        font: inherit;

        outline: none;
      }

      .list-date {
        margin-bottom: 13px;

        color: ${GREEN};

        font-size: 11px;

        font-weight: 650;

        letter-spacing: .015em;
      }

      .article-list-item h2 {
        max-width: 850px;

        margin:
          0 0
          11px;

        color: #f5f5f5;

        font-size:
          clamp(23px, 3vw, 32px);

        line-height: 1.25;

        letter-spacing:
          -.85px;

        font-weight: 670;

        transition:
          color .18s ease;
      }

      .article-list-item:hover h2 {
        color: #fff;
      }

      .article-list-item p {
        max-width: 820px;

        margin: 0;

        color: #626262;

        font-size:
          clamp(14px, 1.7vw, 16px);

        line-height: 1.8;
      }

      .empty-state {
        padding: 90px 0;

        text-align: center;

        color: #555;
      }

      .empty-state button {
        margin-top: 12px;

        padding: 0;

        border: 0;

        background: transparent;

        color: ${GREEN};

        font: inherit;

        font-size: 12px;

        cursor: pointer;
      }

      /* ============================================
         ARTICLE PAGE
         REDUCED TOP GAP
      ============================================ */

      .article-page {
        width: 100%;

        max-width: 820px;

        margin: 0 auto;

        /*
          Reduced from 110px.
          This brings the title closer to
          the return button/header area.
        */
        padding:
          88px 24px
          105px;
      }

      /* ============================================
         ARTICLE HEADER
      ============================================ */

      .article-header {
        text-align: center;

        padding-bottom: 35px;
      }

      .article-title {
        max-width: 820px;

        margin: 0 auto;

        color: #fff;

        font-size:
          clamp(38px, 6.4vw, 63px);

        line-height: 1.05;

        letter-spacing:
          -3px;

        font-weight: 800;
      }

      .article-excerpt {
        max-width: 720px;

        margin:
          22px auto 0;

        color: #696969;

        font-size:
          clamp(16px, 2vw, 19px);

        line-height: 1.78;
      }

      .article-meta {
        display: flex;

        flex-wrap: wrap;

        align-items: center;

        justify-content: center;

        gap: 8px;

        margin-top: 19px;

        color: #555;

        font-size: 11px;
      }

      .article-date {
        color: ${GREEN};

        font-weight: 650;
      }

      .meta-dot {
        color: #333;
      }

      .author-link {
        color: ${GREEN};

        font-weight: 650;

        text-decoration: none;

        border-bottom:
          1px solid
          rgba(34,197,94,.22);
      }

      .author-link:hover {
        color: ${GREEN_SOFT};

        border-color:
          rgba(34,197,94,.65);
      }

      /* ============================================
         SHARE BUTTONS
         RESTORED
         CIRCULAR GLASS BACKGROUND
      ============================================ */

      .share-row {
        display: flex;

        align-items: center;

        justify-content: center;

        gap: 7px;

        margin-top: 22px;
      }

      .share-button {
        position: relative;

        width: 39px;
        height: 39px;

        display: flex;

        align-items: center;
        justify-content: center;

        border:
          1px solid
          rgba(255,255,255,.09);

        border-radius: 50%;

        background:
          rgba(255,255,255,.035);

        backdrop-filter:
          blur(16px);

        -webkit-backdrop-filter:
          blur(16px);

        color: ${GREEN};

        cursor: pointer;

        box-shadow:
          inset
          0 1px 0
          rgba(255,255,255,.055);

        transition:
          transform .18s ease,
          background .18s ease,
          border-color .18s ease,
          color .18s ease;
      }

      .share-button svg {
        width: 16px;
        height: 16px;

        color: ${GREEN};
      }

      .share-button:hover {
        background:
          rgba(255,255,255,.065);

        border-color:
          rgba(34,197,94,.28);

        color: ${GREEN_SOFT};

        transform:
          translateY(-2px);
      }

      .share-button:hover svg {
        color: ${GREEN_SOFT};
      }

      .share-button:active {
        transform:
          scale(.91);
      }

      .share-tooltip {
        position: absolute;

        left: 50%;
        top: calc(100% + 9px);

        transform:
          translateX(-50%)
          translateY(-3px);

        padding:
          5px 8px;

        border:
          1px solid
          rgba(255,255,255,.08);

        border-radius: 6px;

        background: #050505;

        color: #858585;

        font-size: 9px;

        white-space: nowrap;

        opacity: 0;

        pointer-events: none;

        transition:
          opacity .15s ease,
          transform .15s ease;

        z-index: 20;
      }

      .share-button:hover
      .share-tooltip {
        opacity: 1;

        transform:
          translateX(-50%)
          translateY(0);
      }

      /* ============================================
         DIVIDER
      ============================================ */

      .article-divider {
        width: 100%;

        height: 1px;

        margin-top: 30px;

        background:
          rgba(255,255,255,.10);
      }

      /* ============================================
         CONTENT
      ============================================ */

      .article-content {
        width: 100%;
      }

      .article-heading {
        margin:
          50px 0
          20px;

        color: #f5f5f5;

        font-size:
          clamp(24px, 3.2vw, 31px);

        line-height: 1.25;

        letter-spacing:
          -.8px;

        font-weight: 730;
      }

      .article-paragraph {
        max-width: 780px;

        margin:
          0 0
          27px;

        color: #858585;

        font-size:
          clamp(16px, 1.75vw, 17px);

        line-height: 2;

        font-weight: 400;

        letter-spacing:
          -.05px;
      }

      .article-link {
        color: ${GREEN};

        text-decoration: underline;

        text-decoration-color:
          rgba(34,197,94,.30);

        text-underline-offset: 4px;

        transition:
          color .15s ease,
          text-decoration-color .15s ease;
      }

      .article-link:hover {
        color: ${GREEN_SOFT};

        text-decoration-color:
          rgba(34,197,94,.8);
      }

      .article-space {
        height: 2px;
      }

      .article-code {
        overflow-x: auto;

        margin:
          25px 0;

        padding: 18px;

        border:
          1px solid
          rgba(255,255,255,.07);

        border-radius: 12px;

        background:
          rgba(255,255,255,.025);

        color: #929292;

        font-family:
          ui-monospace,
          SFMono-Regular,
          Menlo,
          Monaco,
          Consolas,
          monospace;

        font-size: 12px;

        line-height: 1.7;
      }

      /* ============================================
         FAQ
      ============================================ */

      .faq-section {
        margin-top: 75px;

        padding-top: 45px;

        border-top:
          1px solid
          rgba(255,255,255,.085);
      }

      .faq-section h2,
      .related-section h2 {
        margin: 0;

        color: #f5f5f5;

        font-size:
          clamp(25px, 3.2vw, 31px);

        line-height: 1.25;

        letter-spacing:
          -.8px;

        font-weight: 730;
      }

      .faq-intro {
        margin:
          11px 0 25px;

        color: #555;

        font-size: 13px;

        line-height: 1.75;
      }

      .faq-list {
        border-top:
          1px solid
          rgba(255,255,255,.07);
      }

      .faq-item {
        border-bottom:
          1px solid
          rgba(255,255,255,.07);
      }

      .faq-item summary {
        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 20px;

        padding:
          22px 0;

        list-style: none;

        color: #c9c9c9;

        font-size:
          clamp(14px, 2vw, 16px);

        line-height: 1.5;

        font-weight: 620;

        cursor: pointer;
      }

      .faq-item summary::-webkit-details-marker {
        display: none;
      }

      .faq-item summary svg {
        flex-shrink: 0;

        color: #444;

        transition:
          transform .2s ease,
          color .2s ease;
      }

      .faq-item[open]
      summary svg {
        transform:
          rotate(90deg);

        color: ${GREEN};
      }

      .faq-item[open]
      summary {
        color: #fff;
      }

      .faq-item p {
        max-width: 740px;

        margin:
          -1px 0
          23px;

        color: #6b6b6b;

        font-size: 14px;

        line-height: 1.85;
      }

      /* ============================================
         RELATED
      ============================================ */

      .related-section {
        margin-top: 75px;

        padding-top: 45px;

        border-top:
          1px solid
          rgba(255,255,255,.085);
      }

      .related-section h2 {
        margin-bottom: 17px;
      }

      .related-item {
        width: 100%;

        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 25px;

        padding:
          23px 0;

        border: 0;

        border-bottom:
          1px solid
          rgba(255,255,255,.07);

        background: transparent;

        color: inherit;

        text-align: left;

        cursor: pointer;

        font: inherit;
      }

      .related-item > div {
        min-width: 0;
      }

      .related-date {
        display: block;

        margin-bottom: 7px;

        color: ${GREEN};

        font-size: 10px;

        font-weight: 650;
      }

      .related-item h3 {
        margin: 0;

        color: #c7c7c7;

        font-size:
          clamp(15px, 2vw, 19px);

        line-height: 1.4;

        letter-spacing: -.25px;

        font-weight: 620;

        transition:
          color .15s ease;
      }

      .related-item:hover h3 {
        color: #fff;
      }

      .related-item p {
        margin:
          8px 0 0;

        color: #555;

        font-size: 12px;

        line-height: 1.65;

        display: -webkit-box;

        -webkit-line-clamp: 2;

        -webkit-box-orient: vertical;

        overflow: hidden;
      }

      .related-item > svg {
        flex-shrink: 0;

        color: #333;

        transition:
          color .15s ease,
          transform .15s ease;
      }

      .related-item:hover > svg {
        color: ${GREEN};

        transform:
          translateX(3px);
      }

      /* ============================================
         MOBILE
      ============================================ */

      @media (max-width: 640px) {

        .blog-back-button {
          top: 5.55rem;
          left: 1rem;
        }

        .blog-return-button {
          height: 32px;

          padding:
            0 10px;

          gap: 6px;

          font-size: 10.5px;
        }

        .blog-hero {
          padding:
            78px 20px
            43px;
        }

        .blog-hero-image {
          width: 185px;
        }

        .blog-hero p {
          margin-top: 20px;

          font-size: 16px;
        }

        .search-section {
          padding:
            0 20px
            28px;
        }

        .articles-section {
          padding:
            0 20px
            80px;
        }

        .article-list-item {
          padding:
            29px 0
            32px;
        }

        .article-list-item h2 {
          font-size: 23px;

          letter-spacing:
            -.55px;
        }

        .article-list-item p {
          font-size: 14px;

          line-height: 1.75;
        }

        /* ======================================
           DETAIL PAGE
        ====================================== */

        .article-page {
          /*
            Reduced from 105px so
            return button and title
            feel closer together.
          */
          padding:
            91px 20px
            80px;
        }

        .article-title {
          font-size:
            clamp(33px, 10vw, 45px);

          letter-spacing:
            -2px;
        }

        .article-excerpt {
          margin-top: 19px;

          font-size: 15px;

          line-height: 1.75;
        }

        .article-meta {
          margin-top: 17px;
        }

        .share-row {
          gap: 6px;

          margin-top: 20px;
        }

        .share-button {
          width: 38px;
          height: 38px;
        }

        .article-divider {
          margin-top: 26px;
        }

        .article-paragraph {
          font-size: 15.5px;

          line-height: 1.9;

          margin-bottom: 24px;
        }

        .article-heading {
          margin-top: 43px;

          margin-bottom: 18px;
        }

        .faq-section,
        .related-section {
          margin-top: 62px;

          padding-top: 35px;
        }

      }

    `}</style>
  );
}