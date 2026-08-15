import React, {
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  X,
  Instagram,
  Facebook,
  Linkedin,
  Reddit,
  Share2,
  Check,
  ExternalLink,
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
   ARTICLES
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

There is no single "best" LLM API.

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

## 1. Broken Object Level Authorization

One of the most common API security problems is failing to verify whether a user is allowed to access a specific object.

For example:

/api/orders/1001

is changed to:

/api/orders/1002

Being authenticated does not mean the user owns order 1002.

The server must check ownership or permissions before returning the object.

## 2. Weak Authentication

Authentication determines who the user or application is.

Use modern authentication patterns and avoid putting secrets into frontend JavaScript.

API keys should never be treated as passwords for users.

For browser and mobile applications, OAuth 2.0 with PKCE is often a better approach.

The [OAuth 2.0 RFC](https://www.rfc-editor.org/rfc/rfc6749) and [OAuth security best practices](https://www.rfc-editor.org/rfc/rfc9700) are useful references.

## 3. Missing Rate Limits

Public endpoints should have reasonable limits.

Without rate limiting, attackers can abuse login endpoints, expensive searches, AI features, and other resource-heavy operations.

Return HTTP 429 when a client exceeds the allowed request rate.

## 4. Unsafe Input

Never trust incoming JSON.

Validate request bodies, query parameters, headers, file uploads, IDs, and user-generated strings.

Use allowlists for fields where possible.

## 5. Excessive Data Exposure

Do not return an entire database record when the client only needs three fields.

API responses should expose only the information the caller actually needs.

This reduces both accidental data leaks and the impact of compromised accounts.

## 6. Poor Error Handling

Production APIs should not return database stack traces or internal file paths to users.

Return useful errors without exposing internal implementation details.

## 7. Missing HTTPS

Sensitive API traffic should use HTTPS.

Never send authentication credentials over plain HTTP.

TLS protects data while it moves between the client and server.

## 8. Unsafe File Uploads

File uploads need validation.

Check file size, content type, filename handling, storage permissions, and malware scanning requirements where appropriate.

Never assume a file extension tells you what a file really contains.

## 9. Poor Secret Management

Do not put production secrets in GitHub.

Use environment variables and dedicated secret management systems.

Rotate credentials when they are exposed.

## 10. No Monitoring

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
## 1. Start With the API Consumer

Before writing endpoints, understand who will use the API.

A public API has different requirements from an internal service.

Think about authentication, documentation, versioning, rate limits, error messages, and backwards compatibility before implementation starts.

## 2. Design the API Contract

Define endpoints and data structures before writing every backend function.

An OpenAPI document can describe the contract and give frontend and backend teams a shared reference.

The [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) is a good starting point.

For example, decide whether an endpoint returns:

{
  "id": "123",
  "name": "Example"
}

or some completely different structure.

Consistency matters more than cleverness.

## 3. Add Authentication Early

Authentication should not be added as an afterthought.

Decide how users and services authenticate before building sensitive business logic.

Common options include API keys, OAuth, JWT-based systems, sessions, and machine-to-machine credentials.

Authentication answers "who are you?"

Authorization answers "what are you allowed to do?"

Both are important.

## 4. Validate Everything Important

API input comes from outside your trusted application.

Validate:

Required fields.

Types.

String lengths.

Numbers.

IDs.

Allowed values.

File sizes.

Nested objects.

Good validation creates a clean boundary between untrusted input and business logic.

## 5. Design Consistent Errors

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

## 6. Test Before Production

Unit tests are useful, but they are not enough.

Test complete API flows.

Test authentication.

Test invalid input.

Test permissions.

Test database failures.

Test rate limits.

Test realistic traffic.

Load testing tools such as [k6](https://k6.io/) can help identify performance problems before launch.

## 7. Monitor Everything That Matters

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

A good specification can become the source for:

API documentation.

Client SDKs.

Mock servers.

Type generation.

Contract tests.

Validation.

Developer tooling.

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

A typical system increases the delay between attempts.

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

Useful information includes:

Event ID.

Delivery attempt.

Timestamp.

HTTP status.

Response body.

Duration.

Next retry.

Final status.

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

That distinction is important.

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

Imagine:

Your backend needs to call a payment provider.

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

"Who are you?"

Authorization asks:

"What are you allowed to access?"

An API can successfully authenticate a user and still reject the request because that user does not have permission to access the requested resource.

## Avoid Old Patterns

New applications should generally avoid legacy OAuth patterns that expose access tokens unnecessarily.

For browser and mobile applications, Authorization Code with PKCE is the modern pattern to understand.

## OAuth Should Be Boring

Good authentication should not make developers think about security every time they make an API request.

Clear documentation should explain:

How to start authorization.

How to exchange the code.

How to refresh tokens.

What scopes mean.

How tokens expire.

What errors look like.

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

A request such as:

users → company → employees → projects

can create a large number of queries if the backend is not designed carefully.

## DataLoader

DataLoader is a common solution for batching and caching.

Instead of fetching each company separately, the application collects all required company IDs and performs a single batched query.

This can turn hundreds of database requests into a much smaller number.

The [GraphQL documentation](https://graphql.org/learn/) is a useful starting point for understanding the broader architecture.

## Fix the Database Layer First

Caching should not be the first solution to every GraphQL performance issue.

Start by understanding which queries are slow.

Look for:

Missing indexes.

Repeated queries.

Large joins.

Unnecessary fields.

Bad pagination.

Expensive nested resolvers.

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

A realistic load test should include actual workflows.

For example:

Login.

Search.

Read data.

Create data.

Update data.

Expensive queries.

Authentication.

Large responses.

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

Look for:

Slow queries.

Missing indexes.

Too many connections.

Large result sets.

N+1 queries.

Expensive joins.

Connection pool exhaustion.

A load test should be run while watching both the API and the infrastructure underneath it.

## Test Different Traffic Patterns

Real traffic is rarely perfectly flat.

Test:

Normal traffic.

Sudden spikes.

Gradual growth.

Long-running traffic.

Large payloads.

Heavy endpoints.

This helps reveal problems that a short benchmark can miss.

## Define Performance Targets

Before testing, decide what acceptable performance means.

For example:

P95 below a specific latency.

Very low 5xx rate.

Stable database connection usage.

No memory growth.

The exact targets depend on the application.

Load testing is most useful when it answers a business question:

"Can our API handle the traffic we expect?"
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

The [AWS Lambda documentation](https://docs.aws.amazon.com/lambda/) provides the current runtime and deployment details.

Lambda is a strong choice for enterprise workloads and teams that need deep AWS integration.

## Cloudflare Workers

Cloudflare Workers are designed around edge execution.

This can be useful when API requests should be handled close to users around the world.

Workers are particularly interesting for:

API gateways.

Authentication.

Routing.

Caching.

Edge APIs.

Global applications.

The [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/) explains the runtime model.

## Vercel Functions

Vercel Functions are convenient for full-stack applications, especially when the frontend and backend are deployed together.

The developer experience is one of the main advantages.

For teams already using Vercel, adding API functionality can be straightforward.

The [Vercel Functions documentation](https://vercel.com/docs/functions) provides current implementation details.

## Cold Starts Are Not Everything

Developers often compare platforms only by cold-start numbers.

Real API performance also depends on:

Database latency.

External API calls.

Region selection.

Payload size.

Caching.

Application code.

Connection reuse.

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

The goal is to reduce the time between "I need an API" and "I can start building."

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

A useful quickstart normally includes:

Authentication.

Base URL.

Example request.

Example response.

Common errors.

Rate limits.

Important parameters.

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
   SEO
========================================================= */

function updateSEO(article?: Article | null) {
  const title = article
    ? `${article.title} | Apives`
    : "Apives Blog — API Guides, Engineering & Developer Insights";

  const description = article
    ? article.excerpt
    : "Practical API guides, engineering insights, API security, authentication, AI APIs, GraphQL, webhooks, testing, and infrastructure.";

  const keywords = article
    ? article.keywords.join(", ")
    : [
        "API blog",
        "API guides",
        "API development",
        "API security",
        "REST API",
        "GraphQL",
        "AI APIs",
        "webhooks",
      ].join(", ");

  document.title = title;

  const setMeta = (
    name: string,
    content: string,
    property = false
  ) => {
    const attr = property ? "property" : "name";

    let meta = document.head.querySelector(
      `meta[${attr}="${name}"]`
    ) as HTMLMetaElement | null;

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute(attr, name);
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", content);
  };

  setMeta("description", description);
  setMeta("keywords", keywords);

  setMeta("og:title", title, true);
  setMeta("og:description", description, true);
  setMeta("og:type", article ? "article" : "website", true);

  setMeta("twitter:card", "summary", false);
  setMeta("twitter:title", title, false);
  setMeta("twitter:description", description, false);

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
   INLINE MARKDOWN LINK RENDERER
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
        <React.Fragment key={`${keyPrefix}-${index}`}>
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
        className="
          text-mora-500
          underline
          underline-offset-4
          decoration-mora-500/30
          hover:decoration-mora-500
          hover:text-mora-400
          transition-colors
        "
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
          key={index}
          className="h-3"
        />
      );
    }

    if (clean.startsWith("## ")) {
      return (
        <h2
          key={index}
          className="
            mt-12
            mb-5

            text-[22px]
            md:text-[25px]

            leading-[1.25]

            tracking-[-0.6px]

            font-bold

            text-white
          "
        >
          {clean.replace("## ", "")}
        </h2>
      );
    }

    if (
      clean.startsWith("{") ||
      clean.startsWith('"')
    ) {
      return (
        <pre
          key={index}
          className="
            my-5
            overflow-x-auto

            rounded-xl

            border
            border-white/[0.07]

            bg-white/[0.025]

            px-4
            py-4

            text-[12px]
            leading-6

            text-slate-400
          "
        >
          {clean}
        </pre>
      );
    }

    return (
      <p
        key={index}
        className="
          mb-5

          text-[15px]
          md:text-[16px]

          leading-[1.9]

          text-slate-400
        "
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
   X BRAND MARK
========================================================= */

function XBrandIcon() {
  return (
    <span
      aria-hidden="true"
      className="
        text-[17px]
        leading-none
        font-black
        tracking-[-0.08em]
      "
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
      onClick={onClick}
      aria-label={label}
      title={label}
      className="
        group

        relative

        flex
        items-center
        justify-center

        w-10
        h-10
        md:w-11
        md:h-11

        rounded-full

        bg-white/[0.035]

        border
        border-white/[0.09]

        backdrop-blur-xl

        text-mora-500

        shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]

        hover:bg-white/[0.07]
        hover:border-mora-500/30
        hover:text-mora-400

        active:scale-90

        transition-all
        duration-200
      "
    >
      {children}

      <span
        className="
          pointer-events-none

          absolute
          top-full
          mt-2

          left-1/2
          -translate-x-1/2

          whitespace-nowrap

          rounded-md

          border
          border-white/10

          bg-black

          px-2
          py-1

          text-[9px]
          text-slate-400

          opacity-0
          group-hover:opacity-100

          transition-opacity

          z-50
        "
      >
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
  onBack,
  onSelect,
}: {
  article: Article;
  articles: Article[];
  onBack: () => void;
  onSelect: (article: Article) => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    updateSEO(article);

    window.scrollTo({
      top: 0,
      behavior: "instant" as ScrollBehavior,
    });

    return () => {
      updateSEO(null);
    };
  }, [article]);

  const shareUrl =
    `${window.location.origin}/blog/${article.slug}`;

  const shareTitle = encodeURIComponent(
    article.title
  );

  const encodedUrl =
    encodeURIComponent(shareUrl);

  const share = (
    platform:
      | "instagram"
      | "facebook"
      | "reddit"
      | "x"
      | "linkedin"
  ) => {
    let url = "";

    if (platform === "facebook") {
      url =
        `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    }

    if (platform === "reddit") {
      url =
        `https://www.reddit.com/submit?url=${encodedUrl}&title=${shareTitle}`;
    }

    if (platform === "x") {
      url =
        `https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodedUrl}`;
    }

    if (platform === "linkedin") {
      url =
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    }

    /*
      Instagram does not provide a normal web URL-share
      endpoint like the other platforms.

      On supported devices, use the native share API.
      Otherwise copy the article link.
    */

    if (platform === "instagram") {
      nativeShare();
      return;
    }

    if (url) {
      window.open(
        url,
        "_blank",
        "noopener,noreferrer,width=700,height=600"
      );
    }
  };

  const nativeShare = async () => {
    if (
      typeof navigator !== "undefined" &&
      navigator.share
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

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        shareUrl
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      console.error(
        "Unable to copy article link."
      );
    }
  };

  const related = articles
    .filter(
      (item) =>
        item.id !== article.id
    )
    .slice(0, 3);

  return (
    <main
      className="
        min-h-screen
        bg-black
        text-white
      "
    >

      {/* =================================================
          ARTICLE
      ================================================= */}

      <article
        className="
          max-w-[780px]
          mx-auto

          px-5
          md:px-8

          pt-20
          md:pt-28

          pb-24
        "
      >

        {/* BLOG LABEL */}

        <div
          className="
            text-center

            text-[11px]
            md:text-[12px]

            uppercase
            tracking-[0.2em]

            font-bold

            text-mora-500

            mb-7
          "
        >
          Blog
        </div>

        {/* TITLE */}

        <h1
          className="
            text-center

            text-[34px]
            sm:text-[42px]
            md:text-[54px]

            leading-[1.08]

            tracking-[-2px]
            md:tracking-[-2.7px]

            font-bold

            text-white

            mb-7
          "
        >
          {article.title}
        </h1>

        {/* EXCERPT */}

        <p
          className="
            max-w-[680px]

            mx-auto

            text-center

            text-[16px]
            md:text-[18px]

            leading-[1.7]

            text-slate-500

            mb-7
          "
        >
          {article.excerpt}
        </p>

        {/* DATE + AUTHOR */}

        <div
          className="
            flex
            flex-wrap

            items-center
            justify-center

            gap-x-3
            gap-y-2

            text-[11px]
            md:text-[12px]

            mb-7
          "
        >
          <span
            className="
              text-mora-500
              font-semibold
            "
          >
            {article.date}
          </span>

          <span
            className="
              text-slate-700
            "
          >
            •
          </span>

          <span
            className="
              text-slate-500
            "
          >
            Posted by{" "}
            <a
              href="https://x.com/priiinceguta"
              target="_blank"
              rel="noopener noreferrer"
              className="
                text-mora-500

                font-semibold

                hover:text-mora-400

                underline
                underline-offset-4
                decoration-mora-500/25
                hover:decoration-mora-500

                transition-colors
              "
            >
              @priiinceguta
            </a>
          </span>
        </div>

        {/* SHARE */}

        <div
          className="
            flex
            items-center
            justify-center

            gap-2

            mb-14
          "
        >

          <ShareButton
            label="Instagram"
            onClick={() =>
              share("instagram")
            }
          >
            <Instagram size={17} />
          </ShareButton>

          <ShareButton
            label="Facebook"
            onClick={() =>
              share("facebook")
            }
          >
            <Facebook size={17} />
          </ShareButton>

          <ShareButton
            label="Reddit"
            onClick={() =>
              share("reddit")
            }
          >
            <Reddit size={17} />
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
            <Linkedin size={17} />
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
              <Check size={17} />
            ) : (
              <Share2 size={17} />
            )}
          </ShareButton>

        </div>

        {/* =================================================
            ARTICLE CONTENT
        ================================================= */}

        <div>
          {renderContent(
            article.content
          )}
        </div>

        {/* =================================================
            FAQ
        ================================================= */}

        <section
          className="
            mt-16
            pt-10

            border-t
            border-white/[0.08]
          "
        >

          <h2
            className="
              text-[24px]
              md:text-[28px]

              tracking-[-0.7px]

              font-bold

              text-white

              mb-3
            "
          >
            Frequently Asked Questions
          </h2>

          <p
            className="
              text-[14px]
              md:text-[15px]

              leading-7

              text-slate-500

              mb-8
            "
          >
            Common questions developers ask
            about this topic.
          </p>

          <div
            className="
              divide-y
              divide-white/[0.07]
            "
          >
            {article.faq.map(
              (item, index) => (
                <details
                  key={index}
                  className="
                    group
                    py-5
                  "
                >
                  <summary
                    className="
                      list-none
                      cursor-pointer

                      flex
                      items-center
                      justify-between
                      gap-5

                      text-[15px]
                      md:text-[16px]

                      font-semibold

                      text-slate-200

                      group-open:text-white
                    "
                  >
                    <span>
                      {item.question}
                    </span>

                    <ChevronRight
                      size={16}
                      className="
                        shrink-0

                        text-slate-600

                        group-open:rotate-90
                        group-open:text-mora-500

                        transition-all
                      "
                    />
                  </summary>

                  <p
                    className="
                      mt-4

                      pr-6

                      text-[14px]
                      md:text-[15px]

                      leading-[1.8]

                      text-slate-500
                    "
                  >
                    {item.answer}
                  </p>
                </details>
              )
            )}
          </div>

        </section>

        {/* =================================================
            CONTINUE READING
        ================================================= */}

        <section
          className="
            mt-16
            pt-10

            border-t
            border-white/[0.08]
          "
        >

          <h2
            className="
              text-[22px]
              md:text-[25px]

              tracking-[-0.5px]

              font-bold

              text-white

              mb-6
            "
          >
            More from the Apives Blog
          </h2>

          <div>
            {related.map(
              (relatedArticle) => (
                <button
                  key={
                    relatedArticle.id
                  }
                  type="button"
                  onClick={() => {
                    onSelect(
                      relatedArticle
                    );

                    window.scrollTo({
                      top: 0,
                      behavior:
                        "instant" as ScrollBehavior,
                    });
                  }}
                  className="
                    w-full

                    py-5

                    text-left

                    border-b
                    border-white/[0.07]

                    flex
                    items-center
                    justify-between
                    gap-5

                    group
                  "
                >

                  <div
                    className="
                      min-w-0
                    "
                  >

                    <div
                      className="
                        text-[10px]

                        text-mora-500

                        font-semibold

                        mb-2
                      "
                    >
                      {relatedArticle.date}
                    </div>

                    <div
                      className="
                        text-[15px]
                        md:text-[17px]

                        leading-[1.4]

                        font-semibold

                        text-slate-300

                        group-hover:text-white

                        transition-colors
                      "
                    >
                      {
                        relatedArticle.title
                      }
                    </div>

                    <p
                      className="
                        mt-2

                        text-[12px]
                        md:text-[13px]

                        leading-6

                        text-slate-600

                        line-clamp-2
                      "
                    >
                      {
                        relatedArticle.excerpt
                      }
                    </p>

                  </div>

                  <ChevronRight
                    size={17}
                    className="
                      shrink-0

                      text-slate-700

                      group-hover:text-mora-500
                      group-hover:translate-x-1

                      transition-all
                    "
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
        className="
          w-full

          text-left

          py-8
          md:py-9

          border-b
          border-white/[0.08]

          group
        "
      >

        {/* DATE */}

        <div
          className="
            text-[11px]
            md:text-[12px]

            font-semibold

            text-mora-500

            mb-4
          "
        >
          {article.date}
        </div>

        {/* TITLE */}

        <h2
          className="
            max-w-[820px]

            text-[22px]
            sm:text-[25px]
            md:text-[29px]

            leading-[1.25]

            tracking-[-0.7px]

            font-semibold

            text-white

            group-hover:text-slate-200

            transition-colors

            mb-3
          "
        >
          {article.title}
        </h2>

        {/* EXCERPT */}

        <p
          className="
            max-w-[800px]

            text-[14px]
            md:text-[15px]

            leading-[1.75]

            text-slate-500
          "
        >
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

  /* =======================================================
     DETAIL VIEW
  ======================================================= */

  if (selectedArticle) {
    return (
      <ArticleDetail
        article={selectedArticle}
        articles={ARTICLES}
        onBack={() => {
          setSelectedArticle(null);

          updateSEO(null);

          window.scrollTo({
            top: 0,
            behavior:
              "instant" as ScrollBehavior,
          });
        }}
        onSelect={(article) => {
          setSelectedArticle(
            article
          );
        }}
      />
    );
  }

  /* =======================================================
     BLOG LIST
  ======================================================= */

  return (
    <>
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          background: #000 !important;
        }

        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        ::selection {
          background: rgba(34,197,94,0.22);
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
          background: #22c55e;
        }

        .blog-search::placeholder {
          color: #4b5563;
        }

        .blog-search:focus {
          border-color: rgba(34,197,94,0.45) !important;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.05);
        }
      `}</style>

      <main
        className="
          min-h-screen

          bg-black

          text-white
        "
      >

        {/* =================================================
            CENTERED BLOG HERO
        ================================================= */}

        <section
          className="
            max-w-[900px]
            mx-auto

            px-5
            md:px-8

            pt-24
            sm:pt-28
            md:pt-32

            pb-10
            md:pb-12

            text-center
          "
        >

          <h1
            className="
              text-[42px]
              sm:text-[50px]
              md:text-[62px]

              leading-none

              tracking-[-2.5px]
              md:tracking-[-3px]

              font-bold

              text-mora-500

              mb-5
            "
          >
            Blog
          </h1>

          <p
            className="
              text-[17px]
              sm:text-[19px]
              md:text-[21px]

              leading-[1.5]

              text-slate-500

              max-w-[650px]

              mx-auto
            "
          >
            Practical guides for building,
            securing, and scaling APIs.
          </p>

        </section>

        {/* =================================================
            SEARCH
        ================================================= */}

        <section
          className="
            max-w-[900px]
            mx-auto

            px-5
            md:px-8

            pb-9
          "
        >

          <div
            className="
              relative

              max-w-[390px]

              mx-auto
            "
          >

            <Search
              size={15}
              className="
                absolute

                left-4

                top-1/2
                -translate-y-1/2

                text-slate-600

                pointer-events-none
              "
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
              className="
                blog-search

                w-full

                h-11

                rounded-full

                bg-white/[0.025]

                border
                border-white/[0.09]

                pl-11
                pr-10

                outline-none

                text-[13px]

                text-slate-300

                transition-all
              "
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() =>
                  setSearchQuery("")
                }
                className="
                  absolute

                  right-3

                  top-1/2
                  -translate-y-1/2

                  flex
                  items-center
                  justify-center

                  w-7
                  h-7

                  rounded-full

                  text-slate-600

                  hover:text-white
                  hover:bg-white/[0.06]

                  transition-all
                "
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}

          </div>

        </section>

        {/* =================================================
            ARTICLE LIST
        ================================================= */}

        <section
          className="
            max-w-[900px]
            mx-auto

            px-5
            md:px-8

            pb-28
          "
        >

          <div
            className="
              border-t
              border-white/[0.08]
            "
          >

            {filteredArticles.length > 0 ? (
              filteredArticles.map(
                (article) => (
                  <ArticleListItem
                    key={article.id}
                    article={article}
                    onClick={() =>
                      setSelectedArticle(
                        article
                      )
                    }
                  />
                )
              )
            ) : (
              <div
                className="
                  py-24

                  text-center
                "
              >

                <div
                  className="
                    text-[14px]

                    text-slate-600

                    mb-4
                  "
                >
                  No articles found.
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSearchQuery("")
                  }
                  className="
                    text-[11px]

                    text-mora-500

                    hover:text-mora-400

                    transition-colors
                  "
                >
                  Clear search
                </button>

              </div>
            )}

          </div>

        </section>

      </main>
    </>
  );
}