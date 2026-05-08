import { useState, useEffect, useRef } from "react";
import {
  Search, Clock, ArrowRight, X,
  ChevronRight, Layers, Zap, Cpu, Code2, FileText,
  Rocket, BarChart2, BookOpen, Swords, Star, Shield,
  Webhook, DollarSign, Lock, Database, Cloud, TestTube2,
  GitBranch, Terminal, Globe, Filter, Flame, Hash,
  CheckCircle2, AlertCircle, ChevronUp, Sparkles,
  LayoutGrid, List, RefreshCw, Activity, Server,
  Package, Wrench, Users, Blocks, Radio, TrendingUp
} from "lucide-react";

// ── Article Data ─────────────────────────────────────────────────────────────
const ARTICLES = [
  {
    id: 1,
    title: "How to Find Reliable APIs Faster Than Ever",
    desc: "A practical guide for developers to avoid broken APIs and save integration time across modern applications.",
    category: "API Discovery",
    read: "5 min read",
    date: "May 6, 2026",
    featured: true,
    accent: "#22c55e",
    Icon: Search,
    content: `## The API Discovery Problem

Every developer has been there. You find what looks like the perfect API—great docs, clean endpoints, free tier. You spend two hours integrating it into your project. Then it breaks in production. Uptime is 94%, docs are six months outdated, and rate limits aren't where they claimed.

This is the API discovery problem, and it's costing engineering teams millions of hours a year.

## Why Existing Directories Fall Short

Most API directories are static lists. Someone submits an API, it gets a card with a description and a link, and that's it. Nobody verifies:

- Whether the API actually works right now
- Whether the auth method described is current
- Whether pricing has changed
- Whether endpoints return what they claim to return

Developers deserve better than that.

## What Makes an API Reliable?

Reliability isn't just uptime. It's a combination of five factors:

**1. Uptime consistency** — Does it stay above 99.5% over 90 days, not just one week?

**2. Documentation accuracy** — Are the example responses real? Are auth flows documented correctly?

**3. Response time** — P95 latency matters more than average. Spikes kill UX.

**4. Breaking change frequency** — How often does the API change without notice?

**5. Support responsiveness** — When something breaks, is there a human on the other side?

## How Apives Solves This

Apives runs automated verification on every listed API. We test endpoints daily, flag inconsistencies between documentation and actual responses, and track uptime over time—not just at submission.

When you search for a weather API on Apives, you see real uptime data, real response times, and verified endpoint examples.

## Practical Tips for Faster Integration

Before you write a single line of integration code:

1. **Check the changelog** — If there isn't one, that's a red flag
2. **Test the auth flow manually** — Before wiring it into your app
3. **Look for community feedback** — GitHub issues tell the real story
4. **Verify rate limits with a burst test** — Don't trust what docs say; test it
5. **Check if there's a sandbox environment** — Production-only APIs are a liability`
  },
  {
    id: 2,
    title: "The 7 Signals That Tell You an API Is Production-Ready",
    desc: "Before you commit to an integration, look for these specific technical and operational signals that separate mature APIs from the rest.",
    category: "API Discovery",
    read: "6 min read",
    date: "Apr 30, 2026",
    featured: false,
    accent: "#22c55e",
    Icon: CheckCircle2,
    content: `## Not All APIs Are Equal

The API ecosystem has thousands of options for almost every category. The difference between a good integration and a nightmare isn't just about features—it's about operational maturity.

## Signal 1: A Public Status Page

Any API worth integrating in production should have a public status page with historical uptime data. If they're hiding this, there's usually a reason.

**What to look for:** 90-day history, incident postmortems, honest reporting of degraded performance—not just full outages.

## Signal 2: Semantic Versioning With Deprecation Timelines

The best APIs communicate breaking changes with at least 6 months of notice and maintain previous versions during the transition period.

## Signal 3: Idempotency Support

For any write operations, the API should support idempotency keys. Without this, network failures become data integrity problems.

## Signal 4: Retry-After Headers

When you hit a rate limit, the API should tell you exactly when to retry. A raw 429 with no context is a sign of lazy implementation.

## Signal 5: Webhook Delivery Guarantees

If the API offers webhooks, they should have retry logic, delivery logs, and signature verification. Webhooks without these are fire-and-forget—unreliable in production.

## Signal 6: OpenAPI/Swagger Spec

A machine-readable spec is proof that the team treats documentation as code. It also means you can auto-generate client SDKs, mock servers, and integration tests.

## Signal 7: Dedicated Developer Relations

APIs maintained by teams with a dedicated DevRel or developer support presence respond faster to issues and ship better documentation.`
  },
  {
    id: 3,
    title: "How Apives Verifies Every API Before Listing",
    desc: "Inside the technical process Apives uses to test API quality, endpoints, uptime, documentation accuracy, and real-world reliability.",
    category: "API Discovery",
    read: "4 min read",
    date: "Apr 21, 2026",
    featured: false,
    accent: "#22c55e",
    Icon: CheckCircle2,
    content: `## Why Verification Matters

Any website can list APIs. The hard part—the part that actually helps developers—is knowing which ones actually work.

Apives runs a multi-stage verification process on every API before it appears in the directory.

## Stage 1: Endpoint Reachability

The first check is simple: do the documented endpoints respond? We verify HTTP status codes, response times, SSL certificate validity, and CORS headers.

## Stage 2: Authentication Verification

We verify that the documented authentication method actually works with valid and invalid credentials.

## Stage 3: Response Schema Validation

We compare actual response schemas against what documentation claims. Any mismatch gets flagged.

## Stage 4: Uptime Monitoring

After passing initial verification, every API enters continuous monitoring with health checks every 5 minutes, P50/P95/P99 latency tracking, and 30-day and 90-day uptime calculations.

## Stage 5: Documentation Completeness Score

We evaluate docs against a rubric covering endpoint coverage, parameter descriptions, error codes, changelog presence, and code examples.

## What Gets Rejected

- Uptime below 99% over 30 days
- Documentation with more than 20% inaccuracy
- No clear pricing information
- Authentication flow that doesn't match documentation`
  },
  {
    id: 4,
    title: "Best Search APIs for Modern Applications in 2026",
    desc: "Comparing the top search APIs based on speed, pricing, documentation quality, and production reliability.",
    category: "Search APIs",
    read: "7 min read",
    date: "May 4, 2026",
    featured: false,
    accent: "#3b82f6",
    Icon: Zap,
    content: `## Why Search APIs Matter More Than Ever

Search isn't a feature anymore—it's infrastructure. Users expect instant, relevant, typo-tolerant results in every application. Building great search from scratch is a six-month project. Using the right API is a two-day integration.

## Algolia

Still the gold standard for developer experience. Polished dashboard, SDKs across every major language, and excellent typo tolerance. The catch: pricing scales aggressively.

**Best for:** SaaS products, e-commerce, documentation search.
**Pricing:** Free up to 10K records. Paid from $50/month.

## Typesense

The open-source alternative closing the gap fast. Sub-50ms at scale, self-hostable, generous cloud tier.

**Best for:** Teams wanting control, indie hackers, budget-conscious startups.
**Pricing:** Free self-hosted. Cloud from $0.000015 per search.

## Meilisearch

Another strong open-source contender. Prioritizes ease of setup—working search in under five minutes.

**Best for:** Blogs, small apps, rapid prototypes.
**Pricing:** Free self-hosted. Cloud from €29/month.

## Elasticsearch / OpenSearch

The enterprise powerhouse. Complex to operate but unmatched in flexibility.

**Best for:** Enterprise, log analysis, complex data search.
**Pricing:** Free self-hosted. AWS OpenSearch ~$0.02/hour.

## The Verdict

For most applications in 2026, Typesense Cloud hits the best balance of performance, pricing, and simplicity. If you need enterprise-grade support and maximum DX polish, Algolia is still king.`
  },
  {
    id: 5,
    title: "Building Autocomplete That Feels Instant: A Technical Deep-Dive",
    desc: "How to architect search autocomplete using modern APIs, debouncing strategies, and client-side caching to achieve sub-100ms perceived latency.",
    category: "Search APIs",
    read: "8 min read",
    date: "Apr 18, 2026",
    featured: false,
    accent: "#3b82f6",
    Icon: Activity,
    content: `## The Autocomplete Performance Trap

Autocomplete feels simple from the outside: user types, suggestions appear. But the implementation decisions you make in week one will define whether your search feels instant or sluggish six months later.

## The Core Architecture

The right architecture for production autocomplete has four layers:

**1. Input handling** — Debounce at 80-120ms. Too short and you're spamming your API. Too long and the UI feels unresponsive.

**2. Request deduplication** — Cancel in-flight requests when a new keystroke arrives. Use AbortController.

**3. Client-side cache** — Cache results for 60-120 seconds. Most repeated searches hit the cache, not your API.

**4. Optimistic UI** — Show a skeleton immediately. Never show a blank state.

## Debounce vs Throttle

For autocomplete, debounce (wait until the user stops typing) is almost always correct. Throttle (limit to N calls per second) can cause suggestions to lag behind typing. Use debounce.

## The Cache Layer

A simple Map-based cache with TTL is enough for most use cases. Key by query string, store results with timestamp, evict entries older than 2 minutes.

## Response Streaming

For longer result sets, stream the first 5 results immediately and lazy-load the rest. This reduces perceived latency dramatically on slower connections.

## Measuring Success

The metric that matters isn't API response time—it's keystroke-to-suggestion latency. Measure from keyup event to first visible suggestion. Target under 150ms at P95.`
  },
  {
    id: 6,
    title: "The Developer's Guide to LLM APIs in 2026",
    desc: "A practical comparison of OpenAI, Anthropic, Google Gemini, and Mistral for production applications—latency, cost, context windows, and reliability.",
    category: "AI APIs",
    read: "10 min read",
    date: "May 5, 2026",
    featured: false,
    accent: "#a855f7",
    Icon: Sparkles,
    content: `## The LLM API Landscape Has Matured

A year ago, OpenAI was essentially the only serious option for production LLM integration. In 2026, the landscape looks fundamentally different. There are now four enterprise-grade providers, each with distinct tradeoffs.

## OpenAI (GPT-4o, o-series)

Still the default choice for most teams. The API surface is the most battle-tested, tooling ecosystem is largest, and GPT-4o strikes an excellent balance of speed and capability.

**Strengths:** Reliability, ecosystem, vision capabilities, JSON mode
**Weaknesses:** Pricing for high-volume use cases, rate limits on new models
**Best for:** General-purpose production applications

## Anthropic (Claude Sonnet 4, Opus 4)

The strongest option for long-context, instruction-following, and complex reasoning. 200K context window in production. Excellent for document processing and multi-step agentic tasks.

**Strengths:** Long context, instruction following, safety
**Weaknesses:** Slightly slower than GPT-4o at equivalent tasks
**Best for:** Document analysis, agent frameworks, complex reasoning

## Google Gemini 2.0

Best-in-class for multimodal tasks. Native audio, video, and code understanding. Flash model is the fastest sub-$1 option in the market.

**Strengths:** Multimodal, speed (Flash), Google ecosystem integration
**Weaknesses:** API consistency has historically been rougher
**Best for:** Multimodal applications, high-throughput pipelines

## Mistral

The European contender. Excellent for teams with data residency requirements, cost-sensitive workloads, and open-weights deployment.

**Strengths:** European data residency, open weights, cost efficiency
**Weaknesses:** Smaller ecosystem
**Best for:** EU compliance, self-hosted deployments

## Practical Decision Framework

Pick OpenAI if you want the safest default. Pick Anthropic if you're building agents or processing long documents. Pick Gemini Flash if you need raw throughput at low cost. Pick Mistral if data residency matters.`
  },
  {
    id: 7,
    title: "Streaming LLM Responses: SSE, WebSockets, and What Actually Works",
    desc: "Technical comparison of streaming approaches for LLM APIs, with benchmarks, implementation patterns, and production gotchas.",
    category: "AI APIs",
    read: "7 min read",
    date: "Apr 26, 2026",
    featured: false,
    accent: "#a855f7",
    Icon: Radio,
    content: `## Why Streaming Matters for LLM UX

A non-streaming LLM response with a 3-second completion time feels slow and broken. The same response streamed token-by-token feels responsive and alive. Streaming isn't optional for production LLM applications.

## Server-Sent Events (SSE)

SSE is the dominant pattern for LLM streaming APIs. OpenAI, Anthropic, and Google all use SSE for streaming responses.

**How it works:** Single HTTP connection, server pushes newline-delimited JSON chunks, client parses and renders incrementally.

**Advantages:** Simple implementation, works with standard HTTP infrastructure, automatic reconnection.

**Disadvantages:** One-directional (server to client only), no bidirectional communication.

## WebSockets

WebSockets are bidirectional, which makes them theoretically superior for interactive LLM sessions. In practice, they're usually overkill.

**When to use WebSockets:** Real-time collaborative applications, voice interfaces, scenarios requiring client-to-server streaming.

**When to avoid:** Most standard chat and completion use cases. SSE handles them fine with less infrastructure complexity.

## The Abort Problem

The most underappreciated production issue with LLM streaming: what happens when the user navigates away mid-stream? Always implement AbortController to cancel in-flight requests and stop billing for tokens you'll never use.

## Rendering Streamed Markdown

Streaming raw markdown tokens and rendering incrementally without flicker requires careful buffering. Process complete words or sentences before flushing to the DOM rather than rendering every individual token.`
  },
  {
    id: 8,
    title: "API Security in 2026: The Vulnerabilities Teams Keep Shipping",
    desc: "A breakdown of the most common API security failures in production—BOLA, mass assignment, broken auth, and the fixes that actually prevent breaches.",
    category: "API Security",
    read: "9 min read",
    date: "May 3, 2026",
    featured: false,
    accent: "#ef4444",
    Icon: Shield,
    content: `## The OWASP API Top 10 Is Still Being Ignored

The OWASP API Security Top 10 was first published in 2019. In 2026, engineering teams are still shipping every single vulnerability on that list. The problem isn't awareness—it's prioritization. Security feels like overhead until there's a breach.

## BOLA: Broken Object Level Authorization

BOLA is the most common critical API vulnerability. The pattern: your API uses predictable IDs, and you don't verify that the authenticated user owns the object they're requesting.

**The attack:** User A requests /api/orders/1001. They don't own order 1001. Your API returns it anyway.

**The fix:** Never assume an ID in the URL is authorized. Always cross-reference the authenticated user's ownership before returning data.

## Mass Assignment

Your API accepts a JSON payload and maps it directly to a database model without filtering fields. An attacker adds isAdmin: true to the payload.

**The fix:** Use an allowlist of accepted fields. Never pass raw request bodies to ORM save methods.

## Broken Authentication

Weak JWT secrets, missing token expiration, and tokens that can't be revoked after logout. Any one of these creates significant risk.

**JWT checklist:**
- HS256 secret should be 256 bits minimum, randomly generated
- Tokens should expire (accessToken: 15 min, refreshToken: 7 days)
- Implement a token blacklist or short-lived tokens with refresh rotation

## Unrestricted Rate Limiting

No rate limiting = your API is a free computation resource for attackers. At minimum, implement per-IP and per-authenticated-user limits on all endpoints.

## Security Headers

Every API response should include: Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, Content-Security-Policy.`
  },
  {
    id: 9,
    title: "Rotating API Keys Safely Without Breaking Your Integrations",
    desc: "A step-by-step operational playbook for rotating API keys in production without downtime, service interruptions, or broken third-party integrations.",
    category: "API Security",
    read: "5 min read",
    date: "Apr 14, 2026",
    featured: false,
    accent: "#ef4444",
    Icon: Lock,
    content: `## Why API Key Rotation Gets Neglected

API key rotation is one of those operational practices everyone agrees is important and almost nobody does on schedule. The reason is simple: it's scary. Rotating a key that dozens of integrations depend on feels like defusing a bomb.

It doesn't have to be.

## The Safe Rotation Pattern

**Step 1: Generate the new key**
Create the new key before revoking the old one. You need overlap time.

**Step 2: Deploy the new key to non-critical services first**
Update staging, monitoring, and internal tooling before touching production.

**Step 3: Update secrets management**
If you're using a secrets manager (Vault, AWS Secrets Manager, Doppler), update the secret there—not in environment variables scattered across your infrastructure.

**Step 4: Rolling deploy to production**
Update your primary application with the new key. Monitor error rates for 15 minutes.

**Step 5: Update downstream integrations**
Third-party services, webhooks, and partner integrations that use your key.

**Step 6: Revoke the old key**
Only after all integrations are confirmed working. Keep a 24-hour grace period if possible.

## Automating Rotation

Services like Doppler, AWS Secrets Manager, and HashiCorp Vault support automatic rotation with zero-downtime key transitions. If you're rotating manually more than twice a year, it's worth automating.`
  },
  {
    id: 10,
    title: "REST vs GraphQL vs gRPC: Which API Style in 2026?",
    desc: "A practical breakdown of API design paradigms—when each shines, when each struggles, and how to make the right call for your use case.",
    category: "GraphQL",
    read: "9 min read",
    date: "Apr 12, 2026",
    featured: false,
    accent: "#e91e96",
    Icon: Layers,
    content: `## Three Paradigms, One Decision

The REST vs GraphQL vs gRPC debate has been running for years. There isn't a universal right answer—each approach has genuine strengths and weaknesses.

## REST: The Default for Good Reason

REST maps naturally to HTTP, it's universally understood, and every major language has mature client libraries.

**When REST wins:**
- Public APIs consumed by many different clients
- CRUD-heavy applications (most web apps)
- When you need excellent caching (REST is cache-friendly by design)

**When REST struggles:**
- Complex queries requiring data from multiple resources (N+1 problem)
- Mobile clients on constrained networks (over-fetching is real)

## GraphQL: The Right Tool for Complex Data

**When GraphQL wins:**
- Applications with complex, nested data relationships
- Mobile clients where bandwidth matters
- Products where frontend evolves faster than backend
- When you're serving multiple client types from one API

**When GraphQL struggles:**
- Simple CRUD applications (overkill)
- Caching (HTTP caching doesn't work naturally)

## gRPC: Extreme Performance for Internal Services

**When gRPC wins:**
- Microservices communicating with each other
- High-throughput, low-latency requirements
- Streaming data

**When gRPC struggles:**
- Browser-based clients
- Public APIs (developer experience is worse)
- Debugging (binary format is not human-readable)

## The Hybrid Approach

Most mature companies use all three: REST for public-facing APIs, GraphQL for their primary product API, and gRPC for internal service communication.`
  },
  {
    id: 11,
    title: "GraphQL Subscriptions in Production: Lessons From Scaling to 1M Connections",
    desc: "What we learned running GraphQL subscriptions at scale—architecture decisions, connection management, and the pitfalls that don't show up until you have real traffic.",
    category: "GraphQL",
    read: "8 min read",
    date: "Mar 28, 2026",
    featured: false,
    accent: "#e91e96",
    Icon: Database,
    content: `## GraphQL Subscriptions Are Powerful and Treacherous

Subscriptions are the most exciting and most dangerous feature of GraphQL. They enable real-time data synchronization with a clean developer experience. They also create persistent connections that don't scale like stateless HTTP requests.

## The Architecture That Works

Don't run subscriptions on your primary GraphQL server. The persistent WebSocket connections will starve your request-handling capacity under load.

**Recommended architecture:**
- Separate subscription service (stateful, WebSocket-native)
- Event bus between mutation handlers and subscription server (Redis Pub/Sub or Kafka)
- Load balancer with sticky sessions or a shared state layer

## Connection Lifecycle Management

Every connection must have:
- Heartbeat / keep-alive (30-60 second ping/pong)
- Inactivity timeout (disconnect after 5 minutes of no subscription activity)
- Authentication refresh (subscriptions outlive JWT token lifetimes)
- Graceful reconnection logic on the client

## The N+1 Problem Amplified

Every subscription resolver has the same N+1 risk as query resolvers, but it fires repeatedly. Use DataLoader caching aggressively and be extremely careful with what data you resolve on each event.

## Memory Leaks Are Subscription-Specific

The most common production issue: subscription resolvers that don't clean up after themselves when a client disconnects. Always return a cleanup function from your subscribe resolver.`
  },
  {
    id: 12,
    title: "Building Bulletproof Webhook Consumers",
    desc: "The complete engineering guide to receiving webhooks reliably—idempotency, signature verification, async queuing, and handling retries from third-party providers.",
    category: "Webhooks",
    read: "8 min read",
    date: "May 1, 2026",
    featured: false,
    accent: "#f97316",
    Icon: Webhook,
    content: `## Webhooks Are Not HTTP Requests

That sounds obvious, but most webhook consumer bugs come from treating webhooks like normal API requests. They're fundamentally different: they arrive unpredictably, can be retried multiple times, and can arrive out of order.

## Signature Verification First

Before you process anything, verify the webhook signature. Stripe uses HMAC-SHA256. GitHub uses HMAC-SHA256 with X-Hub-Signature-256. Verify or reject—there's no middle ground.

Never do signature verification lazily. It should be the first line of your webhook handler, before any database queries.

## Acknowledge Immediately, Process Asynchronously

Your webhook endpoint should respond with 200 OK within 3-5 seconds. If your processing takes longer, the provider will retry and you'll create duplicate processing.

**The correct pattern:**
1. Verify signature
2. Store the raw payload to a queue (SQS, Sidekiq, BullMQ)
3. Return 200 immediately
4. Process asynchronously with retry logic

## Idempotency Is Non-Negotiable

Every webhook provider retries on failure. Your consumer will receive the same event multiple times. Design for it.

Use the webhook event ID as an idempotency key. Store processed event IDs. Check before processing.

## Out-of-Order Delivery

Webhooks don't arrive in order. A payment.updated event can arrive before the payment.created event. Design your state machine to handle this, or use timestamps to determine canonical state.`
  },
  {
    id: 13,
    title: "Designing a Webhook System for Your API",
    desc: "The engineering decisions behind building a first-class webhook system—delivery guarantees, retry logic, payload design, and developer tooling.",
    category: "Webhooks",
    read: "7 min read",
    date: "Apr 8, 2026",
    featured: false,
    accent: "#f97316",
    Icon: Server,
    content: `## Webhooks Are a Public API Contract

When you ship a webhook system, you're making a contract with your users: "When X happens, we'll send you Y within Z time." Breaking that contract erodes trust faster than almost anything else.

## Delivery Architecture

The right architecture separates the trigger path from the delivery path entirely.

**Event generation:** Your application logic creates an event record in the database with status PENDING.

**Delivery worker:** A separate async process picks up PENDING events and attempts delivery. On 2xx response, marks DELIVERED. On failure, schedules retry with exponential backoff.

**Never** deliver webhooks synchronously in the request path.

## Retry Strategy

Industry standard: exponential backoff with jitter, maximum 72 hours of retries.

Reasonable retry schedule: 10s, 30s, 2m, 10m, 1h, 6h, 24h, 48h.

After the final retry, mark the endpoint as disabled and notify the user.

## Signature Scheme

Use HMAC-SHA256. Include the timestamp in the signed payload to prevent replay attacks. Stripe's signature scheme is the industry reference implementation—follow it.

## Developer Experience

Great webhook DX requires:
- Delivery logs accessible in the dashboard
- One-click retry for failed deliveries
- Webhook event explorer with full request/response
- CLI tool for local development (ngrok alternative built-in)
- Event catalog documenting every event type with example payloads`
  },
  {
    id: 14,
    title: "OAuth 2.0 in Practice: The Flows That Actually Matter",
    desc: "A developer-focused breakdown of OAuth 2.0 flows—when to use Authorization Code, Client Credentials, and PKCE, with implementation patterns for each.",
    category: "Authentication",
    read: "8 min read",
    date: "Apr 28, 2026",
    featured: false,
    accent: "#06b6d4",
    Icon: Lock,
    content: `## OAuth 2.0 Is Misunderstood

Most developers implement one OAuth flow, then treat it as the universal solution. In practice, the four OAuth flows exist because they solve different problems. Using the wrong one isn't just inefficient—it can introduce security vulnerabilities.

## Authorization Code with PKCE (The Browser/Mobile Flow)

This is the flow you use for any application where you're acting on behalf of a user and the application runs in an environment you don't fully control (browser, mobile app).

PKCE (Proof Key for Code Exchange) replaces the client secret for public clients. You generate a code_verifier, hash it to create a code_challenge, and send the challenge during the auth request. The server verifies the code_verifier at token exchange time.

**When to use:** Web applications authenticating users, mobile apps, SPAs.

## Client Credentials (The Server-to-Server Flow)

No user involved. Your backend service exchanges its credentials for an access token to call another service. This is machine-to-machine authentication.

**When to use:** Microservices, scheduled jobs, backend integrations, any M2M communication.

## Authorization Code Without PKCE (Avoid for New Work)

The original flow. Still used by confidential clients (server-side web apps with a secure client secret), but PKCE is now recommended even for these.

## Implicit Flow (Deprecated)

Don't use this. It's in the spec for historical reasons. Access tokens in URL fragments are a security problem.

## Token Refresh Strategy

Access tokens should have short lifetimes (15-60 minutes). Implement silent refresh: when the access token approaches expiration, automatically exchange the refresh token without user interaction.`
  },
  {
    id: 15,
    title: "Auth APIs Compared: Clerk vs Auth0 vs Supabase Auth vs Building Your Own",
    desc: "An honest engineering analysis of managed authentication services versus rolling your own—costs, tradeoffs, migration complexity, and where each breaks down.",
    category: "Authentication",
    read: "9 min read",
    date: "Apr 3, 2026",
    featured: false,
    accent: "#06b6d4",
    Icon: Users,
    content: `## The Build vs Buy Question for Auth

Authentication is the one piece of infrastructure that seems simple and is actually complex. Password hashing, session management, MFA, SSO, rate limiting on login endpoints, account recovery flows—each one has subtle failure modes that cause real security incidents.

The question isn't whether managed auth is expensive. It's whether the cost is worth avoiding those failure modes.

## Clerk

The developer experience leader. Clerk's prebuilt components are genuinely beautiful. User management dashboard is excellent. React/Next.js integration is the smoothest in the market.

**Strengths:** DX, prebuilt UI components, B2B/multi-tenant support
**Weaknesses:** Pricing at scale ($0.02/MAU), US-only data residency historically
**Best for:** SaaS products, teams prioritizing DX, B2B applications

## Auth0

The enterprise standard. Every compliance certification, every SSO provider, every edge case. Battle-tested at scale.

**Strengths:** Enterprise features, compliance, SSO breadth, ecosystem
**Weaknesses:** Pricing is aggressive at scale, DX has historically lagged competitors
**Best for:** Enterprise sales motion, regulated industries

## Supabase Auth

The open-source option built on GoTrue. Free for projects under 50K MAU, self-hostable, and deeply integrated with the Supabase ecosystem.

**Strengths:** Free tier, open source, self-hostable, Postgres-native
**Weaknesses:** Fewer enterprise features, smaller ecosystem
**Best for:** Indie hackers, open-source projects, Supabase users

## Building Your Own

Only recommended if you have a dedicated security engineering team and a specific reason that managed auth can't serve (e.g., extreme data residency requirements, deeply custom authentication flows).

For everyone else: buy, don't build.`
  },
  {
    id: 16,
    title: "How to Price Your API: A Practical Guide for Developer Tools",
    desc: "The pricing models used by successful API companies—per-request, per-seat, usage tiers, and hybrid approaches—with real examples and implementation advice.",
    category: "API Monetization",
    read: "7 min read",
    date: "Apr 22, 2026",
    featured: false,
    accent: "#eab308",
    Icon: DollarSign,
    content: `## API Pricing Is Product Strategy

How you price your API determines who uses it, how they integrate it, and how much they're willing to pay when you need to raise prices. Getting it right in year one is much easier than migrating thousands of integrations later.

## Model 1: Per-Request Pricing

The simplest model. Charge per API call. Easy to understand, easy to implement, easy to monitor.

**Works well for:** APIs where each call has roughly equal cost, data APIs, computation APIs.

**Pitfalls:** Incentivizes users to minimize API calls aggressively, which leads to batching abuse and cache-heavy integrations that reduce your usage metrics.

## Model 2: Per-Seat / Per-User

Charge based on the number of end users in a customer's system. Popular for B2B products where the API powers a feature.

**Works well for:** User-facing features, collaboration tools, identity APIs.

**Pitfalls:** Customers under-report users. Hard to audit.

## Model 3: Usage Tiers (Stripe's Model)

Bundle requests into tiers with overage pricing. Free tier for developers, paid tiers with step-function pricing as usage grows.

**Works well for:** Developer tools with a freemium acquisition model.

**Implementation:** Track usage in real-time. Alert at 80% of tier limit. Make upgrading frictionless.

## Model 4: Hybrid (The Right Answer for Most)

Combine a monthly platform fee with usage-based pricing above a base volume. This gives you predictable revenue while aligning incentives at high usage.

**Example:** $99/month includes 500K requests. $0.0002 per request above that.`
  },
  {
    id: 17,
    title: "Top 10 Free APIs Every Indie Hacker Should Know in 2026",
    desc: "The best zero-cost, production-ready APIs for solo founders building products without burning through their runway.",
    category: "Indie Hackers",
    read: "8 min read",
    date: "Apr 25, 2026",
    featured: false,
    accent: "#ec4899",
    Icon: Rocket,
    content: `## Building Lean With the Right APIs

The best thing that happened to indie hackers in the last five years is the explosion of generous free API tiers. You can build a legitimately impressive product with zero API spend if you know which APIs to use.

## 1. Resend (Email)

$0 for 3,000 emails/month. Clean API, beautiful dashboard, built specifically for developers. The best transactional email API available.

## 2. Cloudflare Workers (Compute + Edge)

100,000 free requests/day. Run code at the edge globally for literally nothing. Also free R2 storage (10GB) and KV storage.

## 3. Supabase (Database + Auth)

Two free projects, 500MB database storage, 50,000 monthly active users on Auth. Genuinely usable in early production.

## 4. Upstash (Redis + Kafka)

10,000 free Redis commands/day. The best serverless Redis for rate limiting, caching, and session storage.

## 5. ExchangeRate-API (Currency)

1,500 free requests/month. Accurate currency conversion for 170+ currencies. No credit card required.

## 6. ipapi (IP Geolocation)

1,000 free requests/day. Get country, city, timezone, and currency from an IP address.

## 7. Resend for React Email

Free tier includes the React Email framework for building HTML emails with React components. The only email templating approach worth using.

## 8. Loops (Email Marketing)

Free up to 1,000 contacts. Built for SaaS—onboarding sequences, feature announcements, and transactional all in one.

## How to Vet a Free Tier

- What happens when you exceed the limit? Hard block or auto-charged?
- Is there a rate limit on top of the monthly limit?
- Does the free tier include webhooks?
- What's the data retention policy?`
  },
  {
    id: 18,
    title: "Apives vs. RapidAPI vs. ProgrammableWeb: Which Directory Helps?",
    desc: "An honest comparison of the top API marketplaces—what each does well, where they fall short, and why verification changes everything.",
    category: "Indie Hackers",
    read: "8 min read",
    date: "May 2, 2026",
    featured: false,
    accent: "#ec4899",
    Icon: Swords,
    content: `## The API Directory Landscape in 2026

When a developer needs an API, they usually start with a search engine or one of three major directories: RapidAPI, ProgrammableWeb, or Apives.

## RapidAPI

The largest API marketplace on the internet. Tens of thousands of APIs, unified authentication, billing abstraction.

**What it does well:** Massive catalog, unified API key, built-in billing, in-browser testing.

**Where it falls short:** Quality is inconsistent. Thousands of APIs are abandoned, broken, or poorly maintained.

## ProgrammableWeb

The original API directory—launched in 2005. MuleSoft shut it down in 2021. Legacy resource only.

## Apives

A different philosophy: fewer APIs, verified quality.

**What it does well:** Active verification of endpoints, uptime, and documentation. Curated catalog. Real uptime data, not vendor marketing copy.

## The Bottom Line

If you want volume, go to RapidAPI. If you want quality you can trust, use Apives.

The fundamental insight: a smaller catalog of verified, working APIs is more valuable than a massive catalog full of noise. Developers don't need ten thousand options. They need five great ones.`
  },
  {
    id: 19,
    title: "Building Faster With Better APIs: A Startup Playbook",
    desc: "Why the APIs you choose in week one determine your velocity in month six—and how to make decisions that compound over time.",
    category: "Startups",
    read: "6 min read",
    date: "Apr 17, 2026",
    featured: false,
    accent: "#f97316",
    Icon: BarChart2,
    content: `## The Compounding Effect of API Choices

Most startup founders think about APIs tactically: "I need email, I'll use Mailgun. I need payments, I'll use Stripe."

But the best engineering teams think about APIs strategically. The difference shows up six months later when one team is moving at twice the speed of the other.

## Technical Debt You Don't See Coming

When you choose an API in week one, you're also choosing:

- **The shape of your data model** — How you store API responses affects your entire DB schema
- **Your error handling patterns** — A poorly designed error response propagates bad patterns throughout your codebase
- **Your testing strategy** — APIs with good sandboxes produce better-tested code
- **Your observability posture** — APIs with good webhook support make incidents easier to debug

## The Three Criteria That Matter Most

**1. Breaking Change Frequency** — Look for semantic versioning with actual deprecation timelines.

**2. Webhook Support** — Real-time webhooks vs. polling is an architecture question. Always prefer APIs with robust webhook support.

**3. SDK Quality** — A good SDK is worth weeks of development time. Check GitHub commit frequency, retry/backoff handling, TypeScript support.

## A Fast Evaluation Framework

For any API you're considering, spend 30 minutes:

- Test the quickstart — Did it work in under 15 minutes?
- Read the last 10 GitHub issues — Are they bugs or feature requests?
- Check uptime over the last 90 days — Is it above 99.5%?
- Find the pricing ceiling — What does it cost at 10x your current usage?`
  },
  {
    id: 20,
    title: "Why API Documentation So Often Fails Developers",
    desc: "The hidden, systemic problems developers face while integrating APIs—and what good documentation actually looks like.",
    category: "Developer Experience",
    read: "6 min read",
    date: "Apr 29, 2026",
    featured: false,
    accent: "#f59e0b",
    Icon: FileText,
    content: `## The Documentation Gap

There's a persistent truth in software development: most API documentation is written for the person who built the API, not for the developer trying to use it.

## The Five Failure Modes

**1. Example Responses That Aren't Real** — The most damaging failure. A doc shows you a response payload with five fields. In production, the actual response has twelve.

**2. Auth Flows Described Incorrectly** — Authentication is the first thing developers implement and the most critical to get right. Yet auth documentation is among the most frequently wrong.

**3. Rate Limits Without Context** — "Rate limited to 100 requests per minute" tells you almost nothing. Is that per endpoint? Per IP? Sliding window or fixed window?

**4. Error Codes Without Actionable Guidance** — A list of error codes is not documentation. What specific field was wrong? What format was expected?

**5. No Changelog** — APIs change. That's fine. Changing without telling anyone is not.

## What Great Documentation Looks Like

- **Real, runnable examples** — Copy-paste code that actually works
- **Versioned docs** — You can see what changed between v1 and v2
- **Interactive testing** — Try the endpoint in the browser before writing any code
- **Explicit error tables** — Every error code with a cause and a fix
- **Authentication flow diagrams** — Visual flows for OAuth, API key, JWT`
  },
  {
    id: 21,
    title: "The OpenAPI Spec Is Your Best Engineering Hire",
    desc: "Why investing in a high-quality OpenAPI specification pays dividends in generated SDKs, documentation, mocking, contract testing, and team alignment.",
    category: "Developer Experience",
    read: "6 min read",
    date: "Mar 25, 2026",
    featured: false,
    accent: "#f59e0b",
    Icon: Code2,
    content: `## An OpenAPI Spec Is Infrastructure

Most teams treat their OpenAPI spec as documentation—something you generate from code and maybe publish to a docs site. The teams building the best developer experiences treat it as infrastructure.

## What a Great Spec Unlocks

**Client SDKs** — Tools like Speakeasy and OpenAPI Generator produce high-quality SDKs in 20+ languages from your spec. Update the spec, regenerate the SDKs. No manual SDK maintenance.

**Mock Servers** — Prism can run a mock server directly from your spec. Frontend teams don't need to wait for backend implementation.

**Contract Testing** — Dredd and Schemathesis can run automated tests against your live API to verify it matches the spec. Spec drift becomes a CI failure.

**Documentation** — Stoplight, Readme, and Redoc generate beautiful interactive documentation from your spec automatically.

**Type Safety** — Generate TypeScript types directly from your API spec. The client types are always in sync with the server.

## Spec-First Development

The biggest unlock is spec-first: write the OpenAPI spec before writing the implementation code. This forces you to think about the API surface before you're deep in implementation. It's the API design equivalent of writing tests first.

## Common Pitfalls

- **Auto-generating from code** produces mediocre specs. Write them deliberately.
- **Incomplete error schemas** make the spec useless for generating error handling code.
- **Missing examples** make the spec less useful for mock servers and docs.`
  },
  {
    id: 22,
    title: "AWS vs Cloudflare Workers vs Vercel Functions: Where to Run Your API",
    desc: "A practical comparison of the three dominant platforms for running API backends in 2026—cold starts, pricing at scale, developer experience, and operational complexity.",
    category: "Cloud APIs",
    read: "8 min read",
    date: "Apr 15, 2026",
    featured: false,
    accent: "#0ea5e9",
    Icon: Cloud,
    content: `## The Platform Decision Shapes Everything

Where you run your API isn't just an infrastructure decision—it determines your cold start behavior, global latency profile, operational overhead, and pricing structure at scale.

## AWS Lambda + API Gateway

The original serverless. Mature, infinitely flexible, and deeply integrated with the rest of the AWS ecosystem.

**Cold starts:** 100-800ms depending on runtime. SnapStart for Java, $LAMBDA_RUNTIME for Node.js/Python are dramatically better.

**Pricing:** $0.20 per 1M requests + duration. Predictable at scale.

**Operational overhead:** Higher than alternatives. VPC configuration, IAM policies, API Gateway limits.

**Best for:** Teams already in AWS, applications needing VPC access, complex enterprise requirements.

## Cloudflare Workers

Runs at the edge in 300+ locations. V8 isolates eliminate cold starts entirely.

**Cold starts:** Near zero. V8 isolates vs. full VM instantiation.

**Pricing:** $5/month for 10M requests. Extremely cost-effective.

**Constraints:** No Node.js standard library, 128MB memory limit, CPU time limits.

**Best for:** Low-latency public APIs, API gateways, auth middleware, globally distributed workloads.

## Vercel Functions

The best developer experience in the market. Deploy your entire application—frontend and API—with one git push.

**Cold starts:** 50-200ms. Better than Lambda but worse than Cloudflare.

**Pricing:** Generous free tier; scales with Enterprise plans.

**Best for:** Next.js applications, full-stack TypeScript, teams prioritizing DX.

## The Right Answer

For latency-critical public APIs: Cloudflare Workers. For complex backend logic: AWS Lambda. For full-stack applications: Vercel.`
  },
  {
    id: 23,
    title: "Contract Testing Your APIs With Pact",
    desc: "How consumer-driven contract testing with Pact eliminates integration failures between services without requiring a live test environment.",
    category: "API Testing",
    read: "7 min read",
    date: "Apr 5, 2026",
    featured: false,
    accent: "#10b981",
    Icon: TestTube2,
    content: `## The Problem With Integration Tests

Traditional integration tests require both the consumer and provider to be running simultaneously. This is slow, flaky, and doesn't scale well in a microservices architecture.

Contract testing solves this. With Pact, the consumer defines the contract (what it expects from the provider), and the provider verifies it independently. No shared test environment required.

## How Pact Works

**Step 1: Consumer writes interaction tests**
The consumer service writes tests that define the exact HTTP interactions it expects. Pact captures these as a contract (pact file).

**Step 2: Pact file published to a broker**
The contract is published to a Pact Broker (hosted or self-hosted).

**Step 3: Provider verifies the contract**
The provider pulls the contract and runs it against its implementation. If the provider's response doesn't match the consumer's expectations, the verification fails.

**Step 4: Can I Deploy?**
Before deploying, run pact-broker can-i-deploy to verify that the version you're about to ship is compatible with all its consumers.

## When Contract Testing Shines

- Microservices with many inter-service dependencies
- Teams that can't coordinate integration test environments
- APIs with multiple consumer teams
- High-velocity teams that break integrations regularly

## When to Skip It

- Monoliths (just write integration tests)
- Simple two-service architectures
- APIs with a single consumer

The overhead of Pact is worth it once you have 4+ services communicating with each other.`
  },
  {
    id: 24,
    title: "Load Testing Your API Before It Matters",
    desc: "A practical guide to load testing with k6, Artillery, and Locust—how to design meaningful test scenarios, interpret results, and fix what you find.",
    category: "API Testing",
    read: "6 min read",
    date: "Mar 18, 2026",
    featured: false,
    accent: "#10b981",
    Icon: Activity,
    content: `## Most APIs Have Never Been Load Tested

The dirty secret of production APIs: most of them have never been load tested. Developers write unit tests, integration tests, maybe end-to-end tests. Load testing gets skipped because it's "not a priority" until there's a production incident.

## Choosing a Tool

**k6** — The modern choice. JavaScript-based test scripts, excellent CLI, Grafana integration, cloud execution available. The best DX.

**Artillery** — YAML-based scenarios, good for teams that prefer configuration over code. Excellent for simulating complex user journeys.

**Locust** — Python-based, highly customizable. Best for teams with complex testing requirements.

For most teams starting out: k6.

## Designing Meaningful Scenarios

A load test that sends a thousand identical GET requests to /ping is useless. Realistic load tests:

- Mix read and write operations proportional to your actual traffic
- Include authentication (test with real JWT tokens)
- Test your most expensive endpoints, not just your simplest
- Include the data setup/teardown your real users trigger

## What to Measure

- **Latency at P95 and P99**, not average
- **Error rate** under load (target: 0% for 2xx, monitor 5xx closely)
- **Throughput ceiling** — at what RPS does latency degrade?
- **Database connection pool** exhaustion

## The Most Common Finding

Your database is the bottleneck. N+1 queries that are invisible at low traffic become catastrophic at scale. Always run EXPLAIN ANALYZE on your slowest queries after a load test.`
  },
];

