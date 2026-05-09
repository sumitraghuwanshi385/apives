import React, { useState, useEffect, useRef, memo, lazy, Suspense } from "react";
import { Search, Clock, ArrowRight, X, ChevronRight, BookOpen, ExternalLink } from "lucide-react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const ARTICLES = [
  {
    id: 1,
    title: "REST vs GraphQL vs gRPC: The Definitive Guide for 2026",
    excerpt: "A deep technical breakdown of API paradigms. REST for most, GraphQL for complex data, gRPC for internal microservices—and why the answer is usually all three.",
    tag: "API Architecture",
    tagColor: "#22c55e",
    date: "May 6, 2026",
    readTime: "9 min read",
    source: "1xAPI Blog",
    sourceUrl: "https://1xapi.com/blog/rest-vs-graphql-api-architecture-2026",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    featured: true,
    content: `REST, GraphQL, and gRPC aren't competing standards—they're tools with different strengths. In 2026, most mature engineering teams use all three. Choosing the right one depends on your consumers, not the hype.

## REST: Still the Default for Good Reason

REST maps naturally to HTTP semantics and is universally understood. Every language has mature client libraries, caching works out of the box, and the mental model maps directly to CRUD operations.

When REST wins: public APIs consumed by many different clients, CRUD-heavy applications, and any system where HTTP caching matters. The ecosystem support from all API gateways is unmatched.

When REST struggles: complex queries requiring data from multiple resources create N+1 problems. Mobile clients on constrained networks suffer from over-fetching.

## GraphQL: The Right Tool for Complex Data

GraphQL exposes a single endpoint that accepts client-defined queries. This solves the over-fetching problem and dramatically reduces API round-trips for complex UIs.

According to Apollo's 2026 enterprise survey, 73% of organizations running GraphQL in production use it alongside REST rather than as a complete replacement—often in a Backend-for-Frontend (BFF) pattern. This lets teams keep their battle-tested REST services while giving frontend developers flexible querying capabilities.

When GraphQL wins: applications with complex nested data relationships, mobile clients where bandwidth matters, and products where the frontend evolves faster than the backend.

When GraphQL struggles: simple CRUD applications where it's overkill, and HTTP caching which doesn't work naturally with single-endpoint designs.

## gRPC: Extreme Performance for Internal Services

gRPC uses Protocol Buffers over HTTP/2, delivering binary serialization, bidirectional streaming, and strongly-typed contracts. The performance gains over REST are substantial—typically 5-10x smaller payloads and much lower latency.

When gRPC wins: microservices communicating with each other, high-throughput and low-latency requirements, and streaming data pipelines.

When gRPC struggles: browser-based clients (gRPC-Web adds complexity), public APIs where developer experience matters, and debugging since the binary format isn't human-readable.

## The Pragmatic Answer

For most modern web applications, REST for public traffic combined with GraphQL or gRPC for selected internal services is the right architecture. REST remains the standard—if you're building a business API in 2026, it's your default unless you have a specific reason to deviate. AI tooling has reduced API development timelines by 20-30% compared to 2024, but the fundamental architecture decisions still matter for long-term maintainability.`,
  },
  {
    id: 2,
    title: "LLM APIs in Production: OpenAI, Anthropic, Gemini Compared",
    excerpt: "A practical comparison of production LLM APIs in 2026—latency, cost, context windows, streaming patterns, and the multi-provider routing strategy that cuts costs 60-80%.",
    tag: "AI & LLMs",
    tagColor: "#a855f7",
    date: "May 5, 2026",
    readTime: "10 min read",
    source: "MyEngineeringPath",
    sourceUrl: "https://myengineeringpath.dev/genai-engineer/api-integration-basics/",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    featured: false,
    content: `LLM API integration is the first practical skill every GenAI engineer needs. In 2026, there are four enterprise-grade providers with distinct tradeoffs—and the right architecture uses all of them intelligently.

## The Multi-Provider Landscape

OpenAI, Anthropic, Google, and Mistral have all reached enterprise maturity. The fragmentation means managing multiple API keys, billing accounts, and integration code—unless you use a routing layer like OpenRouter, which provides access to 500+ models through one OpenAI-compatible endpoint.

## OpenAI (GPT-4o, o-series)

Still the default for most teams. The API surface is the most battle-tested, the tooling ecosystem is the largest, and GPT-4o strikes an excellent balance of speed and capability. Best for general-purpose production applications.

## Anthropic (Claude Sonnet 4.6, Opus 4.6)

The strongest option for long-context, instruction-following, and complex reasoning. 200K context window in production. Claude Haiku costs roughly $0.25 per million input tokens, Sonnet around $3, and Opus around $15. Excellent for document processing and multi-step agentic tasks. Anthropic offers MCP support for seamless tool integration—agents are becoming standard features rather than experimental add-ons.

## Google Gemini 3

Best-in-class for multimodal tasks. Native audio, video, and code understanding. The Flash model is the fastest sub-$1 option in the market, making it ideal for high-throughput pipelines where latency matters.

## The Cost Optimization Strategy

Model routing is the single biggest cost lever. Route 80% of simple queries to small models (Claude Haiku or GPT-4o-mini) and only 20% of complex tasks to larger models. This cuts costs 60-80% with minimal quality loss. A typical application processing 1,000 requests per day with short prompts costs $30-50/month using a mixed model strategy.

## Streaming: Non-Negotiable for UX

A non-streaming LLM response with a 3-second completion time feels broken. The same response streamed token-by-token feels alive. Streaming reduces perceived latency from 3-5 seconds to under 500ms. Both Anthropic and OpenAI SDKs support streaming with simple API changes. Always implement AbortController to cancel in-flight requests—this avoids billing for tokens that will never be rendered.

## Production Error Handling

Implement three layers: retry with exponential backoff for transient errors (429s and 5xx), multi-provider fallback so if one provider is down you route to another, and graceful degradation returning a cached response if all providers fail. Use the circuit breaker pattern to avoid hammering a failing provider.`,
  },
  {
    id: 3,
    title: "API Security in 2026: The OWASP Top 10 Threats Still Breaking Production",
    excerpt: "BOLA, mass assignment, broken auth, rate limiting failures—the vulnerabilities teams keep shipping in 2026 and the fixes that actually prevent breaches.",
    tag: "API Security",
    tagColor: "#ef4444",
    date: "May 3, 2026",
    readTime: "9 min read",
    source: "Elysiate + OWASP",
    sourceUrl: "https://www.elysiate.com/blog/api-security-owasp-top-10-prevention-guide-2025",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    featured: false,
    content: `The OWASP API Security Top 10 has been published since 2019. In 2026, engineering teams are still shipping every vulnerability on the list. The problem isn't awareness—it's prioritization. Security feels like overhead until there's a breach.

## BOLA: The #1 API Vulnerability

Broken Object Level Authorization sits at the top of the list for the third consecutive cycle. It occurs when an API fails to verify that the requesting user has permission to access a specific object.

The attack is trivially simple: an attacker changes /api/orders/1023 to /api/orders/1024 and gains access to another user's data without any authentication challenge. Real-world examples include the Uber (2016), Facebook (2018), and Trello (2024) breaches, all of which exposed millions of users' PII through basic ID enumeration.

The fix: never assume an ID in the URL is authorized. Always cross-reference the authenticated user's ownership at the server before returning data. Use UUIDs instead of sequential integers for object IDs.

## Mass Assignment

Backend frameworks that automatically map JSON fields to database models create a critical attack surface. An attacker adds isAdmin: true or price: 0 to a request payload. Your API maps it directly to the model.

The fix: use an allowlist of accepted fields. Never pass raw request bodies to ORM save methods.

## Broken Authentication

Nearly 30% of API incidents involve broken authentication. Weak JWT secrets, missing token expiration, and tokens that can't be revoked after logout are the most common failures.

JWT hardening checklist: HS256 secret should be 256 bits minimum and randomly generated, access tokens should expire in 15 minutes with refresh tokens at 7 days, implement token blacklist or short-lived tokens with refresh rotation.

## Unrestricted Resource Consumption

With AI-augmented applications making multiple API calls per user interaction, resource exhaustion is a bigger threat than ever. A single AI feature with no rate limiting can collapse an entire backend under modest traffic.

At minimum, implement per-IP and per-authenticated-user limits on all endpoints. Return Retry-After headers on 429 responses—a raw 429 with no context is a sign of lazy implementation.

## Defense in Depth

The strongest defense is never a single control. Attackers chain weaknesses: a stolen token plus a BOLA flaw to extract data across thousands of IDs. Apply authorization, authentication, rate limiting, and input validation at every layer. Treat security testing as a pipeline step, not a pre-launch scramble.`,
  },
  {
    id: 4,
    title: "Building Production-Ready APIs: The 7-Step Engineering Process",
    excerpt: "From requirements through monitoring—the disciplined development process that turns specifications into stable, scalable APIs ready for real traffic.",
    tag: "API Development",
    tagColor: "#22c55e",
    date: "May 8, 2026",
    readTime: "8 min read",
    source: "Monocubed",
    sourceUrl: "https://www.monocubed.com/blog/backend-api-development/",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80",
    featured: false,
    content: `A reliable backend API doesn't start with code. It starts with a clear process. The seven steps below cover everything from requirements through monitoring, mapping the modern backend development process that turns specifications into stable, scalable APIs ready for production.

## Step 1: Define Consumers and Contracts

Before writing a single endpoint, define who will consume the API, what data it must expose, and what business rules it must enforce. Write the OpenAPI spec before writing implementation code—spec-first development forces you to think about the API surface before you're deep in implementation details that make changes expensive.

## Step 2: Choose the Right Architecture

REST remains the best choice for most web and mobile applications. GraphQL excels when clients need flexible, efficient data fetching. gRPC is ideal for internal microservices requiring high performance. For most startups, REST is the better default—faster to build, cheaper to maintain, and every developer understands it.

## Step 3: Authentication and Authorization Strategy

Design auth before writing business logic. OAuth 2.0 with PKCE for user-facing applications, Client Credentials for machine-to-machine. Never design auth as an afterthought—retrofitting it creates the broken authentication patterns that appear in the OWASP Top 10.

## Step 4: Data Modeling and Validation

Strong input validation at the API boundary. Never trust request data. Parameterized queries everywhere. Define strict schemas for request and response bodies—then enforce them.

## Step 5: Error Handling as a First-Class Concern

A list of error codes is not documentation. Every error should tell the consumer: what went wrong, which field caused it, what format was expected, and what to do next. Design error responses before writing business logic.

## Step 6: Performance Baselines

Establish P50, P95, and P99 latency targets before launch. Set up load testing with k6 or Artillery against realistic scenarios—not just simple GET requests against /ping. Your database will be the bottleneck at scale; run EXPLAIN ANALYZE on your slowest queries before launch.

## Step 7: Observability from Day One

Structured logging, distributed tracing, and alerting on error rate spikes aren't post-launch concerns. Wire them in during development. The APIs that survive production incidents are the ones with the best observability—not the best code.`,
  },
  {
    id: 5,
    title: "OpenAPI Specs Are Infrastructure, Not Documentation",
    excerpt: "How a high-quality OpenAPI spec unlocks auto-generated SDKs, mock servers, contract testing, type safety, and interactive documentation—and why spec-first development changes everything.",
    tag: "Developer Experience",
    tagColor: "#f59e0b",
    date: "Apr 29, 2026",
    readTime: "6 min read",
    source: "Postman Blog",
    sourceUrl: "https://blog.postman.com/api-security-best-practices/",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
    featured: false,
    content: `Most teams treat their OpenAPI spec as documentation—something you generate from code and publish to a docs site. The teams building the best developer experiences treat it as infrastructure.

## What a Great Spec Unlocks

Client SDKs in 20+ languages, auto-generated from your spec. Update the spec, regenerate the SDKs—no manual maintenance. Mock servers that let frontend teams work without waiting for backend implementation. Contract testing that catches spec drift as a CI failure before deployment.

TypeScript types generated directly from your API spec mean the client types are always in sync with the server. Stoplight, Readme, and Redoc generate beautiful interactive documentation automatically.

## Spec-First Development

The biggest unlock is writing the OpenAPI spec before writing implementation code. This forces you to think about the API surface before you're deep in implementation details. It's the API design equivalent of writing tests first—decisions made in the spec phase are cheap; decisions made after deployment are expensive.

Machine-readable specs are proof that the team treats documentation as code. They also mean you can auto-generate client SDKs, mock servers, and integration tests—a force multiplier that pays dividends for the entire lifecycle of the API.

## Common Pitfalls

Auto-generating specs from code produces mediocre output. Write them deliberately. Incomplete error schemas make the spec useless for generating error handling code. Missing examples make the spec less useful for mock servers and documentation. The spec should be the single source of truth—not an afterthought.

## The Documentation Gap

Most API documentation is written for the person who built the API, not for the developer trying to use it. The five most common failures: example responses that don't reflect actual production responses, auth flows described incorrectly, rate limits without context on window type and scope, error codes without actionable guidance, and no changelog. A great OpenAPI spec fixes all five.`,
  },
  {
    id: 6,
    title: "Webhook Systems That Actually Work in Production",
    excerpt: "Signature verification, idempotency, async queuing, out-of-order delivery—the complete engineering guide to building and consuming webhooks that survive real traffic.",
    tag: "Webhooks",
    tagColor: "#f97316",
    date: "May 1, 2026",
    readTime: "8 min read",
    source: "Apives Guide",
    sourceUrl: "#",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    featured: false,
    content: `Webhooks are not HTTP requests. That sounds obvious, but most webhook consumer bugs come from treating them like normal API calls. They arrive unpredictably, can be retried multiple times, and can arrive out of order.

## The Rule: Acknowledge Immediately, Process Asynchronously

Your webhook endpoint must respond with 200 OK within 3-5 seconds. If processing takes longer, the provider retries—creating duplicate events. The correct pattern: verify the signature, push the raw payload to a queue (SQS, BullMQ, Sidekiq), return 200 immediately, then process asynchronously with idempotency checks.

## Signature Verification Is Non-Negotiable

Before you process anything, verify the webhook signature. Stripe uses HMAC-SHA256. GitHub uses HMAC-SHA256 with X-Hub-Signature-256. Verify or reject—no middle ground. Signature verification must be the first line of your handler, before any database queries. Include the timestamp in the signed payload to prevent replay attacks.

## Idempotency: Design for Duplicates

Every webhook provider retries on failure. Your consumer will receive the same event multiple times—design for it. Use the webhook event ID as an idempotency key. Store processed event IDs. Check before processing. Never assume an event will arrive exactly once.

## Out-of-Order Delivery

Webhooks don't arrive in order. A payment.updated event can arrive before payment.created. Design your state machine to handle this, or use event timestamps to determine canonical state. Don't assume sequence.

## Building a First-Class Webhook System

If you're building webhooks for your own API, the right architecture separates event generation from delivery entirely. Your application logic creates an event record with status PENDING. A separate async worker picks up PENDING events and attempts delivery. On 2xx, mark DELIVERED. On failure, schedule retry with exponential backoff: 10s, 30s, 2m, 10m, 1h, 6h, 24h, 48h—then disable the endpoint after the final retry. Great webhook DX requires delivery logs, one-click retry, and a webhook explorer with full request/response history.`,
  },
  {
    id: 7,
    title: "OAuth 2.0 Flows That Actually Matter: PKCE, Client Credentials, and Why Implicit Is Dead",
    excerpt: "A developer-focused breakdown of the OAuth 2.0 flows teams actually need—with implementation patterns, security reasoning, and silent refresh strategy for production.",
    tag: "Authentication",
    tagColor: "#06b6d4",
    date: "Apr 28, 2026",
    readTime: "8 min read",
    source: "Apives Deep Dive",
    sourceUrl: "#",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    featured: false,
    content: `Most developers implement one OAuth flow and treat it as the universal solution. The four OAuth flows exist because they solve different problems. Using the wrong one creates security vulnerabilities, not just inefficiency.

## Authorization Code with PKCE: The Browser and Mobile Flow

Use this for any application where you're acting on behalf of a user in an environment you don't fully control—browser, mobile app, or SPA.

PKCE (Proof Key for Code Exchange) replaces the client secret for public clients. You generate a code_verifier, hash it to create a code_challenge, and send the challenge during the auth request. The server verifies the code_verifier at token exchange time. This prevents authorization code interception attacks—a real threat in mobile environments.

PKCE is now recommended even for confidential clients (server-side web apps). There's no downside to using it and meaningful security improvements.

## Client Credentials: Machine-to-Machine

No user involved. Your backend service exchanges its credentials for an access token to call another service. This is the correct pattern for microservices, scheduled jobs, backend integrations, and any M2M communication. Never use Authorization Code flow for server-to-server calls.

## Silent Refresh Strategy

Access tokens should expire in 15-60 minutes. Implement silent refresh: when the access token approaches expiration, automatically exchange the refresh token without user interaction. This keeps sessions alive without forcing re-authentication. Use refresh token rotation—each use of a refresh token issues a new one and invalidates the old, preventing token reuse after compromise.

## Implicit Flow: Deprecated, Do Not Use

The implicit flow returns access tokens directly in URL fragments. This is a security problem—tokens in URL fragments appear in browser history, referrer headers, and server logs. It's in the spec for historical reasons only. Any new implementation should use Authorization Code with PKCE instead.

## The JWT Hardening Checklist

HS256 secret: 256 bits minimum, randomly generated, rotated on a schedule. Never hardcode in source. Expiration: always set exp claim. Access token 15 minutes, refresh token 7 days. Implement a token blacklist or use short-lived tokens with refresh rotation to support logout. Validate iss and aud claims—not just the signature.`,
  },
  {
    id: 8,
    title: "GraphQL at Scale: Subscriptions, DataLoader, and the N+1 Trap",
    excerpt: "What production GraphQL actually looks like—subscription architecture for 1M+ connections, DataLoader patterns that prevent database meltdown, and the memory leaks nobody warns you about.",
    tag: "GraphQL",
    tagColor: "#e91e96",
    date: "Mar 28, 2026",
    readTime: "8 min read",
    source: "tech-insider.org",
    sourceUrl: "https://tech-insider.org/graphql-tutorial-nodejs-apollo-server-2026/",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    featured: false,
    content: `GraphQL subscriptions are the most powerful and most treacherous feature in the ecosystem. They enable real-time data synchronization with clean developer experience. They also create persistent connections that don't scale like stateless HTTP requests.

## The Architecture That Works at Scale

Don't run subscriptions on your primary GraphQL server. Persistent WebSocket connections starve request-handling capacity under load. The correct architecture: a separate subscription service (stateful, WebSocket-native), an event bus between mutation handlers and the subscription server (Redis Pub/Sub or Kafka), and a load balancer with sticky sessions.

## Automatic Persisted Queries for Performance

APQ replaces full query strings with short SHA-256 hashes, reducing request payload size by 80-90%. Apollo Server 4 supports APQ out of the box. For high-traffic endpoints, this is a significant bandwidth and latency win.

## The N+1 Problem, Amplified

Every subscription resolver has the same N+1 risk as query resolvers—but it fires repeatedly on every event. A subscription that triggers 10 database queries per event at 1000 events/second is 10,000 database queries per second. Use DataLoader caching aggressively. Be extremely careful about what data you resolve on each event emission.

## Memory Leaks Are Subscription-Specific

The most common production issue: subscription resolvers that don't clean up after themselves when a client disconnects. Always return a cleanup function from your subscribe resolver. Without it, you accumulate dead subscriptions that still receive events and still execute resolver code against your database.

## Connection Lifecycle Management

Every connection must implement: heartbeat/keep-alive (30-60 second ping/pong), inactivity timeout (disconnect after 5 minutes of no subscription activity), authentication refresh (subscriptions outlive JWT token lifetimes), and graceful reconnection logic on the client. Missing any one of these creates subtle production failures that only appear under sustained load.`,
  },
  {
    id: 9,
    title: "How to Load Test Your API Before It Matters",
    excerpt: "k6, Artillery, and Locust compared—how to design realistic test scenarios, interpret P95 and P99 results, and fix the database bottlenecks that only appear under real load.",
    tag: "API Testing",
    tagColor: "#10b981",
    date: "Apr 5, 2026",
    readTime: "6 min read",
    source: "Apives Engineering",
    sourceUrl: "#",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&q=80",
    featured: false,
    content: `The dirty secret of production APIs: most have never been load tested. Developers write unit tests, integration tests, maybe end-to-end tests. Load testing gets skipped because it's "not a priority" until there's a production incident that costs more than six months of engineering time.

## Tool Selection

k6 is the modern choice for most teams. JavaScript-based test scripts, excellent CLI, Grafana integration, and cloud execution available. The developer experience is the best in class.

Artillery is YAML-based with good tooling for simulating complex user journeys. Better choice for teams that prefer configuration over code.

Locust is Python-based and highly customizable. Best for teams with complex testing requirements or where Python is the team's primary language.

## Designing Meaningful Scenarios

A load test that sends a thousand identical GET requests to /ping is useless. Realistic load tests mix read and write operations proportional to your actual traffic, include authentication with real JWT tokens, test your most expensive endpoints (not your simplest), and include the data setup and teardown your real users trigger.

## The Metrics That Actually Matter

Latency at P95 and P99—not average. Average latency hides the spikes that kill user experience. Error rate under load (target: 0% for 2xx, monitor 5xx closely). Throughput ceiling: at what requests-per-second does latency degrade? Database connection pool exhaustion—the first thing to hit its limit under sustained load.

## The Most Common Finding

Your database is the bottleneck. N+1 queries that are invisible at low traffic become catastrophic at scale. Always run EXPLAIN ANALYZE on your slowest queries after a load test. Add indexes on columns used in WHERE clauses and JOINs. Connection pooling configuration matters more than most teams realize.`,
  },
  {
    id: 10,
    title: "Serverless Platforms for APIs in 2026: AWS Lambda vs Cloudflare Workers vs Vercel",
    excerpt: "A practical comparison of the three dominant API platforms—cold starts, pricing at scale, developer experience, and which one to choose for latency-critical public APIs.",
    tag: "Cloud & Infra",
    tagColor: "#0ea5e9",
    date: "Apr 15, 2026",
    readTime: "8 min read",
    source: "Apives Platform Guide",
    sourceUrl: "#",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80",
    featured: false,
    content: `Where you run your API isn't just an infrastructure decision—it determines your cold start behavior, global latency profile, operational overhead, and pricing structure at scale.

## AWS Lambda + API Gateway

The original serverless. Mature, infinitely flexible, and deeply integrated with the rest of the AWS ecosystem.

Cold starts: 100-800ms depending on runtime. Lambda SnapStart for Java dramatically improves this. Pricing at $0.20 per million requests plus duration is predictable. Best for teams already in AWS, applications needing VPC access, and complex enterprise requirements.

Operational overhead is higher than alternatives—VPC configuration, IAM policies, and API Gateway limits require real expertise to configure correctly.

## Cloudflare Workers

Runs at the edge in 300+ locations. V8 isolates eliminate cold starts entirely—near-zero latency startup versus full VM instantiation. Priced at $5/month for 10 million requests. Extremely cost-effective.

Constraints: no Node.js standard library, 128MB memory limit, CPU time limits. These matter for complex business logic but are irrelevant for edge routing, auth middleware, and API gateways.

Best for: latency-critical public APIs, API gateways, auth middleware, and globally distributed workloads where edge proximity matters.

## Vercel Functions

The best developer experience in the market. Deploy your entire application—frontend and API—with one git push. Cold starts of 50-200ms, better than Lambda but worse than Cloudflare. Generous free tier that scales to Enterprise plans.

Best for: Next.js applications, full-stack TypeScript teams, and any project where shipping velocity matters more than raw performance optimization.

## The Right Answer

For latency-critical public APIs: Cloudflare Workers. For complex backend logic with AWS ecosystem dependencies: Lambda. For full-stack applications: Vercel. Most production systems end up using more than one.`,
  },
  {
    id: 11,
    title: "Why Apives Verifies Every API Before Listing",
    excerpt: "The multi-stage technical process behind Apives' API quality system—endpoint reachability, auth verification, response schema validation, uptime monitoring, and what gets rejected.",
    tag: "About Apives",
    tagColor: "#22c55e",
    date: "Apr 21, 2026",
    readTime: "5 min read",
    source: "Apives",
    sourceUrl: "#",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    featured: false,
    content: `Any website can list APIs. The hard part—the part that actually helps developers—is knowing which ones work. Apives runs a multi-stage verification process on every API before it appears in the directory.

## Why Verification Matters

Most API directories are static lists. Someone submits an API, it gets a card with a description and a link, and that's it. Nobody verifies whether the API actually works right now, whether the auth method described is current, whether pricing has changed, or whether endpoints return what they claim to return. Developers spend hours integrating APIs that are broken in production. Apives exists to solve that.

## Stage 1: Endpoint Reachability

The first check verifies that documented endpoints respond. We check HTTP status codes, response times, SSL certificate validity, and CORS headers. Endpoints that don't respond get flagged immediately.

## Stage 2: Authentication Verification

We verify that the documented authentication method actually works with both valid and invalid credentials. OAuth flows, API keys, and JWT-based auth are all tested against the documented specification.

## Stage 3: Response Schema Validation

We compare actual response schemas against what documentation claims. Any mismatch—extra fields, missing fields, wrong types—gets flagged. This is the most common failure point in the directory: documentation that describes a response with five fields while the real response has twelve.

## Stage 4: Continuous Uptime Monitoring

After passing initial verification, every API enters continuous monitoring: health checks every 5 minutes, P50/P95/P99 latency tracking, and 30-day and 90-day uptime calculations. Uptime data is displayed on every listing—not vendor marketing copy, but real measurements.

## What Gets Rejected

APIs with uptime below 99% over 30 days, documentation with more than 20% inaccuracy against actual responses, no clear pricing information, or authentication flows that don't match documentation are rejected from the directory.

The result: a smaller catalog of verified, working APIs—more valuable than a massive catalog full of noise. Developers don't need ten thousand options. They need five great ones.`,
  },
];

