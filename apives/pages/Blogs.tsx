import React, {
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  X,
  Share2,
  Check,
  ChevronRight,
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
   IMPORTANT
   KEEP YOUR EXISTING ARTICLES ARRAY HERE
   The 11 articles you already have can remain unchanged.
========================================================= */

const ARTICLES: Article[] = [
  {
    id: 1,
    slug: "rest-vs-graphql-vs-grpc",
    title: "REST vs GraphQL vs gRPC: Which API Should You Use?",
    excerpt:
      "REST, GraphQL, and gRPC solve different API problems. Learn when to use each one, how they compare, and which API architecture makes sense for your product.",
    date: "August 14, 2026",
    keywords: [
      "REST API",
      "REST vs GraphQL",
      "GraphQL vs gRPC",
      "gRPC",
      "API architecture",
      "API design",
    ],
    content: `
## REST Is Still the Best Starting Point

REST is still the default choice for most public APIs.

It works directly with standard HTTP methods such as GET, POST, PUT, PATCH, and DELETE. Developers understand the model quickly, almost every programming language supports it, and API gateways, monitoring tools, testing tools, and documentation platforms already work well with REST.

If you are building a SaaS product, mobile backend, public developer API, ecommerce backend, or a normal CRUD application, REST is usually the safest starting point.

A good REST API also benefits from the existing HTTP ecosystem. HTTP caching, status codes, headers, authentication middleware, proxies, and observability tools all fit naturally into the model.

For the official HTTP semantics, the [HTTP Semantics specification](https://www.rfc-editor.org/rfc/rfc9110) is a useful reference.

## When GraphQL Is Better

GraphQL solves a different problem.

Instead of exposing many fixed endpoints, GraphQL normally gives clients a schema and lets them request the exact data they need.

Imagine a product page that needs:

User information.

Product information.

Reviews.

Recommendations.

Related products.

With a traditional REST API, the frontend may need several requests. A GraphQL query can combine these requirements into one request.

This can be useful for complex dashboards, mobile applications, and products where frontend requirements change frequently.

The official [GraphQL specification](https://spec.graphql.org/) is the best place to understand the core model.

GraphQL is not automatically faster than REST, though. Poor resolver design can create database problems, especially the famous N+1 query problem.

## Where gRPC Fits

gRPC is mainly designed for service-to-service communication.

It uses Protocol Buffers and HTTP/2 and provides strongly typed service contracts, streaming, and efficient binary serialization.

That makes it useful for microservices, internal platforms, high-throughput systems, and applications where latency matters.

The [official gRPC documentation](https://grpc.io/docs/) explains the protocol and supported languages.

For a public API consumed by thousands of unrelated developers, REST is usually easier because developers can call it with simple HTTP clients.

## REST vs GraphQL vs gRPC

The choice does not have to be permanent.

A large system can use REST for its public API, GraphQL for a complex frontend, and gRPC between internal services.

A practical approach is:

REST for public APIs.

GraphQL for flexible client-facing data requirements.

gRPC for internal service communication.

The mistake is choosing a technology because it is popular rather than because it solves a real problem.

## What Should Startups Choose?

For most early-stage startups, REST is the easiest starting point.

It is simple to build, simple to document, simple to test, and easy for future developers to understand.

You can introduce GraphQL or gRPC later when there is a clear reason.

Good API architecture is not about using the most advanced technology.

It is about making the API reliable, understandable, and easy for developers to use.
`,
    faq: [
      {
        question: "Is REST better than GraphQL?",
        answer:
          "Neither is universally better. REST is simpler and works very well for most public APIs. GraphQL is useful when clients need flexible access to complex and connected data.",
      },
      {
        question: "When should I use gRPC?",
        answer:
          "gRPC is a strong choice for internal microservices, high-performance communication, streaming, and systems that benefit from strongly typed service contracts.",
      },
      {
        question: "Should a startup use REST or GraphQL?",
        answer:
          "REST is usually the easier starting point. GraphQL becomes more attractive when the frontend has complex data requirements or many related resources.",
      },
    ],
  },

  {
    id: 2,
    slug: "best-llm-apis-2026",
    title: "Best LLM APIs in 2026: OpenAI vs Anthropic vs Gemini",
    excerpt:
      "A practical guide to modern LLM APIs, including model selection, cost, latency, context windows, streaming, reliability, and multi-model AI architecture.",
    date: "August 12, 2026",
    keywords: [
      "LLM APIs",
      "AI APIs",
      "OpenAI API",
      "Anthropic API",
      "Gemini API",
      "best AI API 2026",
    ],
    content: `
## LLM APIs Are Now Application Infrastructure

AI APIs have moved far beyond simple chatbot experiments.

Developers now use language models for search, customer support, coding assistants, document processing, data extraction, automation, agents, content generation, and software development.

The difficult part is no longer finding an AI model.

The difficult part is choosing the right model, controlling cost, handling failures, and designing an application that does not depend on one provider for everything.

## OpenAI

OpenAI APIs are a strong general-purpose choice for many applications.

The platform has a large developer ecosystem and mature tooling around structured outputs, function calling, streaming, agents, and other AI workflows.

OpenAI is often a good fit when your application needs a broadly capable model and you want a large ecosystem around it.

Developers can explore the current platform through the [OpenAI API documentation](https://platform.openai.com/docs/).

## Anthropic

Anthropic is particularly interesting for long-context workloads, coding, reasoning, and applications where following detailed instructions is important.

Claude models are widely used for document processing, coding workflows, research tasks, and agent-style applications.

The [Anthropic API documentation](https://docs.anthropic.com/) is the best place to check current capabilities and implementation details.

## Google Gemini

Gemini is especially useful for multimodal applications.

Depending on the model, applications can work with text, images, audio, video, and code.

That makes Gemini interesting for applications that need to understand more than text.

The [Gemini API documentation](https://ai.google.dev/gemini-api/docs) provides current information about models and APIs.

## Do Not Build Everything Around One Model

A strong production AI architecture can use multiple models.

For example:

Simple classification → smaller and cheaper model.

Normal conversations → fast general-purpose model.

Complex reasoning → stronger model.

Large document analysis → long-context model.

Multimodal processing → vision or multimodal model.

This approach can reduce cost and improve reliability.

## Streaming Makes AI Feel Faster

A user waiting three seconds for a complete answer feels very different from a user seeing the response start after a few hundred milliseconds.

Streaming allows the application to display tokens as they arrive.

For chat applications and AI assistants, streaming should normally be considered part of the user experience rather than an optional feature.

## AI API Reliability

AI providers can experience rate limits, temporary failures, latency spikes, and service interruptions.

Production applications should therefore consider:

Retries with backoff.

Request timeouts.

Provider fallbacks.

Usage limits.

Logging.

Token monitoring.

Cost alerts.

A good AI application is not simply connected to an LLM.

It is designed around the fact that external APIs can fail.

## The Practical Answer

There is no single best LLM API.

Choose based on your workload.

Start with one provider if your product is small.

As usage grows, introduce model routing and fallbacks where they provide a real benefit.
`,
    faq: [
      {
        question: "Which LLM API is best in 2026?",
        answer:
          "There is no universal winner. OpenAI, Anthropic, and Gemini each have different strengths, so the best choice depends on your workload, latency, cost, context, and multimodal requirements.",
      },
      {
        question: "Should I use multiple AI APIs?",
        answer:
          "For production systems, multiple providers can improve reliability and cost control, but a small product can start with one provider and add routing later.",
      },
      {
        question: "Why is streaming important for AI apps?",
        answer:
          "Streaming lets users see the response as it is generated, which reduces perceived waiting time and makes conversational interfaces feel much faster.",
      },
    ],
  },

  {
    id: 3,
    slug: "api-security-best-practices",
    title: "API Security Best Practices: 10 Common API Security Risks",
    excerpt:
      "Learn the most common API security problems, from broken authorization and weak authentication to rate-limit abuse and unsafe input handling.",
    date: "August 10, 2026",
    keywords: [
      "API security",
      "API security best practices",
      "OWASP API Security",
      "API vulnerabilities",
      "secure REST API",
    ],
    content: `
## Why API Security Matters

APIs often sit directly between users and sensitive application data.

A single authorization mistake can expose customer records. A weak authentication system can allow account takeover. A missing rate limit can make an expensive endpoint easy to abuse.

API security therefore needs to be part of API design from the beginning.

The [OWASP API Security project](https://owasp.org/API-Security/) is one of the most useful references for developers working on API security.

## Broken Object Level Authorization

One of the most common API security problems is failing to verify whether a user is allowed to access a specific object.

For example:

/api/orders/1001

is changed to:

/api/orders/1002

Being authenticated does not mean the user owns order 1002.

The server must check ownership or permissions before returning the object.

## Authentication

Use modern authentication patterns and avoid putting secrets into frontend JavaScript.

API keys should never be treated as passwords for users.

For browser and mobile applications, OAuth 2.0 with PKCE is often a better approach.

The [OAuth 2.0 RFC](https://www.rfc-editor.org/rfc/rfc6749) and [OAuth security best practices](https://www.rfc-editor.org/rfc/rfc9700) are useful references.

## Rate Limiting

Public endpoints should have reasonable limits.

Without rate limiting, attackers can abuse login endpoints, expensive searches, AI features, and other resource-heavy operations.

Return HTTP 429 when a client exceeds the allowed request rate.

## Validate Input

Never trust incoming JSON.

Validate request bodies, query parameters, headers, file uploads, IDs, and user-generated strings.

Use allowlists for fields where possible.

## Avoid Excessive Data Exposure

Do not return an entire database record when the client only needs three fields.

API responses should expose only the information the caller actually needs.

This reduces both accidental data leaks and the impact of compromised accounts.

## Handle Errors Safely

Production APIs should not return database stack traces or internal file paths to users.

Return useful errors without exposing internal implementation details.

## Use HTTPS

Sensitive API traffic should use HTTPS.

Never send authentication credentials over plain HTTP.

TLS protects data while it moves between the client and server.

## Secure File Uploads

File uploads need validation.

Check file size, content type, filename handling, storage permissions, and malware scanning requirements where appropriate.

Never assume a file extension tells you what a file really contains.

## Protect Secrets

Do not put production secrets in GitHub.

Use environment variables and dedicated secret management systems.

Rotate credentials when they are exposed.

## Monitor API Activity

Security problems are much harder to investigate when there are no logs.

Monitor authentication failures, unusual traffic, permission failures, rate-limit events, and suspicious patterns.

Security is not one middleware package.

It is a collection of controls working together.
`,
    faq: [
      {
        question: "What is the most common API security problem?",
        answer:
          "Broken authorization, especially failing to verify access to individual objects, is one of the most important API security risks.",
      },
      {
        question: "Should APIs have rate limits?",
        answer:
          "Yes. Public and resource-heavy endpoints should normally have rate limits to reduce abuse and protect infrastructure.",
      },
      {
        question: "Should API keys be stored in frontend code?",
        answer:
          "No. Secrets included in frontend code can be extracted by users. Sensitive API credentials should stay on trusted backend infrastructure.",
      },
    ],
  },

  {
    id: 4,
    slug: "how-to-build-production-ready-api",
    title: "How to Build a Production-Ready API: 7 Essential Steps",
    excerpt:
      "A practical API development process covering API design, authentication, validation, error handling, performance testing, documentation, and monitoring.",
    date: "August 8, 2026",
    keywords: [
      "build API",
      "production API",
      "API development",
      "REST API development",
      "API best practices",
    ],
    content: `
## Start With the API Consumer

Before writing endpoints, understand who will use the API.

A public API has different requirements from an internal service.

Think about authentication, documentation, versioning, rate limits, error messages, and backwards compatibility before implementation starts.

## Design the API Contract

Define endpoints and data structures before writing every backend function.

An OpenAPI document can describe the contract and give frontend and backend teams a shared reference.

The [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) is a good starting point.

Consistency matters more than cleverness.

## Add Authentication Early

Authentication should not be added as an afterthought.

Decide how users and services authenticate before building sensitive business logic.

Common options include API keys, OAuth, JWT-based systems, sessions, and machine-to-machine credentials.

Authentication answers who you are.

Authorization answers what you are allowed to do.

Both are important.

## Validate Everything Important

API input comes from outside your trusted application.

Validate required fields, types, string lengths, numbers, IDs, allowed values, file sizes, and nested objects.

Good validation creates a clean boundary between untrusted input and business logic.

## Design Consistent Errors

A developer should not need to guess what a 400 response means.

Use consistent status codes and predictable JSON structures.

For example:

{
  "error": {
    "code": "INVALID_EMAIL",
    "message": "The email address is invalid."
  }
}

Clear errors make APIs much easier to integrate.

## Test Before Production

Unit tests are useful, but they are not enough.

Test complete API flows.

Test authentication.

Test invalid input.

Test permissions.

Test database failures.

Test rate limits.

Test realistic traffic.

Load testing tools such as [k6](https://k6.io/) can help identify performance problems before launch.

## Monitor Everything That Matters

A production API needs observability.

Track request count, errors, latency, database performance, external API failures, and uptime.

P95 and P99 latency are particularly useful because averages can hide slow requests.

## Documentation Is Part of the Product

A technically good API can still fail if developers cannot understand it.

Provide authentication instructions, endpoint examples, response examples, errors, limits, and a quickstart.

Good API development is not only about code.

It is about creating an API that other developers can confidently build on.
`,
    faq: [
      {
        question: "What makes an API production-ready?",
        answer:
          "A production-ready API has clear contracts, authentication, authorization, validation, consistent errors, testing, monitoring, documentation, and a plan for handling failures.",
      },
      {
        question: "Should I write OpenAPI before coding?",
        answer:
          "Spec-first development can be very useful because it lets teams agree on the API contract before implementation becomes difficult to change.",
      },
      {
        question: "How should API performance be measured?",
        answer:
          "Track latency percentiles such as P50, P95, and P99, along with error rate, throughput, database performance, and resource usage.",
      },
    ],
  },

  {
    id: 5,
    slug: "openapi-specification-guide",
    title: "OpenAPI Specification: Why Your API Needs It",
    excerpt:
      "OpenAPI is more than API documentation. Learn how one specification can power SDKs, mock servers, tests, types, and better developer documentation.",
    date: "August 6, 2026",
    keywords: [
      "OpenAPI",
      "OpenAPI specification",
      "Swagger",
      "API documentation",
      "API SDK generation",
    ],
    content: `
## What Is OpenAPI?

OpenAPI is a standard format for describing HTTP APIs.

It can define endpoints, parameters, request bodies, responses, schemas, authentication methods, and examples.

That makes an API machine-readable.

The official [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) is maintained as an open standard.

## OpenAPI Is More Than Documentation

Many teams think of OpenAPI as a documentation file.

It can do much more.

A good specification can become the source for API documentation, client SDKs, mock servers, type generation, contract tests, validation, and developer tooling.

That makes the specification useful throughout the API lifecycle.

## Generate SDKs

If you maintain an API used by developers in multiple programming languages, SDK generation can save significant time.

Instead of manually maintaining clients for JavaScript, Python, Go, Java, and other languages, tooling can generate much of the client structure from the API contract.

## Build Mock APIs

Frontend teams often need an API before backend implementation is finished.

A mock server can return example responses based on the OpenAPI document.

This allows frontend and backend work to happen in parallel.

## Generate Types

TypeScript applications can generate request and response types from an OpenAPI document.

That reduces the chance of frontend and backend types slowly becoming different.

## Spec-First Development

One powerful approach is spec-first API development.

Write the contract.

Review the contract.

Generate documentation and mocks.

Then implement the backend.

This moves important API decisions earlier in the process, when changes are cheaper.

## Documentation Still Needs Human Writing

An OpenAPI file can describe an endpoint.

It cannot always explain why a developer should use it.

Good documentation should still include practical examples, authentication instructions, common errors, limits, and real workflows.

## Keep the Specification Accurate

The biggest OpenAPI problem is a stale specification.

If the documentation says one thing and the API returns something else, developers lose trust.

Treat the API contract as a real engineering artifact.

OpenAPI works best when it stays close to the actual API.
`,
    faq: [
      {
        question: "Is OpenAPI the same as Swagger?",
        answer:
          "OpenAPI is the specification standard. Swagger is a collection of tools and products that work with OpenAPI documents.",
      },
      {
        question: "Can OpenAPI generate SDKs?",
        answer:
          "Yes. Many tools can use OpenAPI documents to generate client libraries, types, documentation, and other developer resources.",
      },
      {
        question: "Should every public API have OpenAPI documentation?",
        answer:
          "For most public APIs, a machine-readable OpenAPI specification is extremely useful because it improves documentation, tooling, and integration workflows.",
      },
    ],
  },

  {
    id: 6,
    slug: "webhook-best-practices",
    title: "Webhook Best Practices: How to Build Reliable Webhooks",
    excerpt:
      "Learn how to build reliable webhooks with signature verification, retries, idempotency, queues, fast responses, and useful delivery logs.",
    date: "August 4, 2026",
    keywords: [
      "webhooks",
      "webhook best practices",
      "webhook security",
      "webhook retries",
      "webhook idempotency",
    ],
    content: `
## What Is a Webhook?

A webhook allows one application to notify another application when an event happens.

For example:

A payment succeeds.

A customer creates an account.

An order is shipped.

A subscription changes.

A webhook usually sends an HTTP request to a URL controlled by the receiving application.

The idea is simple.

Reliable delivery is not.

## Respond Quickly

One of the most important webhook rules is to avoid doing long work inside the webhook request.

A better flow is:

Receive event.

Verify the signature.

Store the event.

Queue the work.

Return a successful response.

Process the event asynchronously.

This reduces timeouts and makes retries easier to manage.

## Verify Webhook Signatures

If a provider gives you a webhook signature, verify it before processing the event.

For example, [Stripe's webhook documentation](https://docs.stripe.com/webhooks) explains signature verification and webhook handling patterns.

Do not trust the request simply because it came to your endpoint.

## Expect Duplicate Events

Webhook delivery is not always exactly once.

A provider may retry an event after a timeout even if your application actually processed it.

Use an event ID as an idempotency key.

Store processed event IDs and safely ignore duplicates.

## Handle Retries

Temporary failures happen.

Your application can return a failure response and allow the provider to retry, or you can build your own delivery system with exponential backoff.

Avoid retrying continuously without limits.

## Handle Out-of-Order Events

Events may arrive in an unexpected order.

For example:

order.updated

may arrive before:

order.created

Your application should not blindly assume events always arrive sequentially.

Use event timestamps, versions, or state validation where appropriate.

## Build Delivery Logs

Developers integrating your webhook system need visibility.

Useful information includes event ID, delivery attempt, timestamp, HTTP status, response body, duration, next retry, and final status.

Good webhook logs can turn a difficult debugging problem into a five-minute fix.

## Webhooks Need Good Developer Experience

The webhook system is part of your API product.

Give developers a way to test events, resend failed events, inspect payloads, and understand errors.

Reliable webhooks are mostly about designing for failure before failure happens.
`,
    faq: [
      {
        question: "Should webhook processing be asynchronous?",
        answer:
          "For most non-trivial workloads, yes. Verify the event, store or queue it, respond quickly, and perform expensive processing asynchronously.",
      },
      {
        question: "Can webhook events arrive twice?",
        answer:
          "Yes. Providers can retry events, so webhook consumers should be designed to handle duplicate deliveries safely.",
      },
      {
        question: "Why should webhook signatures be verified?",
        answer:
          "Signature verification helps confirm that the event was sent by the expected provider and has not been modified in transit.",
      },
    ],
  },

  {
    id: 7,
    slug: "oauth-2-pkce-client-credentials",
    title: "OAuth 2.0 Explained: PKCE vs Client Credentials",
    excerpt:
      "Understand the OAuth 2.0 flows developers actually use, including Authorization Code with PKCE, Client Credentials, token refresh, and common mistakes.",
    date: "August 2, 2026",
    keywords: [
      "OAuth 2.0",
      "OAuth PKCE",
      "Client Credentials",
      "OAuth authentication",
      "API authentication",
    ],
    content: `
## What OAuth 2.0 Actually Solves

OAuth 2.0 is mainly about delegated access.

Instead of giving an application a user's password, the application receives limited authorization to access resources.

OAuth is an authorization framework, not simply a login button.

The official [OAuth 2.0 specification](https://www.rfc-editor.org/rfc/rfc6749) explains the protocol.

## Authorization Code With PKCE

Authorization Code with PKCE is commonly used for public clients such as mobile apps and browser applications.

The application creates a code verifier and sends a related challenge during authorization.

Later, the authorization server checks the verifier before issuing tokens.

This helps protect authorization codes from interception.

The [OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700) is an important modern reference.

## Client Credentials

Client Credentials is designed for machine-to-machine communication.

There is no user involved.

Imagine your backend needs to call a payment provider.

Your server authenticates itself.

The provider returns an access token.

Your server uses that token to call the API.

This is a different problem from a user signing into an application.

## Access Tokens Should Expire

Long-lived access tokens increase risk.

Use short-lived access tokens where appropriate.

Applications that use refresh tokens should also consider rotation and secure storage.

## Authentication vs Authorization

Authentication asks:

Who are you?

Authorization asks:

What are you allowed to access?

An API can successfully authenticate a user and still reject the request because that user does not have permission to access the requested resource.

## Avoid Old Patterns

New applications should generally avoid legacy OAuth patterns that expose access tokens unnecessarily.

For browser and mobile applications, Authorization Code with PKCE is the modern pattern to understand.

## OAuth Should Be Boring

Good authentication should not make developers think about security every time they make an API request.

Clear documentation should explain how to start authorization, exchange the code, refresh tokens, understand scopes, handle expiration, and handle errors.

A good OAuth implementation is secure, predictable, and easy to integrate.
`,
    faq: [
      {
        question: "What is PKCE in OAuth?",
        answer:
          "PKCE adds a temporary verifier and challenge to the authorization flow, helping protect authorization codes from interception.",
      },
      {
        question: "When should I use Client Credentials?",
        answer:
          "Use Client Credentials when one backend service needs to authenticate itself to another service without a user being involved.",
      },
      {
        question: "Is OAuth authentication or authorization?",
        answer:
          "OAuth is primarily an authorization framework. Authentication and identity are often handled alongside OAuth using additional standards such as OpenID Connect.",
      },
    ],
  },

  {
    id: 8,
    slug: "graphql-n-plus-one-dataloader",
    title: "GraphQL at Scale: How to Fix the N+1 Query Problem",
    excerpt:
      "Learn why GraphQL applications can create hundreds of database queries and how batching, DataLoader, caching, and schema design solve the problem.",
    date: "July 30, 2026",
    keywords: [
      "GraphQL",
      "GraphQL N+1",
      "DataLoader",
      "GraphQL performance",
      "GraphQL scalability",
    ],
    content: `
## What Is the N+1 Problem?

The N+1 problem happens when one API request creates many unnecessary database queries.

Imagine an endpoint returns 100 users.

The application makes one query for the users.

Then the resolver makes another query for each user's company.

That produces 101 queries.

The API may look fast with ten users.

At production scale, it can become a serious database problem.

## Why GraphQL Can Expose This Problem

GraphQL allows clients to request nested relationships.

That flexibility is powerful.

But each resolver may independently query the database.

A request such as users → company → employees → projects can create a large number of queries if the backend is not designed carefully.

## DataLoader

DataLoader is a common solution for batching and caching.

Instead of fetching each company separately, the application collects all required company IDs and performs a single batched query.

This can turn hundreds of database requests into a much smaller number.

The [GraphQL documentation](https://graphql.org/learn/) is a useful starting point for understanding the broader architecture.

## Fix the Database Layer First

Caching should not be the first solution to every GraphQL performance issue.

Start by understanding which queries are slow.

Look for missing indexes, repeated queries, large joins, unnecessary fields, bad pagination, and expensive nested resolvers.

## Pagination Matters

Never allow an unrestricted GraphQL query to return millions of records.

Use sensible pagination limits.

Cursor-based pagination is often useful for large datasets.

## Query Complexity

Public GraphQL APIs should also consider query depth and complexity.

A client should not be able to send an extremely expensive query that consumes all backend resources.

Set limits where appropriate.

## Monitor Resolvers

API latency alone does not tell the whole story.

Monitor resolver execution time, database query count, cache hit rate, memory, and P95 latency.

GraphQL is powerful because it gives clients flexibility.

That flexibility needs backend controls to remain safe at scale.
`,
    faq: [
      {
        question: "What causes N+1 queries in GraphQL?",
        answer:
          "N+1 usually happens when nested resolvers perform separate database queries for every returned object instead of batching related data.",
      },
      {
        question: "Does DataLoader fix N+1?",
        answer:
          "DataLoader can solve many N+1 patterns by batching and caching related database requests, but the database queries and schema design still need to be efficient.",
      },
      {
        question: "Should GraphQL APIs have query limits?",
        answer:
          "Public GraphQL APIs should consider depth, complexity, pagination, and resource limits to prevent extremely expensive queries.",
      },
    ],
  },

  {
    id: 9,
    slug: "api-load-testing-guide",
    title: "API Load Testing: How to Test an API Before Launch",
    excerpt:
      "A practical API load testing guide covering realistic traffic, response time, P95 and P99 latency, error rates, k6, and database bottlenecks.",
    date: "July 28, 2026",
    keywords: [
      "API load testing",
      "API performance testing",
      "k6",
      "API stress testing",
      "API testing tools",
    ],
    content: `
## Why Load Testing Matters

An API can work perfectly with ten users and fail badly with ten thousand.

Load testing helps you understand what happens when traffic increases.

It can reveal database bottlenecks, slow endpoints, connection pool problems, memory issues, and unexpected error rates before users discover them.

## Do Not Test Only /health

A health endpoint proves almost nothing about application performance.

A realistic load test should include actual workflows such as login, search, reading data, creating data, updating data, expensive queries, authentication, and large responses.

The closer the test is to real user behavior, the more useful the result.

## P95 and P99 Matter

Average response time can hide slow requests.

If 99 requests take 100ms and one request takes 10 seconds, the average does not clearly communicate the experience of that slow user.

P95 and P99 give a better picture of tail latency.

## k6 Is a Practical Starting Point

[k6](https://k6.io/) is a popular developer-focused load testing tool.

It allows teams to define virtual users, traffic patterns, thresholds, and test scenarios.

The goal is not simply to generate the largest number possible.

The goal is to find where the API starts degrading.

## Watch the Database

The database is often the first bottleneck.

Look for slow queries, missing indexes, too many connections, large result sets, N+1 queries, expensive joins, and connection pool exhaustion.

A load test should be run while watching both the API and the infrastructure underneath it.

## Define Performance Targets

Before testing, decide what acceptable performance means.

For example:

P95 below a specific latency.

Very low 5xx rate.

Stable database connection usage.

No memory growth.

The exact targets depend on the application.

Load testing is most useful when it answers a business question:

Can our API handle the traffic we expect?
`,
    faq: [
      {
        question: "What is the difference between load testing and stress testing?",
        answer:
          "Load testing checks expected traffic levels. Stress testing intentionally pushes the system beyond normal capacity to understand how and when it fails.",
      },
      {
        question: "Why are P95 and P99 useful?",
        answer:
          "They show tail latency and reveal slower requests that an average response time can hide.",
      },
      {
        question: "What should I monitor during an API load test?",
        answer:
          "Monitor latency, error rates, throughput, CPU, memory, database queries, connection pools, and external service failures.",
      },
    ],
  },

  {
    id: 10,
    slug: "best-serverless-platforms-api",
    title: "Best Serverless Platforms for APIs in 2026",
    excerpt:
      "Compare AWS Lambda, Cloudflare Workers, and Vercel Functions for API hosting, including performance, runtime differences, scaling, and use cases.",
    date: "July 25, 2026",
    keywords: [
      "serverless API",
      "AWS Lambda",
      "Cloudflare Workers",
      "Vercel Functions",
      "API hosting",
    ],
    content: `
## What Makes Serverless APIs Useful?

Serverless platforms remove much of the infrastructure work required to deploy an API.

You write a function.

You deploy it.

The platform handles much of the scaling and infrastructure.

That does not mean all serverless platforms are the same.

The runtime, limits, pricing, networking, cold starts, and developer experience can be very different.

## AWS Lambda

AWS Lambda is one of the most established serverless platforms.

It works especially well when the application already uses AWS services such as S3, DynamoDB, SQS, EventBridge, RDS, and IAM.

The [AWS Lambda documentation](https://docs.aws.amazon.com/lambda/) provides current runtime and deployment details.

Lambda is a strong choice for enterprise workloads and teams that need deep AWS integration.

## Cloudflare Workers

Cloudflare Workers are designed around edge execution.

This can be useful when API requests should be handled close to users around the world.

Workers are particularly interesting for API gateways, authentication, routing, caching, edge APIs, and global applications.

The [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/) explains the runtime model.

## Vercel Functions

Vercel Functions are convenient for full-stack applications, especially when the frontend and backend are deployed together.

The developer experience is one of the main advantages.

For teams already using Vercel, adding API functionality can be straightforward.

The [Vercel Functions documentation](https://vercel.com/docs/functions) provides current implementation details.

## Cold Starts Are Not Everything

Developers often compare platforms only by cold-start numbers.

Real API performance also depends on database latency, external API calls, region selection, payload size, caching, application code, and connection reuse.

A fast function can still produce a slow API if the database takes 500ms.

## Which Platform Should You Choose?

Choose AWS Lambda when you need the AWS ecosystem.

Choose Cloudflare Workers when edge execution and global latency matter.

Choose Vercel when deployment simplicity and full-stack developer experience are priorities.

There is also nothing wrong with using more than one platform.

Infrastructure should follow the needs of the application rather than the other way around.
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
          "No. API performance also depends on databases, external services, networking, application code, and caching.",
      },
      {
        question: "Can one application use multiple serverless platforms?",
        answer:
          "Yes. Different services can run on different infrastructure when there is a clear technical or business reason.",
      },
    ],
  },

  {
    id: 11,
    slug: "why-apives-verifies-apis",
    title: "Why Apives Verifies APIs Before Listing Them",
    excerpt:
      "See why API discovery needs more than a directory of links and how Apives focuses on making API research faster, clearer, and more useful for developers.",
    date: "July 22, 2026",
    keywords: [
      "Apives",
      "API directory",
      "verified APIs",
      "API discovery",
      "API marketplace",
      "API verification",
    ],
    content: `
## Finding an API Is Easy

There are thousands of APIs available online.

The difficult part is finding one that actually fits your requirements.

A developer may spend an hour comparing APIs only to discover that an endpoint is unavailable, the authentication instructions are outdated, or the pricing information is unclear.

That is where API discovery becomes more important than simply having a large list.

## What Apives Is Trying to Solve

Apives is built around a simple idea:

Make API discovery easier for developers.

Instead of forcing developers to search through unrelated websites, API information can be organized around the things developers actually care about.

What does the API do?

How do I authenticate?

Does it have a free option?

What are the limits?

How do I start?

What endpoints are available?

The goal is to reduce the time between I need an API and I can start building.

## API Availability Matters

A directory link is not enough.

Developers need APIs that actually respond.

Availability, endpoint reachability, response behavior, and documentation quality all matter when deciding whether an API is worth integrating.

## Authentication Should Be Clear

One of the most frustrating API experiences is discovering the authentication requirements only after trying several requests.

API listings should make authentication easy to understand.

Developers should quickly know whether an API uses an API key, OAuth, JWT, or another mechanism.

## Pricing Is Part of API Discovery

Pricing is often one of the first questions developers have.

Is the API free?

Is there a free tier?

How many requests are included?

Does the provider charge by request, token, record, or another unit?

Clear pricing information can save developers significant research time.

## Real API Documentation Matters

Good API documentation should show developers how to start.

A useful quickstart normally includes authentication, base URL, example request, example response, common errors, rate limits, and important parameters.

The [OpenAPI specification](https://spec.openapis.org/oas/latest.html) can also make API information machine-readable.

## Why Verification Is Important

A huge API directory is not automatically a useful API directory.

Developers do not need thousands of random links.

They need APIs they can understand and evaluate quickly.

That is the direction Apives is working toward.

Find an API.

Understand the API.

Try the API.

Build with the API.

That is the experience we want API discovery to provide.
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
          "Verification helps developers avoid wasting time on APIs that are unavailable, poorly documented, or difficult to evaluate.",
      },
      {
        question: "What information should an API listing include?",
        answer:
          "Useful information includes what the API does, authentication, pricing, limits, documentation, examples, and other details developers need before integrating it.",
      },
    ],
  },
];