const CATEGORIES = [
  "All", "API Discovery", "AI APIs", "Search APIs", "API Security",
  "GraphQL", "Webhooks", "Authentication", "API Monetization",
  "Indie Hackers", "Startups", "Developer Experience", "Cloud APIs",
  "API Testing",
];

const CATEGORY_META = {
  "All":                 { Icon: Layers,     color: "#22c55e" },
  "API Discovery":       { Icon: Search,     color: "#22c55e" },
  "AI APIs":             { Icon: Sparkles,   color: "#a855f7" },
  "Search APIs":         { Icon: Zap,        color: "#3b82f6" },
  "API Security":        { Icon: Shield,     color: "#ef4444" },
  "GraphQL":             { Icon: Blocks,     color: "#e91e96" },
  "Webhooks":            { Icon: Webhook,    color: "#f97316" },
  "Authentication":      { Icon: Lock,       color: "#06b6d4" },
  "API Monetization":    { Icon: DollarSign, color: "#eab308" },
  "Indie Hackers":       { Icon: Rocket,     color: "#ec4899" },
  "Startups":            { Icon: BarChart2,  color: "#f97316" },
  "Developer Experience":{ Icon: Code2,      color: "#f59e0b" },
  "Cloud APIs":          { Icon: Cloud,      color: "#0ea5e9" },
  "API Testing":         { Icon: TestTube2,  color: "#10b981" },
};

