import { useState, useEffect, useRef } from "react";
import {
  Search, Clock, Eye, TrendingUp, ArrowRight, X,
  ChevronRight, Layers, Zap, Cpu, Code2, FileText,
  Rocket, BarChart2, BookOpen, Swords, Star, Shield,
  Webhook, DollarSign, Lock, Database, Cloud, TestTube2,
  GitBranch, Terminal, Globe, Filter, Flame, Hash,
  CheckCircle2, AlertCircle, ChevronUp, Sparkles,
  LayoutGrid, List, RefreshCw, Activity, Server,
  Package, Wrench, Users, Blocks, Radio
} from "lucide-react";

// ── Mora Green Design Tokens ─────────────────────────────────────────────────
const MG = {
  base:    "#00c27a",
  bright:  "#00e08d",
  dim:     "#009960",
  glow:    "rgba(0,194,122,0.18)",
  glowSm:  "rgba(0,194,122,0.10)",
  glowXs:  "rgba(0,194,122,0.06)",
  border:  "rgba(0,194,122,0.22)",
  borderDim:"rgba(0,194,122,0.12)",
  text:    "#00c27a",
  badge:   "rgba(0,194,122,0.10)",
};

// ── Article Data ─────────────────────────────────────────────────────────────
const ARTICLES = [
  // ── API Discovery ──────────────────────────────────────────────────────────
  {
    id: 1,
    title: "How to Find Reliable APIs Faster Than Ever",
    desc: "A practical guide for developers to avoid broken APIs and save integration time across modern applications.",
    category: "API Discovery",
    read: "5 min",
    date: "May 6, 2026",
    featured: true,
    views: "12.4K",
    accent: MG.base,
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
    read: "6 min",
    date: "April 30, 2026",
    featured: false,
    views: "8.2K",
    accent: MG.base,
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
    read: "4 min",
    date: "April 21, 2026",
    featured: false,
    views: "5.8K",
    accent: MG.base,
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
  // ── Search APIs ────────────────────────────────────────────────────────────
  {
    id: 4,
    title: "Best Search APIs for Modern Applications in 2026",
    desc: "Comparing the top search APIs based on speed, pricing, documentation quality, and production reliability.",
    category: "Search APIs",
    read: "7 min",
    date: "May 4, 2026",
    featured: false,
    views: "9.1K",
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
    read: "8 min",
    date: "April 18, 2026",
    featured: false,
    views: "6.7K",
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
  // ── AI APIs ────────────────────────────────────────────────────────────────
  {
    id: 6,
    title: "The Developer's Guide to LLM APIs in 2026",
    desc: "A practical comparison of OpenAI, Anthropic, Google Gemini, and Mistral for production applications—latency, cost, context windows, and reliability.",
    category: "AI APIs",
    read: "10 min",
    date: "May 5, 2026",
    featured: false,
    views: "31.4K",
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
    read: "7 min",
    date: "April 26, 2026",
    featured: false,
    views: "14.8K",
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
  // ── API Security ───────────────────────────────────────────────────────────
  {
    id: 8,
    title: "API Security in 2026: The Vulnerabilities Teams Keep Shipping",
    desc: "A breakdown of the most common API security failures in production—BOLA, mass assignment, broken auth, and the fixes that actually prevent breaches.",
    category: "API Security",
    read: "9 min",
    date: "May 3, 2026",
    featured: false,
    views: "19.6K",
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
    read: "5 min",
    date: "April 14, 2026",
    featured: false,
    views: "7.3K",
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

Services like Doppler, AWS Secrets Manager, and HashiCorp Vault support automatic rotation with zero-downtime key transitions. If you're rotating manually more than twice a year, it's worth automating.

## The Secret You Should Never Rotate

Environment: your team's habits. Make key rotation routine, not a fire drill.`
  },
  // ── GraphQL ────────────────────────────────────────────────────────────────
  {
    id: 10,
    title: "REST vs GraphQL vs gRPC: Which API Style in 2026?",
    desc: "A practical breakdown of API design paradigms—when each shines, when each struggles, and how to make the right call for your use case.",
    category: "GraphQL",
    read: "9 min",
    date: "April 12, 2026",
    featured: false,
    views: "15.3K",
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
    read: "8 min",
    date: "March 28, 2026",
    featured: false,
    views: "11.2K",
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
  // ── Webhooks ───────────────────────────────────────────────────────────────
  {
    id: 12,
    title: "Building Bulletproof Webhook Consumers",
    desc: "The complete engineering guide to receiving webhooks reliably—idempotency, signature verification, async queuing, and handling retries from third-party providers.",
    category: "Webhooks",
    read: "8 min",
    date: "May 1, 2026",
    featured: false,
    views: "13.1K",
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

Webhooks don't arrive in order. A payment.updated event can arrive before the payment.created event. Design your state machine to handle this, or use timestamps to determine canonical state.

## Failure Handling

If your queue fails to process an event after N retries, don't silently drop it. Dead letter queues with alerting are essential for webhook consumers in production.`
  },
  {
    id: 13,
    title: "Designing a Webhook System for Your API",
    desc: "The engineering decisions behind building a first-class webhook system—delivery guarantees, retry logic, payload design, and developer tooling.",
    category: "Webhooks",
    read: "7 min",
    date: "April 8, 2026",
    featured: false,
    views: "8.4K",
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
  // ── Authentication ─────────────────────────────────────────────────────────
  {
    id: 14,
    title: "OAuth 2.0 in Practice: The Flows That Actually Matter",
    desc: "A developer-focused breakdown of OAuth 2.0 flows—when to use Authorization Code, Client Credentials, and PKCE, with implementation patterns for each.",
    category: "Authentication",
    read: "8 min",
    date: "April 28, 2026",
    featured: false,
    views: "16.7K",
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
    read: "9 min",
    date: "April 3, 2026",
    featured: false,
    views: "22.1K",
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
  // ── API Monetization ───────────────────────────────────────────────────────
  {
    id: 16,
    title: "How to Price Your API: A Practical Guide for Developer Tools",
    desc: "The pricing models used by successful API companies—per-request, per-seat, usage tiers, and hybrid approaches—with real examples and implementation advice.",
    category: "API Monetization",
    read: "7 min",
    date: "April 22, 2026",
    featured: false,
    views: "9.8K",
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
  // ── Indie Hackers ──────────────────────────────────────────────────────────
  {
    id: 17,
    title: "Top 10 Free APIs Every Indie Hacker Should Know in 2026",
    desc: "The best zero-cost, production-ready APIs for solo founders building products without burning through their runway.",
    category: "Indie Hackers",
    read: "8 min",
    date: "April 25, 2026",
    featured: false,
    views: "21.2K",
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
    read: "8 min",
    date: "May 2, 2026",
    featured: false,
    views: "18.7K",
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
  // ── Startups ───────────────────────────────────────────────────────────────
  {
    id: 19,
    title: "Building Faster With Better APIs: A Startup Playbook",
    desc: "Why the APIs you choose in week one determine your velocity in month six—and how to make decisions that compound over time.",
    category: "Startups",
    read: "6 min",
    date: "April 17, 2026",
    featured: false,
    views: "8.9K",
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
  // ── Developer Experience ───────────────────────────────────────────────────
  {
    id: 20,
    title: "Why API Documentation So Often Fails Developers",
    desc: "The hidden, systemic problems developers face while integrating APIs—and what good documentation actually looks like.",
    category: "Developer Experience",
    read: "6 min",
    date: "April 29, 2026",
    featured: false,
    views: "7.3K",
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
    read: "6 min",
    date: "March 25, 2026",
    featured: false,
    views: "6.1K",
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
  // ── Cloud APIs ─────────────────────────────────────────────────────────────
  {
    id: 22,
    title: "AWS vs Cloudflare Workers vs Vercel Functions: Where to Run Your API",
    desc: "A practical comparison of the three dominant platforms for running API backends in 2026—cold starts, pricing at scale, developer experience, and operational complexity.",
    category: "Cloud APIs",
    read: "8 min",
    date: "April 15, 2026",
    featured: false,
    views: "17.4K",
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
  // ── API Testing ────────────────────────────────────────────────────────────
  {
    id: 23,
    title: "Contract Testing Your APIs With Pact",
    desc: "How consumer-driven contract testing with Pact eliminates integration failures between services without requiring a live test environment.",
    category: "API Testing",
    read: "7 min",
    date: "April 5, 2026",
    featured: false,
    views: "7.8K",
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
    read: "6 min",
    date: "March 18, 2026",
    featured: false,
    views: "9.3K",
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
  "All":                 { Icon: Layers,     color: MG.base },
  "API Discovery":       { Icon: Search,     color: MG.base },
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
      ? <strong key={i} className="text-zinc-200 font-semibold">{part.slice(2, -2)}</strong>
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
      <ul key={`ul-${key}`} className="my-4 space-y-2 pl-5">
        {listBuffer.map((item, j) => (
          <li key={j} className="text-zinc-400 text-sm leading-relaxed list-disc" style={{ "::marker": { color: MG.base } }}>
            <span style={{ color: MG.dim }} className="mr-1">▸</span>{renderInline(item)}
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
        <h2 key={i} className="text-lg font-bold text-white mt-10 mb-3 tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushList(i);
      elements.push(
        <h3 key={i} className="text-sm font-semibold mt-6 mb-2" style={{ color: MG.base }}>
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2));
    } else if (line.startsWith("**") && line.endsWith("**") && !line.slice(2, -2).includes("**")) {
      flushList(i);
      elements.push(
        <p key={i} className="text-[13px] font-semibold text-zinc-200 mt-3 mb-1">{line.slice(2, -2)}</p>
      );
    } else if (line.trim() === "") {
      flushList(i);
      elements.push(<div key={i} className="h-2" />);
    } else {
      flushList(i);
      elements.push(
        <p key={i} className="text-zinc-400 text-[13.5px] leading-[1.75]">{renderInline(line)}</p>
      );
    }
  });
  flushList("end");
  return elements;
}

// ── Components ───────────────────────────────────────────────────────────────
function ArticleCard({ article, onClick }) {
  const meta = CATEGORY_META[article.category] || CATEGORY_META["All"];
  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 focus:outline-none"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.13)";
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.background = "rgba(255,255,255,0.025)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* accent bar */}
      <div className="h-[1.5px] w-full" style={{ background: `linear-gradient(90deg, ${article.accent}, transparent 70%)` }} />
      <div className="p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${article.accent}15`, border: `1px solid ${article.accent}28` }}>
            <article.Icon size={14} style={{ color: article.accent }} />
          </div>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border tracking-wide"
            style={{ color: article.accent, background: `${article.accent}10`, borderColor: `${article.accent}22` }}>
            {article.category}
          </span>
          <span className="text-[10.5px] text-zinc-600 ml-auto tabular-nums">{article.date}</span>
        </div>
        <h3 className="text-[13.5px] font-semibold text-zinc-100 leading-snug mb-2 group-hover:text-white transition-colors"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          {article.title}
        </h3>
        <p className="text-[11.5px] text-zinc-500 leading-relaxed mb-4 line-clamp-2">{article.desc}</p>
        <div className="flex items-center gap-3 text-[11px] text-zinc-600">
          <span className="flex items-center gap-1"><Clock size={10} />{article.read}</span>
          <span className="flex items-center gap-1"><Eye size={10} />{article.views}</span>
          <span className="ml-auto flex items-center gap-1 font-semibold transition-colors"
            style={{ color: article.accent }}>
            Read <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </span>
        </div>
      </div>
    </button>
  );
}

function TrendingCard({ article, rank, onClick }) {
  return (
    <button onClick={onClick}
      className="group w-full text-left flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 focus:outline-none"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.045)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.025)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
      }}
    >
      <span className="text-[11px] font-bold text-zinc-700 w-5 shrink-0 mt-0.5 tabular-nums">
        {String(rank).padStart(2, "0")}
      </span>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${article.accent}15`, border: `1px solid ${article.accent}25` }}>
        <article.Icon size={12} style={{ color: article.accent }} />
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold text-zinc-200 leading-snug mb-1 group-hover:text-white transition-colors truncate"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          {article.title}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-zinc-600">
          <Eye size={9} />{article.views}
          <span className="text-zinc-700">·</span>
          {article.read}
        </div>
      </div>
    </button>
  );
}

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
    setTimeout(onClose, 220);
  };

  const onScroll = e => {
    const el = e.currentTarget;
    const h = el.scrollHeight - el.clientHeight;
    setProgress(h > 0 ? (el.scrollTop / h) * 100 : 0);
  };

  const related = ARTICLES.filter(a => a.id !== article.id && a.category === article.category).slice(0, 2)
    .concat(ARTICLES.filter(a => a.id !== article.id && a.category !== article.category).slice(0, 1));

  useEffect(() => {
    const handleKey = e => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center">
      <div
        className="absolute inset-0 transition-opacity duration-200"
        style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(12px)", opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="relative z-10 w-full max-w-[680px] h-screen overflow-y-auto transition-all duration-200"
        style={{
          background: "#080e10",
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          transform: visible ? "translateY(0)" : "translateY(20px)",
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Progress bar */}
        <div className="sticky top-0 h-[2px] z-30" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="h-full transition-[width] duration-100"
            style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${MG.dim}, ${MG.bright})` }} />
        </div>

        {/* Header */}
        <div className="sticky top-[2px] z-20 px-7 py-3.5 flex items-center justify-between"
          style={{ background: "rgba(8,14,16,0.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0"
              style={{ color: article.accent, background: `${article.accent}10`, borderColor: `${article.accent}25` }}>
              {article.category}
            </span>
            <span className="text-[10.5px] text-zinc-600 flex items-center gap-1 shrink-0">
              <Clock size={9} />{article.read}
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-[10.5px] text-zinc-600 truncate">{article.date}</span>
          </div>
          <button onClick={handleClose}
            className="ml-3 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = ""; }}
          >
            <X size={13} className="text-zinc-400" />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-8 pb-20">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
            style={{ background: `${article.accent}15`, border: `1px solid ${article.accent}28` }}>
            <article.Icon size={20} style={{ color: article.accent }} />
          </div>
          <h1 className="text-[21px] font-bold text-white leading-tight mb-3 tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            {article.title}
          </h1>
          <p className="text-zinc-500 text-[13px] leading-relaxed mb-7 pb-7"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {article.desc}
          </p>
          <div>{renderContent(article.content)}</div>

          {/* Related */}
          <div className="mt-12 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[9.5px] font-semibold text-zinc-600 tracking-[0.15em] uppercase mb-4">
              Continue Reading
            </p>
            <div className="space-y-2">
              {related.slice(0, 3).map(a => (
                <button key={a.id}
                  onClick={() => { onSelectArticle(a); scrollRef.current?.scrollTo(0, 0); setProgress(0); }}
                  className="group w-full text-left flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all duration-200 focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.045)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${a.accent}12`, border: `1px solid ${a.accent}22` }}>
                    <a.Icon size={12} style={{ color: a.accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-zinc-200 group-hover:text-white transition-colors leading-snug truncate"
                      style={{ fontFamily: "'Syne', sans-serif" }}>
                      {a.title}
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{a.category} · {a.read}</p>
                  </div>
                  <ChevronRight size={12} className="text-zinc-600 group-hover:text-zinc-400 shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ color, label, Icon: LIcon }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="w-[3px] h-[14px] rounded-full" style={{ background: color }} />
      {LIcon && <LIcon size={11} style={{ color }} />}
      <span className="text-[9.5px] font-semibold text-zinc-500 tracking-[0.15em] uppercase">{label}</span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ApivesBlogsPage() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // grid | list

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
  const trending = [...ARTICLES].sort((a, b) => {
    const parse = v => parseFloat(v.replace("K", "")) * (v.includes("K") ? 1000 : 1);
    return parse(b.views) - parse(a.views);
  }).slice(0, 3);

  const showFeatured = activeCategory === "All" && !searchQuery;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #050b0d; }
        ::-webkit-scrollbar-thumb { background: #1a2e2a; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: ${MG.dim}; }
        .grid-bg {
          background-image:
            linear-gradient(rgba(0,194,122,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,194,122,0.028) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .mg-glow { box-shadow: 0 0 40px ${MG.glow}, 0 0 80px ${MG.glowXs}; }
        .pill-scroll::-webkit-scrollbar { height: 0; }
        @keyframes fade-up { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fade-up 0.4s ease both; }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#060c0e", minHeight: "100vh", color: "#fff" }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="grid-bg relative pt-16 pb-14 overflow-hidden"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.055)" }}>
          {/* glows */}
          <div className="absolute top-[-120px] right-[-60px] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${MG.glowSm} 0%, transparent 65%)` }} />
          <div className="absolute bottom-[-40px] left-[20%] w-[360px] h-[240px] rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${MG.glowXs} 0%, transparent 70%)` }} />

          <div className="max-w-[1080px] mx-auto px-6">
            <div className="fade-up" style={{ animationDelay: "0ms" }}>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium mb-5"
                style={{ borderColor: MG.borderDim, background: MG.glowXs, color: MG.text }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: MG.bright }} />
                Developer Insights & API Resources
              </div>
            </div>

            <div className="fade-up" style={{ animationDelay: "60ms" }}>
              <h1 className="text-[clamp(30px,5vw,54px)] font-extrabold leading-[1.06] tracking-[-2px] max-w-[540px] mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}>
                The blog for{" "}
                <span style={{ color: MG.base }}>API-first</span>{" "}
                developers.
              </h1>
            </div>

            <div className="fade-up" style={{ animationDelay: "110ms" }}>
              <p className="text-zinc-500 text-[13.5px] max-w-[400px] leading-relaxed mb-8">
                Verified guides, honest comparisons, and practical insights for building with APIs in production.
              </p>
            </div>

            {/* Search + stats */}
            <div className="fade-up flex flex-wrap items-center gap-3" style={{ animationDelay: "150ms" }}>
              <div className="relative flex items-center">
                <Search size={12} className="absolute left-3.5 pointer-events-none" style={{ color: MG.dim }} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="rounded-full pl-9 pr-4 py-2.5 text-[12.5px] text-white w-[230px] outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = MG.border; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")}
                    className="absolute right-3 cursor-pointer"
                    style={{ color: MG.dim }}>
                    <X size={12} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11.5px] text-zinc-600">
                <BookOpen size={11} />
                <span>{ARTICLES.length} articles</span>
                <span className="text-zinc-700">·</span>
                <span style={{ color: MG.base }}>All verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── CATEGORY PILLS ────────────────────────────────────────────── */}
        <div className="sticky top-0 z-50 pill-scroll overflow-x-auto"
          style={{ background: "rgba(6,12,14,0.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.055)" }}>
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="flex gap-1.5 py-3 whitespace-nowrap">
              {CATEGORIES.map(cat => {
                const meta = CATEGORY_META[cat];
                const CatIcon = meta?.Icon || Layers;
                const active = activeCategory === cat;
                return (
                  <button key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-medium border cursor-pointer transition-all duration-150 focus:outline-none"
                    style={{
                      background: active ? MG.base : "rgba(255,255,255,0.035)",
                      color: active ? "#000" : "#6b7280",
                      borderColor: active ? MG.base : "rgba(255,255,255,0.07)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.color = "#a1a1aa";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.color = "#6b7280";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                      }
                    }}
                  >
                    <CatIcon size={9.5} />
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
        <div className="max-w-[1080px] mx-auto px-6 py-12 pb-24">

          {/* Featured article */}
          {showFeatured && (
            <div className="mb-12">
              <SectionLabel color={MG.base} label="Featured" />
              <button onClick={() => setSelectedArticle(featured)}
                className="group w-full text-left rounded-2xl p-8 cursor-pointer transition-all duration-300 relative overflow-hidden focus:outline-none"
                style={{
                  background: `linear-gradient(135deg, ${MG.glowXs}, rgba(255,255,255,0.015))`,
                  border: `1px solid ${MG.borderDim}`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = MG.border;
                  e.currentTarget.style.boxShadow = `0 0 40px ${MG.glowSm}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = MG.borderDim;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${MG.glowXs} 0%, transparent 70%)` }} />

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 items-center mb-4">
                      <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full border"
                        style={{ color: MG.base, background: MG.glowXs, borderColor: MG.borderDim }}>
                        {featured.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10.5px] text-zinc-600"><Clock size={9} />{featured.read}</span>
                      <span className="text-zinc-700">·</span>
                      <span className="flex items-center gap-1 text-[10.5px] text-zinc-600"><Eye size={9} />{featured.views}</span>
                      <span className="text-zinc-700">·</span>
                      <span className="flex items-center gap-1 text-[10.5px] text-zinc-600"><Flame size={9} style={{ color: "#f97316" }} />Featured</span>
                    </div>
                    <h2 className="text-[clamp(17px,2.4vw,24px)] font-bold leading-snug mb-3 max-w-[500px] tracking-tight group-hover:text-white transition-colors"
                      style={{ fontFamily: "'Syne', sans-serif" }}>
                      {featured.title}
                    </h2>
                    <p className="text-zinc-500 text-[13px] leading-relaxed max-w-[480px] mb-5">{featured.desc}</p>
                    <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: MG.base }}>
                      Read article
                      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                    </div>
                  </div>
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl shrink-0 flex items-center justify-center"
                    style={{ background: MG.glowXs, border: `1px solid ${MG.borderDim}` }}>
                    <featured.Icon size={40} style={{ color: MG.base, opacity: 0.65 }} />
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Trending */}
          {showFeatured && (
            <div className="mb-12">
              <SectionLabel color="#f59e0b" label="Trending" Icon={TrendingUp} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {trending.map((a, i) => (
                  <TrendingCard key={a.id} article={a} rank={i + 1} onClick={() => setSelectedArticle(a)} />
                ))}
              </div>
            </div>
          )}

          {/* All articles */}
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-[3px] h-[13px] rounded-full" style={{ background: "rgba(255,255,255,0.35)" }} />
                <span className="text-[9.5px] font-semibold text-zinc-500 tracking-[0.15em] uppercase">
                  {searchQuery ? `Results for "${searchQuery}"` : activeCategory === "All" ? "All Articles" : activeCategory}
                </span>
                <span className="text-[10px] text-zinc-600 rounded-full px-2 py-0.5"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  {filtered.length}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setViewMode("grid")}
                  className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150"
                  style={{
                    background: viewMode === "grid" ? MG.base : "rgba(255,255,255,0.04)",
                    border: `1px solid ${viewMode === "grid" ? MG.base : "rgba(255,255,255,0.07)"}`,
                    color: viewMode === "grid" ? "#000" : "#6b7280",
                  }}>
                  <LayoutGrid size={12} />
                </button>
                <button onClick={() => setViewMode("list")}
                  className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150"
                  style={{
                    background: viewMode === "list" ? MG.base : "rgba(255,255,255,0.04)",
                    border: `1px solid ${viewMode === "list" ? MG.base : "rgba(255,255,255,0.07)"}`,
                    color: viewMode === "list" ? "#000" : "#6b7280",
                  }}>
                  <List size={12} />
                </button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <AlertCircle size={22} className="text-zinc-600" />
                </div>
                <p className="text-zinc-400 text-[14px] font-medium mb-1">No articles found</p>
                <p className="text-zinc-600 text-[12.5px] mb-5">No results for "{searchQuery}"</p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  className="inline-flex items-center gap-1.5 text-[11.5px] font-medium px-4 py-2 rounded-full cursor-pointer transition-all duration-150 border-0"
                  style={{ background: MG.glowXs, border: `1px solid ${MG.borderDim}`, color: MG.base }}
                  onMouseEnter={e => e.currentTarget.style.background = MG.glow}
                  onMouseLeave={e => e.currentTarget.style.background = MG.glowXs}
                >
                  <RefreshCw size={11} /> Clear filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(a => (
                  <ArticleCard key={a.id} article={a} onClick={() => setSelectedArticle(a)} />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map(a => (
                  <button key={a.id} onClick={() => setSelectedArticle(a)}
                    className="group w-full text-left flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.045)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${a.accent}14`, border: `1px solid ${a.accent}25` }}>
                      <a.Icon size={16} style={{ color: a.accent }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-zinc-200 group-hover:text-white transition-colors leading-snug truncate"
                        style={{ fontFamily: "'Syne', sans-serif" }}>
                        {a.title}
                      </p>
                      <p className="text-[11px] text-zinc-600 mt-0.5 truncate">{a.category} · {a.read} · {a.views} views</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9.5px] text-zinc-600 hidden sm:block">{a.date}</span>
                      <ArrowRight size={13} style={{ color: a.accent }} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── MODAL ─────────────────────────────────────────────────────── */}
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