/* =========================================================
   CONSTANTS
========================================================= */

const GREEN = "#22c55e";
const GREEN_SOFT = "#4ade80";

/* =========================================================
   SEO
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

  setMeta("twitter:card", "summary", false);
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

/* =========================================================
   STRUCTURED DATA
========================================================= */

function updateStructuredData(
  article?: Article | null
) {
  const existing = document.getElementById(
    "apives-blog-schema"
  );

  existing?.remove();

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
        url: "https://x.com/priiinceguta",
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
   INLINE MARKDOWN LINKS
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
   Kept local so lucide-react brand export changes
   cannot break GitHub builds.
========================================================= */

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
      />
      <circle cx="12" cy="12" r="4" />
      <circle
        cx="17.5"
        cy="6.5"
        r="0.8"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="18"
      height="18"
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
      width="18"
      height="18"
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
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21 12.1c0-1.2-1-2.2-2.2-2.2-.6 0-1.1.2-1.5.6-1.4-.9-3.1-1.5-5-1.6l.8-3.5 2.4.5a1.9 1.9 0 1 0 .4-1.4l-3-0.6c-.4-.1-.8.2-.9.6l-1 4.4c-1.9.1-3.7.7-5.1 1.6-.4-.4-1-.6-1.5-.6A2.2 2.2 0 0 0 2 12.1c0 .8.4 1.5 1 1.9v.5c0 3.4 4 6.2 9 6.2s9-2.8 9-6.2V14c.6-.4 1-1.1 1-1.9ZM8.2 14.4a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm7.7 2.8c-1 .9-2.3 1.3-3.9 1.3s-2.9-.4-3.9-1.3a.7.7 0 0 1 1-1c.7.6 1.7.9 2.9.9s2.2-.3 2.9-.9a.7.7 0 0 1 1 1Zm0-2.8a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <span
      aria-hidden="true"
      style={{
        fontSize: 17,
        fontWeight: 700,
        lineHeight: 1,
      }}
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    updateSEO(article);
    updateStructuredData(article);

    window.scrollTo(0, 0);

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

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      const input =
        document.createElement("input");

      input.value = shareUrl;

      document.body.appendChild(input);

      input.select();

      document.execCommand("copy");

      input.remove();

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
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
      | "instagram"
      | "facebook"
      | "reddit"
      | "x"
      | "linkedin"
  ) => {
    if (platform === "instagram") {
      nativeShare();
      return;
    }

    let url = "";

    switch (platform) {
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
    }

    if (url) {
      window.open(
        url,
        "_blank",
        "noopener,noreferrer,width=720,height=620"
      );
    }
  };

  const related = articles
    .filter(
      (item) => item.id !== article.id
    )
    .slice(0, 3);

  return (
    <main className="blog-root">
      <article className="article-page">

        {/* TITLE */}

        <header className="article-header">
          <div className="article-blog-label">
            APIVES BLOG
          </div>

          <h1 className="article-title">
            {article.title}
          </h1>

          <p className="article-excerpt">
            {article.excerpt}
          </p>

          {/* DATE + AUTHOR */}

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
                href="https://x.com/priiinceguta"
                target="_blank"
                rel="noopener noreferrer"
                className="author-link"
              >
                @priiinceguta
              </a>
            </span>
          </div>

          {/* SOCIAL */}

          <div className="share-row">

            <ShareButton
              label="Instagram"
              onClick={() =>
                share("instagram")
              }
            >
              <InstagramIcon />
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
              <XIcon />
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
              label={
                copied
                  ? "Copied"
                  : "Share"
              }
              onClick={nativeShare}
            >
              {copied ? (
                <Check size={18} />
              ) : (
                <Share2 size={18} />
              )}
            </ShareButton>

          </div>
        </header>

        {/* CONTENT */}

        <div className="article-content">
          {renderContent(article.content)}
        </div>

        {/* FAQ */}

        <section className="faq-section">
          <h2>
            Frequently Asked Questions
          </h2>

          <p className="faq-intro">
            Common questions developers ask
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

        {/* RELATED */}

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

                    window.scrollTo(
                      0,
                      0
                    );
                  }}
                >
                  <div>
                    <span className="related-date">
                      {relatedArticle.date}
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