// ── Markdown renderer ─────────────────────────────────────────────────────────
function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} style={{ color: "#e4e4e7", fontWeight: 600 }}>{part.slice(2, -2)}</strong>
      : part
  );
}

function renderContent(content) {
  const lines = content.trim().split("\n");
  const elements = [];
  let listBuffer = [];

  const flushList = key => {
    if (!listBuffer.length) return;
    elements.push(
      <ul key={`ul-${key}`} style={{ margin: "12px 0 16px 0", padding: "0 0 0 16px", listStyle: "none" }}>
        {listBuffer.map((item, j) => (
          <li key={j} style={{ color: "#a1a1aa", fontSize: "13.5px", lineHeight: "1.7", marginBottom: "6px", display: "flex", gap: "8px" }}>
            <span style={{ color: "#22c55e", marginTop: "1px", flexShrink: 0 }}>›</span>
            <span>{renderInline(item)}</span>
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
        <h2 key={i} style={{ fontSize: "17px", fontWeight: 700, color: "#fafafa", marginTop: "36px", marginBottom: "10px", letterSpacing: "-0.3px", fontFamily: "inherit" }}>
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushList(i);
      elements.push(
        <h3 key={i} style={{ fontSize: "13px", fontWeight: 600, color: "#22c55e", marginTop: "20px", marginBottom: "6px" }}>
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2));
    } else if (line.startsWith("**") && line.endsWith("**") && !line.slice(2, -2).includes("**")) {
      flushList(i);
      elements.push(
        <p key={i} style={{ fontSize: "13px", fontWeight: 600, color: "#d4d4d8", marginTop: "12px", marginBottom: "4px" }}>{line.slice(2, -2)}</p>
      );
    } else if (line.trim() === "") {
      flushList(i);
      elements.push(<div key={i} style={{ height: "6px" }} />);
    } else {
      flushList(i);
      elements.push(
        <p key={i} style={{ color: "#a1a1aa", fontSize: "13.5px", lineHeight: "1.75", margin: "4px 0" }}>{renderInline(line)}</p>
      );
    }
  });
  flushList("end");
  return elements;
}

// ── Article Card ──────────────────────────────────────────────────────────────
function ArticleCard({ article, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "14px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-1px)" : "none",
        outline: "none",
      }}
    >
      <div style={{ height: "1px", background: `linear-gradient(90deg, ${article.accent}, transparent 60%)` }} />
      <div style={{ padding: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: `${article.accent}18`, border: `1px solid ${article.accent}28`
          }}>
            <article.Icon size={13} style={{ color: article.accent }} />
          </div>
          <span style={{
            fontSize: "10px", fontWeight: 500, padding: "2px 8px", borderRadius: "99px",
            color: article.accent, background: `${article.accent}12`, border: `1px solid ${article.accent}22`,
            letterSpacing: "0.01em"
          }}>
            {article.category}
          </span>
          <span style={{ fontSize: "10px", color: "#52525b", marginLeft: "auto" }}>{article.date}</span>
        </div>

        <h3 style={{
          fontSize: "13px", fontWeight: 600, color: hovered ? "#ffffff" : "#e4e4e7",
          lineHeight: "1.45", marginBottom: "7px", letterSpacing: "-0.15px",
          transition: "color 0.15s ease", fontFamily: "inherit"
        }}>
          {article.title}
        </h3>

        <p style={{
          fontSize: "11.5px", color: "#52525b", lineHeight: "1.6",
          marginBottom: "14px", display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden"
        }}>
          {article.desc}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "10.5px", color: "#52525b" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Clock size={9} />{article.read}
          </span>
          <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px", color: article.accent, fontWeight: 600 }}>
            Read <ArrowRight size={9} style={{ transform: hovered ? "translateX(2px)" : "none", transition: "transform 0.15s" }} />
          </span>
        </div>
      </div>
    </button>
  );
}