const FILTERS = [
  "All", "API Architecture", "AI & LLMs", "API Security", "API Development",
  "Developer Experience", "Webhooks", "Authentication", "GraphQL",
  "API Testing", "Cloud & Infra", "About Apives",
];

// ── RENDER CONTENT ────────────────────────────────────────────────────────────
function renderContent(text) {
  const lines = text.trim().split("\n");
  const elements = [];
  let listBuffer = [];

  const parseBold = (str, keyPrefix) =>
    str.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={`${keyPrefix}-b${i}`} style={{ color: "#d1d5db", fontWeight: 600 }}>{part.slice(2, -2)}</strong>
        : part
    );

  const flushList = (key) => {
    if (!listBuffer.length) return;
    elements.push(
      <ul key={`ul-${key}`} style={{ margin: "12px 0 18px 0", padding: 0, listStyle: "none" }}>
        {listBuffer.map((item, j) => (
          <li key={j} style={{ display: "flex", gap: "10px", color: "#9ca3af", fontSize: "14.5px", lineHeight: "1.75", marginBottom: "7px" }}>
            <span style={{ color: "#22c55e", marginTop: "2px", flexShrink: 0 }}>›</span>
            <span>{parseBold(item, `li-${key}-${j}`)}</span>
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  lines.forEach((line, i) => {
    if (line.startsWith("## ")) {
      flushList(i);
      elements.push(
        <h2 key={i} style={{ fontSize: "19px", fontWeight: 700, color: "#f9fafb", marginTop: "38px", marginBottom: "12px", letterSpacing: "-0.4px", lineHeight: 1.3 }}>
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList(i);
      elements.push(<div key={i} style={{ height: "8px" }} />);
    } else {
      flushList(i);
      elements.push(
        <p key={i} style={{ color: "#9ca3af", fontSize: "14.5px", lineHeight: "1.8", margin: "4px 0" }}>
          {parseBold(line, `p-${i}`)}
        </p>
      );
    }
  });

  flushList("end");
  return elements;
}

// ── ARTICLE MODAL ─────────────────────────────────────────────────────────────
function ArticleModal({ article, onClose, articles, onSelect }) {
  const scrollRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => { cancelAnimationFrame(raf); document.body.style.overflow = ""; };
  }, [article]);

  const handleClose = () => { setVisible(false); setTimeout(onClose, 220); };

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const onScroll = (e) => {
    const el = e.currentTarget;
    const h = el.scrollHeight - el.clientHeight;
    setReadProgress(h > 0 ? Math.min(100, (el.scrollTop / h) * 100) : 0);
  };

  const related = articles
    .filter((a) => a.id !== article.id && a.tag === article.tag).slice(0, 2)
    .concat(articles.filter((a) => a.id !== article.id && a.tag !== article.tag).slice(0, 1));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", justifyContent: "flex-end" }}>
      <div
        onClick={handleClose}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", opacity: visible ? 1 : 0, transition: "opacity 0.22s ease" }}
      />
      <div
        ref={scrollRef}
        onScroll={onScroll}
        style={{
          position: "relative", zIndex: 10, width: "100%", maxWidth: "680px",
          height: "100vh", overflowY: "auto", background: "#080b0e",
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          transform: visible ? "translateX(0)" : "translateX(40px)",
          opacity: visible ? 1 : 0, transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Progress bar */}
        <div style={{ position: "sticky", top: 0, height: "2px", background: "rgba(255,255,255,0.05)", zIndex: 30 }}>
          <div style={{ height: "100%", width: `${readProgress}%`, background: "linear-gradient(90deg,#16a34a,#4ade80)", transition: "width 0.1s linear" }} />
        </div>

        {/* Sticky header */}
        <div style={{ position: "sticky", top: "2px", zIndex: 20, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,11,14,0.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "10px", fontWeight: 600, padding: "3px 10px", borderRadius: "99px", color: article.tagColor, background: `${article.tagColor}15`, border: `1px solid ${article.tagColor}30`, letterSpacing: "0.02em" }}>
              {article.tag}
            </span>
            <span style={{ fontSize: "10px", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={9} />{article.readTime}
            </span>
          </div>
          <button
            onClick={handleClose}
            style={{ width: "30px", height: "30px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", cursor: "pointer", color: "#6b7280" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#f3f4f6"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#6b7280"; }}
          >
            <X size={13} />
          </button>
        </div>

        {/* Hero image */}
        <div style={{ height: "260px", overflow: "hidden", position: "relative" }}>
          <img src={article.image} alt={article.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,#080b0e 0%,transparent 60%)" }} />
          <div style={{ position: "absolute", bottom: "24px", left: "28px", right: "28px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#f9fafb", lineHeight: 1.2, letterSpacing: "-0.5px", margin: 0 }}>{article.title}</h1>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px 80px" }}>
          <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.65", marginBottom: "28px", paddingBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {article.excerpt}
          </p>

          <div>{renderContent(article.content)}</div>

          {/* Source */}
          {article.sourceUrl !== "#" && (
            <div style={{ marginTop: "36px", padding: "16px 18px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "10px", color: "#4b5563", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "3px" }}>Source & Further Reading</p>
                <p style={{ fontSize: "13px", color: "#9ca3af" }}>{article.source}</p>
              </div>
              <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11.5px", fontWeight: 600, color: "#22c55e", textDecoration: "none" }}>
                Visit Source <ExternalLink size={10} />
              </a>
            </div>
          )}

          {/* Related */}
          <div style={{ marginTop: "40px", paddingTop: "28px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <p style={{ fontSize: "9px", fontWeight: 700, color: "#4b5563", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "14px" }}>Continue Reading</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {related.slice(0, 3).map((a) => (
                <button
                  key={a.id}
                  onClick={() => { onSelect(a); scrollRef.current?.scrollTo(0, 0); setReadProgress(0); }}
                  style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "12px", cursor: "pointer", textAlign: "left", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", transition: "all 0.15s", outline: "none", fontFamily: "inherit", width: "100%" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                >
                  <div style={{ width: "44px", height: "44px", borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
                    <img src={a.image} alt={a.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7)" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "12.5px", fontWeight: 600, color: "#e5e7eb", lineHeight: 1.35, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "3px" }}>{a.title}</p>
                    <p style={{ fontSize: "10px", color: "#4b5563" }}>{a.tag} · {a.readTime}</p>
                  </div>
                  <ChevronRight size={13} style={{ color: "#4b5563", flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ARTICLE CARD ──────────────────────────────────────────────────────────────
const ArticleCard = memo(function ArticleCard({ article, onClick, index }) {
  const [hovered, setHovered] = useState(false);
  const isFeatured = article.featured;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block", width: "100%", textAlign: "left", cursor: "pointer", outline: "none",
        borderRadius: "16px", overflow: "hidden", position: "relative",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)"}`,
        background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.4),0 0 0 1px rgba(255,255,255,0.08)" : "0 4px 20px rgba(0,0,0,0.2)",
        transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)",
        fontFamily: "inherit",
        animation: "fadeUp 0.5s ease both",
        animationDelay: `${index * 60}ms`,
        gridColumn: isFeatured ? "1 / -1" : "auto",
      }}
    >
      {/* Image */}
      <div style={{ height: isFeatured ? "320px" : "190px", overflow: "hidden", position: "relative" }}>
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${hovered ? 0.65 : 0.5})`, transform: hovered ? "scale(1.04)" : "scale(1)", transition: "all 0.5s ease" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(8,11,14,0.98) 0%,rgba(8,11,14,0.4) 50%,transparent 100%)" }} />
        <div style={{ position: "absolute", top: "14px", left: "14px" }}>
          <span style={{ fontSize: "9.5px", fontWeight: 600, padding: "4px 10px", borderRadius: "99px", color: article.tagColor, background: "rgba(8,11,14,0.75)", border: `1px solid ${article.tagColor}40`, backdropFilter: "blur(12px)", letterSpacing: "0.04em" }}>
            {article.tag}
          </span>
        </div>
        {isFeatured && (
          <div style={{ position: "absolute", top: "14px", right: "14px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, padding: "4px 10px", borderRadius: "99px", color: "#fbbf24", background: "rgba(8,11,14,0.75)", border: "1px solid rgba(251,191,36,0.3)", backdropFilter: "blur(12px)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: isFeatured ? "22px 24px 20px" : "16px 18px 16px" }}>
        <h3 style={{ fontSize: isFeatured ? "18px" : "13.5px", fontWeight: 700, color: hovered ? "#ffffff" : "#f3f4f6", lineHeight: 1.3, marginBottom: "8px", letterSpacing: "-0.3px", transition: "color 0.15s", fontFamily: "inherit", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {article.title}
        </h3>
        <p style={{ fontSize: "11.5px", color: "#4b5563", lineHeight: "1.6", marginBottom: "14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {article.excerpt}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "10px", color: "#374151" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "3px" }}><Clock size={9} />{article.readTime}</span>
            <span style={{ color: "#1f2937" }}>·</span>
            <span>{article.date}</span>
          </div>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10.5px", fontWeight: 600, color: article.tagColor, opacity: hovered ? 1 : 0.7, transition: "opacity 0.15s" }}>
            Read <ArrowRight size={9} style={{ transform: hovered ? "translateX(2px)" : "none", transition: "transform 0.15s" }} />
          </span>
        </div>
      </div>
    </button>
  );
});

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ApivesBlog() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = ARTICLES.filter((a) => {
    const matchTag = activeFilter === "All" || a.tag === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.tag.toLowerCase().includes(q);
    return matchTag && matchSearch;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #07090c; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #07090c; }
        ::-webkit-scrollbar-thumb { background: #1a2a1e; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #22c55e; }
        .filter-scroll::-webkit-scrollbar { display: none; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .filter-btn:hover { background: rgba(255,255,255,0.06) !important; border-color: rgba(255,255,255,0.14) !important; color: #d1d5db !important; }
        input::placeholder { color: #374151; }
      `}</style>

      <div style={{ fontFamily: "'DM Sans',-apple-system,sans-serif", background: "#07090c", minHeight: "100vh", color: "#f9fafb" }}>

        {/* Background glows */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "-200px", right: "-100px", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle,rgba(34,197,94,0.06) 0%,transparent 65%)" }} />
          <div style={{ position: "absolute", top: "50%", left: "-200px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.04) 0%,transparent 65%)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>

          {/* ── HERO ── */}
          <section style={{ paddingTop: "80px", paddingBottom: "64px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 24px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 14px", borderRadius: "99px", border: "1px solid rgba(34,197,94,0.2)", background: "rgba(34,197,94,0.06)", marginBottom: "28px", animation: "fadeIn 0.5s ease both" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.6)" }} />
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#22c55e", letterSpacing: "0.05em" }}>APIVES BLOG</span>
              </div>

              <h1 style={{
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "clamp(36px,5.5vw,58px)",
  fontWeight: 900,
  lineHeight: 0.98,
  letterSpacing: "-3px",
  marginBottom: "18px",
  animation: "fadeUp 0.5s ease 0.05s both",
  textTransform: "none",
  WebkitFontSmoothing: "antialiased",
  textRendering: "optimizeLegibility"
}}>
                The blog for{" "}
                <span
style={{
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 900,
  letterSpacing: "-3px",
  background: "linear-gradient(135deg,#22c55e,#4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>API-first</span>
                {" "}developers.
              </h1>

              <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: "1.65", marginBottom: "36px", animation: "fadeUp 0.5s ease 0.1s both" }}>
                Verified guides, honest comparisons, and practical insights for building with APIs in production.
              </p>

              {/* Search */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap", animation: "fadeUp 0.5s ease 0.15s both" }}>
                <div style={{ position: "relative" }}>
                  <Search size={13} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#22c55e", pointerEvents: "none" }} />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "99px", paddingLeft: "38px", paddingRight: searchQuery ? "36px" : "18px", paddingTop: "11px", paddingBottom: "11px", fontSize: "13px", color: "#e5e7eb", width: "240px", outline: "none", fontFamily: "inherit", transition: "all 0.15s" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)"; e.currentTarget.style.background = "rgba(34,197,94,0.04)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#4b5563", display: "flex" }}>
                      <X size={12} />
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "#374151" }}>
                  <BookOpen size={11} style={{ color: "#22c55e" }} />
                  <span style={{ color: "#4b5563" }}>{ARTICLES.length} articles</span>
                  <span style={{ color: "#1f2937" }}>·</span>
                  <span style={{ color: "#22c55e", fontWeight: 600 }}>All verified</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── FILTER STRIP ── */}
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(7,9,12,0.8)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 28px" }}>
              <div className="filter-scroll" style={{ overflowX: "auto", display: "flex", gap: "4px", padding: "10px 0", whiteSpace: "nowrap" }}>
                {FILTERS.map((f) => {
                  const active = activeFilter === f;
                  return (
                    <button
                      key={f}
                      className={active ? "" : "filter-btn"}
                      onClick={() => setActiveFilter(f)}
                      style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "6px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: 600, border: active ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(255,255,255,0.06)", background: active ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.025)", color: active ? "#22c55e" : "#4b5563", cursor: "pointer", transition: "all 0.15s", outline: "none", fontFamily: "inherit", whiteSpace: "nowrap", letterSpacing: "0.01em" }}
                    >
                      {active && <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />}
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── GRID ── */}
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 28px 100px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "2px", height: "14px", borderRadius: "99px", background: "#22c55e" }} />
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "14px", fontWeight: 700, color: "#9ca3af", letterSpacing: "-0.2px" }}>
                  {searchQuery ? `"${searchQuery}"` : activeFilter === "All" ? "All Articles" : activeFilter}
                </span>
                <span style={{ fontSize: "11px", color: "#374151", padding: "2px 9px", borderRadius: "99px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {filtered.length}
                </span>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <p style={{ color: "#374151", fontSize: "14px", marginBottom: "16px" }}>No articles found for "{searchQuery}"</p>
                <button onClick={() => { setSearchQuery(""); setActiveFilter("All"); }} style={{ fontSize: "12px", padding: "9px 20px", borderRadius: "99px", background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", cursor: "pointer", fontFamily: "inherit" }}>
                  Clear filters
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "16px" }}>
                {filtered.map((a, i) => (
                  <ArticleCard key={a.id} article={a} onClick={() => setSelectedArticle(a)} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
            articles={ARTICLES}
            onSelect={setSelectedArticle}
          />
        )}
      </div>
    </>
  );
}