const ArticleListItem = memo(
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
  ] = useState<Article | null>(null);

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  useEffect(() => {
    updateSEO(null);
    updateStructuredData(null);

    return () => {
      const schema =
        document.getElementById(
          "apives-blog-schema"
        );

      schema?.remove();
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

  /* DETAIL */

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

            window.scrollTo(
              0,
              0
            );
          }}
        />
      </>
    );
  }

  /* LIST */

  return (
    <>
      <BlogStyles />

      <main className="blog-root">

        {/* HERO */}

        <section className="blog-hero">

          <div className="blog-kicker">
            APIVES
          </div>

          <h1>
            Blog
          </h1>

          <p>
            Practical ideas for building
            better APIs.
          </p>

        </section>

        {/* SEARCH */}

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

        {/* ARTICLES */}

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

                    window.scrollTo(
                      0,
                      0
                    );
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
   No Tailwind dependency for custom Mora classes.
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
         BLOG HERO
      ============================================ */

      .blog-hero {
        max-width: 820px;
        margin: 0 auto;
        padding:
          112px 24px
          58px;
        text-align: center;
      }

      .blog-kicker {
        margin-bottom: 18px;
        color: ${GREEN};
        font-size: 10px;
        line-height: 1;
        font-weight: 700;
        letter-spacing: .22em;
      }

      .blog-hero h1 {
        margin: 0;
        color: ${GREEN};
        font-size:
          clamp(44px, 7vw, 68px);
        line-height: .95;
        letter-spacing: -3px;
        font-weight: 800;
      }

      .blog-hero p {
        max-width: 580px;
        margin: 20px auto 0;
        color: #737373;
        font-size:
          clamp(16px, 2vw, 19px);
        line-height: 1.6;
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
        max-width: 420px;
        height: 46px;
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
        font-size: 13px;

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

        width: 28px;
        height: 28px;

        display: flex;
        align-items: center;
        justify-content: center;

        border: 0;
        border-radius: 50%;

        background: transparent;
        color: #555;

        cursor: pointer;

        transition:
          color .15s ease,
          background .15s ease;
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
        padding:
          34px 0
          36px;

        display: block;

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
        margin-bottom: 12px;
        color: ${GREEN};
        font-size: 11px;
        font-weight: 600;
        letter-spacing: .015em;
      }

      .article-list-item h2 {
        max-width: 850px;
        margin: 0 0 10px;

        color: #f5f5f5;

        font-size:
          clamp(21px, 3vw, 29px);

        line-height: 1.25;

        letter-spacing:
          -.75px;

        font-weight: 650;

        transition:
          color .18s ease;
      }

      .article-list-item:hover h2 {
        color: #fff;
      }

      .article-list-item p {
        max-width: 800px;
        margin: 0;

        color: #606060;

        font-size:
          clamp(13px, 1.7vw, 15px);

        line-height: 1.75;
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
         ARTICLE DETAIL
      ============================================ */

      .article-page {
        width: 100%;
        max-width: 790px;
        margin: 0 auto;
        padding:
          105px 24px
          110px;
      }

      .article-header {
        text-align: center;
        padding-bottom: 58px;
      }

      .article-blog-label {
        margin-bottom: 22px;
        color: ${GREEN};
        font-size: 10px;
        font-weight: 700;
        letter-spacing: .20em;
      }

      .article-title {
        max-width: 800px;
        margin: 0 auto;

        color: #fff;

        font-size:
          clamp(34px, 6vw, 57px);

        line-height: 1.06;

        letter-spacing:
          -2.7px;

        font-weight: 800;
      }

      .article-excerpt {
        max-width: 690px;
        margin: 24px auto 0;

        color: #666;

        font-size:
          clamp(15px, 2vw, 18px);

        line-height: 1.75;
      }

      .article-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;

        gap: 8px;

        margin-top: 23px;

        color: #575757;

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
         SOCIAL
      ============================================ */

      .share-row {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        margin-top: 27px;
      }

      .share-button {
        position: relative;

        width: 43px;
        height: 43px;

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

      .share-button:hover {
        background:
          rgba(255,255,255,.065);

        border-color:
          rgba(34,197,94,.28);

        color: ${GREEN_SOFT};

        transform:
          translateY(-2px);
      }

      .share-button:active {
        transform: scale(.91);
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
        line-height: 1;

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
         ARTICLE CONTENT
      ============================================ */

      .article-content {
        width: 100%;
      }

      .article-heading {
        margin:
          52px 0
          17px;

        color: #f5f5f5;

        font-size:
          clamp(22px, 3vw, 27px);

        line-height: 1.25;

        letter-spacing:
          -.7px;

        font-weight: 720;
      }

      .article-paragraph {
        margin:
          0 0
          19px;

        color: #8a8a8a;

        font-size:
          clamp(15px, 1.7vw, 16px);

        line-height: 1.9;

        font-weight: 400;
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
        height: 3px;
      }

      .article-code {
        overflow-x: auto;

        margin:
          24px 0;

        padding: 17px;

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
        margin-top: 76px;
        padding-top: 43px;

        border-top:
          1px solid
          rgba(255,255,255,.085);
      }

      .faq-section h2,
      .related-section h2 {
        margin: 0;

        color: #f5f5f5;

        font-size:
          clamp(23px, 3vw, 29px);

        line-height: 1.25;

        letter-spacing:
          -.7px;

        font-weight: 720;
      }

      .faq-intro {
        margin:
          10px 0 23px;

        color: #555;

        font-size: 13px;
        line-height: 1.7;
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

        padding: 21px 0;

        list-style: none;

        color: #c9c9c9;

        font-size:
          clamp(14px, 2vw, 16px);

        line-height: 1.5;

        font-weight: 600;

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
        max-width: 700px;

        margin:
          -2px 0
          21px;

        color: #686868;

        font-size: 14px;

        line-height: 1.8;
      }

      /* ============================================
         RELATED
      ============================================ */

      .related-section {
        margin-top: 76px;
        padding-top: 43px;

        border-top:
          1px solid
          rgba(255,255,255,.085);
      }

      .related-section h2 {
        margin-bottom: 15px;
      }

      .related-item {
        width: 100%;

        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 25px;

        padding:
          22px 0;

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
          clamp(15px, 2vw, 18px);

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
        margin: 7px 0 0;

        color: #555;

        font-size: 12px;

        line-height: 1.6;

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

        .blog-hero {
          padding:
            82px 20px
            42px;
        }

        .blog-hero h1 {
          letter-spacing: -2.2px;
        }

        .search-section {
          padding:
            0 20px
            27px;
        }

        .articles-section {
          padding:
            0 20px
            80px;
        }

        .article-list-item {
          padding:
            27px 0
            29px;
        }

        .article-page {
          padding:
            78px 20px
            80px;
        }

        .article-header {
          padding-bottom: 45px;
        }

        .article-title {
          letter-spacing:
            -1.8px;
        }

        .article-excerpt {
          font-size: 15px;
        }

        .article-paragraph {
          font-size: 15px;
          line-height: 1.85;
        }

        .article-heading {
          margin-top: 42px;
        }

        .share-button {
          width: 40px;
          height: 40px;
        }

        .share-row {
          gap: 7px;
        }

        .faq-section,
        .related-section {
          margin-top: 58px;
          padding-top: 34px;
        }

      }

    `}</style>
  );
}