// ── Article Modal ─────────────────────────────────────────────────────────────
function ArticleModal({ article, onClose, onSelectArticle }) {
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => { cancelAnimationFrame(raf); document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const onScroll = e => {
    const el = e.currentTarget;
    const h = el.scrollHeight - el.clientHeight;
    setProgress(h > 0 ? (el.scrollTop / h) * 100 : 0);
  };

  const related = ARTICLES
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 2)
    .concat(ARTICLES.filter(a => a.id !== article.id && a.category !== article.category).slice(0, 1));

  useEffect(() => {
    const handleKey = e => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
      <div
        onClick={handleClose}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(10px)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease"
        }}
      />
      <div
        ref={scrollRef}
        onScroll={onScroll}
        style={{
          position: "relative", zIndex: 10,
          width: "100%", maxWidth: "660px", height: "100vh",
          overflowY: "auto",
          background: "#070a0b",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          transform: visible ? "translateY(0)" : "translateY(16px)",
          opacity: visible ? 1 : 0,
          transition: "all 0.2s ease",
        }}
      >
        {/* Progress */}
        <div style={{ position: "sticky", top: 0, height: "2px", background: "rgba(255,255,255,0.05)", zIndex: 30 }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: "linear-gradient(90deg, #16a34a, #22c55e)",
            transition: "width 0.1s linear"
          }} />
        </div>

        {/* Header */}
        <div style={{
          position: "sticky", top: "2px", zIndex: 20,
          padding: "12px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(7,10,11,0.97)", backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.055)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            <span style={{
              fontSize: "10px", fontWeight: 500, padding: "2px 8px", borderRadius: "99px",
              color: article.accent, background: `${article.accent}12`, border: `1px solid ${article.accent}25`,
              flexShrink: 0
            }}>
              {article.category}
            </span>
            <span style={{ fontSize: "10px", color: "#52525b", display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
              <Clock size={9} />{article.read}
            </span>
            <span style={{ color: "#3f3f46" }}>·</span>
            <span style={{ fontSize: "10px", color: "#52525b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {article.date}
            </span>
          </div>
          <button
            onClick={handleClose}
            style={{
              marginLeft: "12px", width: "28px", height: "28px", borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer", color: "#71717a", transition: "all 0.15s ease"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#d4d4d8"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#71717a"; }}
          >
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 24px 80px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px",
            background: `${article.accent}14`, border: `1px solid ${article.accent}25`
          }}>
            <article.Icon size={18} style={{ color: article.accent }} />
          </div>

          <h1 style={{
            fontSize: "20px", fontWeight: 700, color: "#fafafa",
            lineHeight: "1.3", marginBottom: "10px", letterSpacing: "-0.4px",
            fontFamily: "inherit"
          }}>
            {article.title}
          </h1>

          <p style={{
            color: "#52525b", fontSize: "13px", lineHeight: "1.65",
            marginBottom: "24px", paddingBottom: "24px",
            borderBottom: "1px solid rgba(255,255,255,0.055)"
          }}>
            {article.desc}
          </p>

          <div>{renderContent(article.content)}</div>

          {/* Related */}
          <div style={{ marginTop: "44px", paddingTop: "28px", borderTop: "1px solid rgba(255,255,255,0.055)" }}>
            <p style={{ fontSize: "9px", fontWeight: 600, color: "#52525b", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "14px" }}>
              Continue Reading
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {related.slice(0, 3).map(a => (
                <RelatedCard key={a.id} article={a} onClick={() => { onSelectArticle(a); scrollRef.current?.scrollTo(0, 0); setProgress(0); }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RelatedCard({ article, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", textAlign: "left",
        display: "flex", alignItems: "center", gap: "12px",
        padding: "12px 14px", borderRadius: "10px", cursor: "pointer",
        background: hovered ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)"}`,
        transition: "all 0.15s ease", outline: "none"
      }}
    >
      <div style={{
        width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `${article.accent}12`, border: `1px solid ${article.accent}22`
      }}>
        <article.Icon size={12} style={{ color: article.accent }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: "12px", fontWeight: 600,
          color: hovered ? "#ffffff" : "#d4d4d8",
          lineHeight: "1.35", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          transition: "color 0.15s", fontFamily: "inherit"
        }}>
          {article.title}
        </p>
        <p style={{ fontSize: "10px", color: "#52525b", marginTop: "2px" }}>{article.category} · {article.read}</p>
      </div>
      <ChevronRight size={12} style={{ color: "#52525b", flexShrink: 0 }} />
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ApivesBlogsPage() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");

  const filtered = ARTICLES.filter(a => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      a.title.toLowerCase().includes(q) ||
      a.desc.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = ARTICLES[0];
  const showFeatured = activeCategory === "All" && !searchQuery;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #050708; }
        ::-webkit-scrollbar-thumb { background: #1c2a1e; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #16a34a; }
        .pill-scroll::-webkit-scrollbar { height: 0; display: none; }
        input::placeholder { color: #3f3f46; }
        input::-webkit-input-placeholder { color: #3f3f46; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up-1 { animation: fadeUp 0.4s ease both; animation-delay: 0ms; }
        .fade-up-2 { animation: fadeUp 0.4s ease both; animation-delay: 60ms; }
        .fade-up-3 { animation: fadeUp 0.4s ease both; animation-delay: 110ms; }
        .fade-up-4 { animation: fadeUp 0.4s ease both; animation-delay: 150ms; }
      `}</style>

      <div style={{ fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif", background: "#070a0b", minHeight: "100vh", color: "#fafafa" }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section style={{
          position: "relative",
          paddingTop: "64px",
          paddingBottom: "52px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          overflow: "hidden"
        }}>
          {/* Subtle radial glow */}
          <div style={{
            position: "absolute", top: "-100px", right: "-80px",
            width: "480px", height: "480px", borderRadius: "50%",
            pointerEvents: "none",
            background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 65%)"
          }} />
          <div style={{
            position: "absolute", bottom: "-60px", left: "15%",
            width: "340px", height: "220px", borderRadius: "50%",
            pointerEvents: "none",
            background: "radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)"
          }} />

          <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "0 24px" }}>
            <div className="fade-up-1">
              <h1 style={{
                fontSize: "clamp(28px,4.5vw,48px)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-1.5px",
                maxWidth: "520px",
                marginBottom: "14px",
                color: "#fafafa"
              }}>
                The blog for{" "}
                <span style={{ color: "#22c55e" }}>API-first</span>{" "}
                developers.
              </h1>
            </div>

            <div className="fade-up-2">
              <p style={{
                color: "#71717a",
                fontSize: "14px",
                maxWidth: "380px",
                lineHeight: "1.65",
                marginBottom: "28px",
                fontWeight: 400
              }}>
                Verified guides, honest comparisons, and practical insights for building with APIs in production.
              </p>
            </div>

            <div className="fade-up-3" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Search size={12} style={{ position: "absolute", left: "13px", color: "#22c55e", pointerEvents: "none" }} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "99px",
                    paddingLeft: "34px",
                    paddingRight: searchQuery ? "32px" : "16px",
                    paddingTop: "9px",
                    paddingBottom: "9px",
                    fontSize: "12.5px",
                    color: "#e4e4e7",
                    width: "220px",
                    outline: "none",
                    fontFamily: "inherit",
                    transition: "border-color 0.15s, background 0.15s"
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.35)"; e.currentTarget.style.background = "rgba(34,197,94,0.04)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{ position: "absolute", right: "12px", background: "none", border: "none", cursor: "pointer", color: "#52525b", display: "flex" }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "#52525b" }}>
                <BookOpen size={11} />
                <span>{ARTICLES.length} articles</span>
                <span style={{ color: "#3f3f46" }}>·</span>
                <span style={{ color: "#22c55e" }}>All verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── CATEGORY PILLS ────────────────────────────────────────────── */}
        <div
          className="pill-scroll"
          style={{
            overflowX: "auto",
            borderBottom: "1px solid rgba(255,255,255,0.05)"
          }}
        >
          <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", gap: "6px", padding: "12px 0", whiteSpace: "nowrap" }}>
              {CATEGORIES.map(cat => {
                const meta = CATEGORY_META[cat];
                const CatIcon = meta?.Icon || Layers;
                const active = activeCategory === cat;
                return (
                  <CategoryPill
                    key={cat}
                    cat={cat}
                    CatIcon={CatIcon}
                    active={active}
                    onClick={() => setActiveCategory(cat)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
        <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "36px 24px 80px" }}>

          {/* Featured */}
          {showFeatured && (
            <div style={{ marginBottom: "40px" }}>
              <SectionLabel color="#22c55e" label="Featured" />
              <FeaturedCard article={featured} onClick={() => setSelectedArticle(featured)} />
            </div>
          )}

          {/* All Articles */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "2px", height: "12px", borderRadius: "99px", background: "rgba(255,255,255,0.25)" }} />
                <span style={{ fontSize: "9px", fontWeight: 600, color: "#52525b", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  {searchQuery ? `Results for "${searchQuery}"` : activeCategory === "All" ? "All Articles" : activeCategory}
                </span>
                <span style={{
                  fontSize: "10px", color: "#52525b", borderRadius: "99px",
                  padding: "1px 8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)"
                }}>
                  {filtered.length}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <ViewButton active={viewMode === "grid"} onClick={() => setViewMode("grid")}>
                  <LayoutGrid size={11} />
                </ViewButton>
                <ViewButton active={viewMode === "list"} onClick={() => setViewMode("list")}>
                  <List size={11} />
                </ViewButton>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "14px", margin: "0 auto 16px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)"
                }}>
                  <AlertCircle size={20} style={{ color: "#52525b" }} />
                </div>
                <p style={{ color: "#d4d4d8", fontSize: "14px", fontWeight: 500, marginBottom: "4px" }}>No articles found</p>
                <p style={{ color: "#52525b", fontSize: "12px", marginBottom: "18px" }}>No results for "{searchQuery}"</p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    fontSize: "11.5px", fontWeight: 500, padding: "8px 16px", borderRadius: "99px",
                    background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)",
                    color: "#22c55e", cursor: "pointer", fontFamily: "inherit"
                  }}
                >
                  <RefreshCw size={11} /> Clear filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "14px"
              }}>
                {filtered.map(a => (
                  <ArticleCard key={a.id} article={a} onClick={() => setSelectedArticle(a)} />
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {filtered.map(a => (
                  <ListCard key={a.id} article={a} onClick={() => setSelectedArticle(a)} />
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
            onSelectArticle={setSelectedArticle}
          />
        )}
      </div>
    </>
  );
}

function CategoryPill({ cat, CatIcon, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "5px",
        padding: "5px 12px", borderRadius: "99px", fontSize: "10.5px", fontWeight: 500,
        border: `1px solid ${active ? "#22c55e" : hovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)"}`,
        background: active ? "#22c55e" : hovered ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
        color: active ? "#000000" : hovered ? "#a1a1aa" : "#71717a",
        cursor: "pointer", transition: "all 0.15s ease", outline: "none",
        fontFamily: "inherit", whiteSpace: "nowrap"
      }}
    >
      <CatIcon size={9} />
      {cat}
    </button>
  );
}

function ViewButton({ active, onClick, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "28px", height: "28px", borderRadius: "8px",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all 0.15s ease", outline: "none",
        background: active ? "#22c55e" : hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${active ? "#22c55e" : "rgba(255,255,255,0.06)"}`,
        color: active ? "#000" : "#71717a",
        fontFamily: "inherit"
      }}
    >
      {children}
    </button>
  );
}

function SectionLabel({ color, label, Icon: LIcon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "16px" }}>
      <div style={{ width: "2px", height: "13px", borderRadius: "99px", background: color, flexShrink: 0 }} />
      {LIcon && <LIcon size={10} style={{ color }} />}
      <span style={{ fontSize: "9px", fontWeight: 600, color: "#52525b", letterSpacing: "0.13em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

function FeaturedCard({ article, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", textAlign: "left", cursor: "pointer", outline: "none",
        borderRadius: "16px", padding: "28px 28px 24px",
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.1)"}`,
        transition: "all 0.25s ease",
        boxShadow: hovered ? "0 0 32px rgba(34,197,94,0.06)" : "none",
        position: "relative", overflow: "hidden",
        fontFamily: "inherit"
      }}
    >
      <div style={{
        position: "absolute", top: "-80px", right: "-60px",
        width: "300px", height: "300px", borderRadius: "50%",
        pointerEvents: "none",
        background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 65%)"
      }} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-start", position: "relative" }}>
        <div style={{ flex: 1, minWidth: "260px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", alignItems: "center", marginBottom: "16px" }}>
            <span style={{
              fontSize: "10px", fontWeight: 500, padding: "2px 8px", borderRadius: "99px",
              color: "#22c55e", background: "rgba(34,197,94,0.09)", border: "1px solid rgba(34,197,94,0.18)"
            }}>
              {article.category}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10.5px", color: "#52525b" }}>
              <Clock size={9} />{article.read}
            </span>
            <span style={{ color: "#3f3f46", fontSize: "10px" }}>·</span>
            <span style={{ fontSize: "10.5px", color: "#52525b" }}>{article.date}</span>
          </div>

          <h2 style={{
            fontSize: "clamp(16px,2.2vw,22px)",
            fontWeight: 700, lineHeight: 1.25,
            letterSpacing: "-0.4px", marginBottom: "10px",
            color: hovered ? "#ffffff" : "#f4f4f5",
            transition: "color 0.2s", maxWidth: "480px",
            fontFamily: "inherit"
          }}>
            {article.title}
          </h2>

          <p style={{ color: "#52525b", fontSize: "13px", lineHeight: "1.6", maxWidth: "460px", marginBottom: "20px" }}>
            {article.desc}
          </p>

          <span style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            fontSize: "12.5px", fontWeight: 600, color: "#22c55e"
          }}>
            Read article
            <ArrowRight size={12} style={{ transform: hovered ? "translateX(2px)" : "none", transition: "transform 0.15s" }} />
          </span>
        </div>

        <div style={{
          width: "80px", height: "80px", borderRadius: "18px", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.12)"
        }}>
          <article.Icon size={34} style={{ color: "#22c55e", opacity: 0.55 }} />
        </div>
      </div>
    </button>
  );
}

function ListCard({ article, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", textAlign: "left",
        display: "flex", alignItems: "center", gap: "14px",
        padding: "14px 16px", borderRadius: "12px", cursor: "pointer",
        background: hovered ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)"}`,
        transition: "all 0.15s ease", outline: "none", fontFamily: "inherit"
      }}
    >
      <div style={{
        width: "34px", height: "34px", borderRadius: "10px", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `${article.accent}12`, border: `1px solid ${article.accent}22`
      }}>
        <article.Icon size={14} style={{ color: article.accent }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: "13px", fontWeight: 600,
          color: hovered ? "#ffffff" : "#e4e4e7",
          lineHeight: "1.35", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          transition: "color 0.15s", fontFamily: "inherit"
        }}>
          {article.title}
        </p>
        <p style={{ fontSize: "10.5px", color: "#52525b", marginTop: "2px" }}>
          {article.category} · {article.read} · {article.date}
        </p>
      </div>
      <ArrowRight size={13} style={{ color: article.accent, flexShrink: 0, transform: hovered ? "translateX(2px)" : "none", transition: "transform 0.15s" }} />
    </button>
  );
}