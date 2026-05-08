import { useState, useEffect, useRef } from "react";

const ARTICLES = [
  {
    id: 1,
    title: "How to Find Reliable APIs Faster Than Ever",
    desc: "A practical guide for developers to avoid broken APIs and save integration time across modern applications.",
    category: "API Discovery",
    read: "5 min read",
    date: "May 6, 2026",
    featured: true,
    views: "12.4K",
    gradient: "from-emerald-500/30 to-teal-900/40",
    tag: "🔍",
    content: `
## The API Discovery Problem

Every developer has been there. You find what looks like the perfect API—great docs, clean endpoints, free tier. You spend two hours integrating it into your project. Then it breaks in production. The uptime is 94%, the docs are six months outdated, and the rate limits aren't where they said they'd be.

This is the API discovery problem, and it's costing developers millions of hours every year.

## Why Existing Directories Fall Short

Most API directories are basically static lists. Someone submits an API, it gets a card with a description and a link, and that's it. Nobody is verifying whether:

- The API actually works right now
- The authentication method described is current
- The pricing hasn't changed
- The endpoints return what they claim to return

Developers deserve better. You shouldn't need to build a proof of concept just to find out an API isn't production-ready.

## What Makes an API "Reliable"?

Reliability isn't just uptime. It's a combination of five factors:

**1. Uptime consistency** — Does it stay above 99.5% over 90 days, not just one week?

**2. Documentation accuracy** — Are the example responses real? Are auth flows documented correctly?

**3. Response time** — P95 latency matters more than average. Spikes kill UX.

**4. Breaking change frequency** — How often does the API change without notice?

**5. Support responsiveness** — When something breaks, is there a human on the other side?

## How Apives Solves This

Apives runs automated verification on every listed API. We test endpoints daily, flag inconsistencies between documentation and actual responses, and track uptime over time—not just at submission.

When you search for a weather API on Apives, you see real uptime data, real response times, and verified endpoint examples. Not marketing copy.

## Practical Tips for Faster Integration

Before you write a single line of integration code:

1. **Check the changelog** — If there isn't one, that's a red flag.
2. **Test the auth flow manually** — Before wiring it into your app.
3. **Look for community feedback** — GitHub issues and Stack Overflow tell the real story.
4. **Verify rate limits with a burst test** — Don't trust what the docs say; test it.
5. **Check if there's a sandbox environment** — Production-only APIs are a liability.

The goal isn't just to find an API. It's to find one you can build on confidently—one that won't wake you up at 3am when a third-party dependency silently changes.

That's what API discovery should look like. That's what Apives is building toward.
    `
  },
  {
    id: 2,
    title: "Best Search APIs for Modern Applications in 2026",
    desc: "Comparing the top search APIs based on speed, pricing, documentation quality, and production reliability.",
    category: "Search APIs",
    read: "7 min read",
    date: "May 4, 2026",
    featured: false,
    views: "9.1K",
    gradient: "from-blue-500/30 to-indigo-900/40",
    tag: "⚡",
    content: `
## Why Search APIs Matter More Than Ever

Search isn't a feature anymore—it's infrastructure. Users expect instant, relevant, typo-tolerant results in every application they touch. Building great search from scratch is a six-month project. Using the right search API is a two-day integration.

But not all search APIs are created equal. In 2026, the market has matured significantly, and the differences between options are sharper than ever.

## The Contenders

### Algolia
Still the gold standard for developer experience. Algolia's dashboard is polished, their SDKs work across every major language, and their typo tolerance is genuinely excellent. The catch: pricing scales aggressively past the free tier. For high-volume apps, the monthly bill can become a real concern.

**Best for:** SaaS products, e-commerce, documentation search.
**Pricing:** Free up to 10K records. Paid plans from $50/month.

### Typesense
The open-source alternative that's been closing the gap fast. Typesense is blazingly fast (sub-50ms at scale), can be self-hosted, and has a generous cloud tier. The community is active and the documentation has improved dramatically.

**Best for:** Teams that want control, indie hackers, budget-conscious startups.
**Pricing:** Free self-hosted. Cloud from $0.000015 per search operation.

### Meilisearch
Another strong open-source contender. Meilisearch prioritizes ease of setup—you can have a working search instance in under five minutes. It's ideal for smaller datasets but can struggle at very large scale.

**Best for:** Blogs, small apps, rapid prototypes.
**Pricing:** Free self-hosted. Cloud plans from €29/month.

### Elasticsearch (OpenSearch)
The enterprise powerhouse. Complex to set up and operate, but unmatched in flexibility. If you need full-text search with complex filtering, aggregations, and custom scoring logic, nothing beats it.

**Best for:** Enterprise applications, log analysis, complex data search.
**Pricing:** Free self-hosted. AWS OpenSearch from ~$0.02/hour.

## How to Choose

Ask yourself three questions:

1. **What's my data volume?** Under 100K records, almost any option works. Over 10M, you need Elasticsearch or a well-tuned Typesense/Algolia setup.

2. **How much control do I need?** Self-hosted = maximum control, maximum maintenance. Managed = less control, less ops headache.

3. **What's my tolerance for complexity?** Algolia is the easiest. Elasticsearch is the most powerful. Typesense splits the difference well.

## The Verdict

For most modern applications in 2026, **Typesense Cloud** hits the best balance of performance, pricing, and simplicity. If you need enterprise-grade support and maximum DX polish, Algolia is still king. If you're scaling to the moon and need maximum flexibility, invest in Elasticsearch.

Whatever you choose, integrate with a verified, stable API. Check the uptime history. Read recent GitHub issues. Don't learn the hard way.
    `
  },
  {
    id: 3,
    title: "Apives vs. RapidAPI vs. ProgrammableWeb: Which API Directory Actually Helps Developers?",
    desc: "An honest comparison of the top API marketplaces—what each does well, where they fall short, and why verification changes everything.",
    category: "Apives vs Others",
    read: "8 min read",
    date: "May 2, 2026",
    featured: false,
    views: "18.7K",
    gradient: "from-violet-500/30 to-purple-900/40",
    tag: "⚔️",
    content: `
## The API Directory Landscape in 2026

When a developer needs an API, they usually start with a search engine or one of three major directories: RapidAPI, ProgrammableWeb, or Apives. Each takes a fundamentally different approach to the same problem.

Let's be direct about what each actually offers.

## RapidAPI

RapidAPI is the largest API marketplace on the internet. They have tens of thousands of APIs, a unified authentication layer, and billing abstraction. You can test an endpoint directly in the browser before integrating.

**What it does well:**
- Massive catalog
- Unified API key (one key for multiple APIs)
- Built-in billing and usage tracking
- In-browser testing console

**Where it falls short:**
- Quality is inconsistent. Thousands of APIs are abandoned, broken, or poorly maintained—but still listed.
- The unified billing model creates vendor lock-in
- Discovery UX can be overwhelming
- No independent verification of uptime or docs accuracy
- Many "free" APIs have hidden limitations

**Best for:** Developers who want to experiment quickly and don't mind vetting quality themselves.

## ProgrammableWeb

ProgrammableWeb was the original API directory—launched in 2005, it was the definitive reference for years. In 2021, MuleSoft (Salesforce) shut it down. The archive is accessible but no longer maintained.

**What it did well:**
- Comprehensive catalog built over 15+ years
- Editorial content and API news coverage
- Category organization was genuinely useful

**What happened:** Without active maintenance, the data became stale. APIs listed were often deprecated, changed, or dead.

**Current status:** Legacy resource only. Don't rely on it for current API discovery.

## Apives

Apives takes a different philosophy: fewer APIs, verified quality.

**What it does well:**
- Active verification of endpoints, uptime, and documentation
- Curated catalog—APIs are tested before listing
- Real uptime data, not just what vendors claim
- Clean, fast discovery UX focused on developer needs
- Honest pricing breakdowns with actual limits verified

**Where it's still growing:**
- Catalog size is smaller than RapidAPI (by design, for now)
- Fewer niche/specialty APIs
- Community features are newer

## Head-to-Head Comparison

| Feature | RapidAPI | ProgrammableWeb | Apives |
|---|---|---|---|
| Catalog Size | 50,000+ | ~22,000 (archived) | Growing, curated |
| Uptime Verification | ❌ | ❌ | ✅ |
| Docs Accuracy Check | ❌ | ❌ | ✅ |
| Unified Auth | ✅ | ❌ | ❌ |
| In-browser Testing | ✅ | ❌ | ✅ |
| Active Maintenance | ✅ | ❌ | ✅ |
| Quality Curation | ❌ | ❌ | ✅ |

## The Bottom Line

If you want **volume**, go to RapidAPI. If you want **quality you can trust**, use Apives.

The fundamental insight Apives is built on: a smaller catalog of verified, working APIs is more valuable than a massive catalog full of noise. Developers don't need ten thousand options. They need five great ones.

As Apives grows its catalog while maintaining verification standards, it's becoming the directory that developers with production requirements actually trust.
    `
  },
  {
    id: 4,
    title: "Why API Documentation So Often Fails Developers",
    desc: "The hidden, systemic problems developers face while integrating APIs—and what good documentation actually looks like.",
    category: "Developer Experience",
    read: "6 min read",
    date: "April 29, 2026",
    featured: false,
    views: "7.3K",
    gradient: "from-orange-500/30 to-red-900/40",
    tag: "📄",
    content: `
## The Documentation Gap

There's a persistent, uncomfortable truth in software development: most API documentation is written for the person who built the API, not for the developer trying to use it.

This gap between documentation author and documentation reader creates friction that costs the industry billions of dollars in lost productivity every year.

## The Five Failure Modes

### 1. Example Responses That Aren't Real

The most damaging failure. A doc shows you a response payload with five fields. In production, the actual response has twelve fields—some of which change your integration logic entirely. The example was written during an early version and never updated.

Developers build against the example. Then they hit production. Then they spend two days debugging.

### 2. Auth Flows Described Incorrectly

Authentication is the first thing developers implement and the most critical to get right. Yet auth documentation is among the most frequently wrong. Scopes get changed. Token expiration logic changes. Refresh flows get updated. The docs don't follow.

### 3. Rate Limits Without Context

"Rate limited to 100 requests per minute" tells you almost nothing. Is that per endpoint? Per IP? Per API key? Is it a sliding window or a fixed window? What happens when you hit the limit—a 429 with a Retry-After header, or a silent failure?

Good rate limit documentation answers all of these. Most documentation answers none.

### 4. Error Codes Without Actionable Guidance

A list of error codes is not documentation. `400 Bad Request` is not helpful. What specific field was wrong? What format was expected? What's the correct input?

Developers need to know what to *do* when an error happens, not just that an error happened.

### 5. No Changelog

APIs change. That's fine and expected. What's not fine is changing an API without telling anyone. A changelog is basic professional courtesy. Its absence is a signal that breaking changes will arrive without warning.

## What Great Documentation Looks Like

The best API documentation shares several traits:

- **Real, runnable examples** — Copy-paste code that actually works, tested against the current version.
- **Versioned docs** — You can see what changed between v1 and v2.
- **Interactive testing** — Try the endpoint in the browser before writing any code.
- **Explicit error tables** — Every error code with a cause and a fix.
- **Authentication flow diagrams** — Visual flows for OAuth, API key, JWT.
- **SDK examples in multiple languages** — Not just curl.

## How Apives Helps

Part of Apives' API verification process specifically checks documentation accuracy. We test the actual endpoints against the documented behavior and flag discrepancies. If an API's docs say a field is required but it actually works without it—or vice versa—that gets surfaced.

It won't fix the industry overnight. But it means developers on Apives can trust that what they're reading matches what they'll encounter in production.

That's the standard documentation should always meet.
    `
  },
  {
    id: 5,
    title: "Top 10 Free APIs Every Indie Hacker Should Know in 2026",
    desc: "The best zero-cost, production-ready APIs for solo founders building products without burning through a runway.",
    category: "Indie Hackers",
    read: "8 min read",
    date: "April 25, 2026",
    featured: false,
    views: "21.2K",
    gradient: "from-pink-500/30 to-rose-900/40",
    tag: "🚀",
    content: `
## Building Lean with the Right APIs

The best thing that happened to indie hackers in the last five years is the explosion of generous free API tiers. You can build a legitimately impressive product today with zero API spend if you know which APIs to use.

Here are the ten that consistently deliver real value for solo founders.

## 1. Resend (Email)
$0 for 3,000 emails/month. Clean API, beautiful dashboard, built specifically for developers. If you're not using Resend for transactional email, you're probably overpaying for SendGrid or wrestling with SES configuration.

## 2. Cloudflare Workers (Compute + Edge)
100,000 free requests/day on the Workers free tier. Run code at the edge globally for literally nothing. Pairs perfectly with Cloudflare KV for lightweight data storage.

## 3. Supabase (Database + Auth)
Two free projects, 500MB database storage, 50,000 monthly active users on Auth. Supabase's free tier is genuinely usable in early production—not just for prototypes.

## 4. OpenWeatherMap (Weather)
1,000 API calls/day free. Current weather, 5-day forecasts, historical data. If your app needs weather, this is where you start.

## 5. ExchangeRate-API (Currency)
1,500 free requests/month. Accurate, fast currency conversion for 170+ currencies. No credit card required for the free tier.

## 6. ipapi (IP Geolocation)
1,000 free requests/day. Get country, city, timezone, and currency from an IP address. Useful for personalizing experiences without requiring users to share location.

## 7. NewsAPI (News Data)
100 requests/day on the developer plan. Aggregate headlines from 80,000+ news sources. Perfect for content aggregators, dashboards, or keeping your app contextually aware.

## 8. Abstract API (Email Validation)
100 free validations/month. Catch fake emails before they pollute your user base. The ROI on email validation is enormous when you're trying to keep lists clean.

## 9. Random User Generator
Unlimited free usage. Realistic fake user data for prototypes, demos, and testing. Name, email, avatar, address—everything you need to make a demo look real.

## 10. QuotaGuard Static IP (Proxying)
Free tier available. Sometimes you need a static IP to access an enterprise API that whitelists by IP. QuotaGuard gives you that without a full VPN setup.

## How to Vet a Free API Tier

Before building on any free tier, check:

- **What happens when you exceed the limit?** Hard block, soft limit, or auto-charged?
- **Is there a rate limit on top of the monthly limit?**
- **Does the free tier include webhooks?** Many don't.
- **What's the data retention policy?**

The best free tiers are generous because the companies want you to grow into paid. That alignment of incentives means they're invested in you succeeding. Find those, and build fast.
    `
  },
  {
    id: 6,
    title: "How Apives Verifies Every API Before Listing",
    desc: "Inside the technical process Apives uses to test API quality, endpoints, uptime, documentation accuracy, and real-world reliability.",
    category: "Apives",
    read: "4 min read",
    date: "April 21, 2026",
    featured: false,
    views: "5.8K",
    gradient: "from-cyan-500/30 to-sky-900/40",
    tag: "🔬",
    content: `
## Why Verification Matters

Any website can list APIs. The hard part—the part that actually helps developers—is knowing which ones actually work.

Apives runs a multi-stage verification process on every API before it appears in the directory. Here's exactly how it works.

## Stage 1: Endpoint Reachability

The first check is simple: do the documented endpoints respond? We make requests to every documented endpoint and verify:

- HTTP status codes match expected values
- Response times are under a defined threshold
- SSL certificates are valid and not expiring soon
- CORS headers are correctly configured

If an API fails basic reachability, it doesn't advance.

## Stage 2: Authentication Verification

We verify that the documented authentication method actually works:

- API key authentication: test with a valid key, verify rejection with an invalid key
- OAuth 2.0: walk through the documented flow
- JWT: verify token generation and validation

Many APIs document authentication incorrectly. We catch those discrepancies here.

## Stage 3: Response Schema Validation

This is where most API directories don't go. We compare the actual response schema from each endpoint against what the documentation claims.

If the docs say a response includes `user.email` but the actual response puts it at `data.attributes.email`, we flag it. If documented as required but actually optional, we flag it.

Developers shouldn't have to discover these gaps in production.

## Stage 4: Uptime Monitoring

After an API passes initial verification, it enters ongoing monitoring:

- Health checks every 5 minutes
- P50, P95, P99 latency tracked
- 30-day and 90-day uptime calculated
- Incident history recorded

When you see uptime data on Apives, it's real. It's measured. It's not what the API vendor claims—it's what we've observed.

## Stage 5: Documentation Completeness Score

We evaluate documentation against a rubric:

- Are all endpoints documented?
- Are request parameters described with types and examples?
- Are all error codes listed with descriptions?
- Is there a changelog?
- Are code examples present in at least two languages?
- Is there a sandbox/testing environment?

APIs receive a documentation score. You can filter by this score to find APIs with the best developer experience.

## What Gets Rejected

APIs that don't make the directory:

- Uptime below 99% over 30 days
- Documentation with more than 20% inaccuracy
- No clear pricing information
- Authentication flow that doesn't match documentation
- Endpoints returning unexpected error codes

## Why This Approach Scales

Verification sounds expensive, but automation makes it tractable. Most of our verification pipeline is automated testing infrastructure—the same patterns used in API integration testing, applied at directory scale.

The result: a smaller, higher-quality catalog where every listing you click is one you can actually build on.

That's the Apives promise.
    `
  },
  {
    id: 7,
    title: "Building Faster With Better APIs: A Startup Playbook",
    desc: "Why the APIs you choose in week one determine your velocity in month six—and how to make decisions that compound over time.",
    category: "Startups",
    read: "6 min read",
    date: "April 17, 2026",
    featured: false,
    views: "8.9K",
    gradient: "from-amber-500/30 to-yellow-900/40",
    tag: "📈",
    content: `
## The Compounding Effect of API Choices

Most startup founders think about APIs tactically. "I need email, so I'll use Mailgun. I need payments, so I'll use Stripe." Fair enough.

But the best engineering teams at fast-growing startups think about APIs strategically. The difference shows up six months later when one team is moving at twice the speed of the other.

Here's why API choices compound, and how to make better ones early.

## Technical Debt You Don't See Coming

When you choose an API in week one, you're not just choosing functionality—you're choosing:

- **The shape of your data model** — How you store API responses affects your entire DB schema
- **Your error handling patterns** — A poorly designed error response propagates bad patterns throughout your codebase
- **Your testing strategy** — APIs with good sandboxes produce better-tested code
- **Your observability posture** — APIs with good logging/webhook support make incidents easier to debug

A bad API choice in week one creates refactoring work in month six. A good one becomes a force multiplier.

## The Three Criteria That Matter Most

After talking to dozens of startup CTOs, three factors consistently predict whether an API integration aged well:

### 1. Breaking Change Frequency
Ask: "How often does this API introduce breaking changes, and how much notice do they give?"

APIs that break silently are dangerous. Look for:
- Semantic versioning with actual version deprecation timelines
- A changelog updated at every release
- A mailing list or webhook for change notifications

### 2. Webhook Support
Real-time webhooks vs. polling is not just a performance question—it's an architecture question. Webhooks let you build reactive systems that scale cleanly. Polling creates background jobs that become operational overhead.

Always prefer APIs with robust webhook support, even if you don't need it immediately.

### 3. SDK Quality
A good SDK is worth weeks of development time. Evaluate:
- Is it actively maintained? Check the GitHub commit frequency.
- Does it handle retries and rate limit backoff automatically?
- Is it typed? (TypeScript support matters for maintainability)
- Are there test utilities included?

## The Switching Cost Question

Before committing to any API, ask: "What would it cost to switch from this in 18 months?"

Some APIs are easy to swap out—they're commodity functionality behind a thin abstraction. Others deeply shape your architecture.

For APIs that would be painful to replace:
- Budget more time for the initial evaluation
- Test in production conditions, not just demos
- Negotiate SLA terms if you're at scale
- Build an abstraction layer in your own codebase

## A Fast Evaluation Framework

For any API you're considering, spend 30 minutes on this checklist:

☐ Test the quickstart — Did it work in under 15 minutes?
☐ Read the last 10 GitHub issues — Are they bugs or feature requests?
☐ Check uptime over the last 90 days — Is it above 99.5%?
☐ Find the pricing ceiling — What does it cost at 10x your current usage?
☐ Test the error responses — Are they actionable and consistent?
☐ Check the SDK activity — Has it been updated in the last 3 months?

If an API fails more than two of these, keep looking. There's almost always a better option.

## The Bottom Line

Startups that win on velocity don't just move fast—they make decisions that keep them moving fast. Choosing APIs that are reliable, well-documented, and architect-friendly is one of the highest-leverage decisions an early-stage engineering team makes.

Use directories that verify API quality. Read changelogs. Test before you commit.

The time you invest in picking the right API in week one is returned tenfold by month six.
    `
  },
  {
    id: 8,
    title: "REST vs GraphQL vs gRPC: Which API Style Should You Use in 2026?",
    desc: "A practical breakdown of API design paradigms—when each shines, when each struggles, and how to make the right call for your use case.",
    category: "API Design",
    read: "9 min read",
    date: "April 12, 2026",
    featured: false,
    views: "15.3K",
    gradient: "from-lime-500/30 to-green-900/40",
    tag: "🏗️",
    content: `
## Three Paradigms, One Decision

The REST vs GraphQL vs gRPC debate has been running for years, and it's still generating heat. That's because there isn't a universal right answer—each approach has genuine strengths and genuine weaknesses.

But there are patterns. And once you understand them, the decision becomes straightforward for most use cases.

## REST: The Default for Good Reason

REST (Representational State Transfer) is the dominant API paradigm for a reason. It maps naturally to HTTP, it's universally understood, and every major language has mature REST client libraries.

**When REST wins:**
- Public APIs consumed by many different clients
- CRUD-heavy applications (most web apps)
- Teams with varying experience levels
- When you need excellent caching (REST is cache-friendly by design)
- Simple, well-defined resource models

**When REST struggles:**
- Complex queries requiring data from multiple resources (N+1 problem)
- Mobile clients on constrained networks (over-fetching is real)
- Rapidly evolving schemas where versioning becomes complex
- Real-time requirements (REST is request-response, not event-driven)

**Best for:** Public APIs, standard web applications, teams prioritizing simplicity.

## GraphQL: The Right Tool for Complex Data

GraphQL solves specific problems that REST doesn't solve elegantly. The core insight: let clients request exactly the data they need, in exactly the shape they need it.

**When GraphQL wins:**
- Applications with complex, nested data relationships
- Mobile clients where bandwidth matters
- Products where the frontend evolves faster than the backend
- When you're serving multiple client types (web, mobile, third-party) from one API
- Rapid product iteration where data requirements change frequently

**When GraphQL struggles:**
- Simple CRUD applications (overkill)
- Caching (HTTP caching doesn't work naturally with GraphQL)
- File uploads (awkward to implement)
- Teams new to the paradigm (the learning curve is real)
- Performance monitoring (complex queries are hard to trace)

**Best for:** Product APIs, complex frontend apps, companies building developer platforms.

## gRPC: Extreme Performance for Internal Services

gRPC uses Protocol Buffers (a binary format) and HTTP/2 to achieve performance that REST and GraphQL simply can't match. The tradeoff is complexity and limited browser support.

**When gRPC wins:**
- Microservices communicating with each other (internal APIs)
- High-throughput, low-latency requirements
- Strongly-typed contracts across team boundaries
- Streaming data (gRPC has native streaming support)
- Polyglot environments (gRPC generates client code for many languages)

**When gRPC struggles:**
- Browser-based clients (gRPC-Web is a workaround, not a solution)
- Public APIs (developer experience is worse than REST/GraphQL)
- Debugging (binary format is not human-readable)
- Teams without protocol buffer experience

**Best for:** Internal microservices, high-performance backends, data streaming pipelines.

## The Decision Framework

Answer these questions:

1. **Is this a public or internal API?**
   - Public → REST or GraphQL
   - Internal → gRPC is worth serious consideration

2. **How complex is your data model?**
   - Simple resources → REST
   - Complex relationships → GraphQL

3. **What are your performance requirements?**
   - Standard web performance → REST or GraphQL
   - Extreme throughput, sub-millisecond latency → gRPC

4. **Who are your primary clients?**
   - Browsers → REST or GraphQL (gRPC has browser limitations)
   - Mobile apps with complex data needs → GraphQL
   - Backend services → gRPC

## The Hybrid Approach

Most mature companies use all three:
- **REST** for public-facing APIs
- **GraphQL** for their primary product API
- **gRPC** for internal service communication

That's not indecision—it's using the right tool for each job. The mistake is forcing one paradigm everywhere because it's what your team knows.

In 2026, the question isn't "which is best?" It's "which is best for this specific use case?"

Learn all three. Use each where it shines.
    `
  }
];

const CATEGORIES = ["All", "API Discovery", "Search APIs", "Apives vs Others", "Developer Experience", "Indie Hackers", "Apives", "Startups", "API Design"];

export default function ApivesBlogsPage() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [scrolled, setScrolled] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const articleRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      if (selectedArticle && articleRef.current) {
        const el = articleRef.current;
        const scrollTop = el.scrollTop;
        const scrollHeight = el.scrollHeight - el.clientHeight;
        setReadingProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedArticle]);

  const filtered = ARTICLES.filter(a => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = ARTICLES[0];
  const trending = [...ARTICLES].sort((a, b) => parseFloat(b.views) - parseFloat(a.views)).slice(0, 3);

  function renderContent(content) {
    const lines = content.trim().split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-8 mb-3" style={{fontFamily:"'Syne', sans-serif"}}>{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="text-base font-semibold text-emerald-400 mt-6 mb-2">{line.slice(4)}</h3>;
      if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="text-white font-semibold mt-3">{line.slice(2,-2)}</p>;
      if (line.startsWith("- ")) return <li key={i} className="text-zinc-300 text-sm leading-relaxed ml-4 list-disc">{line.slice(2)}</li>;
      if (line.startsWith("☐ ")) return <div key={i} className="flex items-start gap-2 text-sm text-zinc-300 my-1"><span className="text-emerald-400 mt-0.5">☐</span><span>{line.slice(2)}</span></div>;
      if (line.startsWith("|")) return null;
      if (line.trim() === "") return <div key={i} className="h-2" />;
      return <p key={i} className="text-zinc-300 text-sm leading-relaxed">{line}</p>;
    });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050a0b; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d1a1c; }
        ::-webkit-scrollbar-thumb { background: #10b981; border-radius: 2px; }
        .grid-bg {
          background-image: linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .card-hover { transition: all 0.25s cubic-bezier(.4,0,.2,1); }
        .card-hover:hover { transform: translateY(-3px); border-color: rgba(16,185,129,0.4) !important; }
        .article-modal { animation: slideUp 0.3s cubic-bezier(.4,0,.2,1); }
        @keyframes slideUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        .tag-pill { transition: all 0.18s; cursor: pointer; }
        .tag-pill:hover { background: rgba(16,185,129,0.2); color: #34d399; }
        .tag-pill.active { background: #10b981; color: #000; font-weight: 600; }
        .progress-bar { transition: width 0.1s linear; }
        .glow { box-shadow: 0 0 40px rgba(16,185,129,0.15); }
        .noise::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          border-radius: inherit;
        }
      `}</style>

      <div style={{fontFamily:"'DM Sans', sans-serif", background:"#050a0b", minHeight:"100vh", color:"#fff"}}>

        {/* NAV */}
        <nav style={{
          position:"fixed", top:0, left:0, right:0, zIndex:100,
          background: scrolled ? "rgba(5,10,11,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
          transition: "all 0.3s"
        }}>
          <div style={{maxWidth:1100, margin:"0 auto", padding:"0 24px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <div style={{fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:20, letterSpacing:"-0.5px"}}>
              <span style={{color:"#10b981"}}>api</span>ves
            </div>
            <div style={{display:"flex", gap:24, fontSize:13, color:"#6b7280"}}>
              {["Home","APIs","Blog","Pricing","Docs"].map(n => (
                <span key={n} style={{cursor:"pointer", color: n === "Blog" ? "#10b981" : "#6b7280", transition:"color 0.2s"}}
                  onMouseEnter={e=>e.target.style.color="#fff"}
                  onMouseLeave={e=>e.target.style.color= n === "Blog" ? "#10b981" : "#6b7280"}
                >{n}</span>
              ))}
            </div>
            <button style={{background:"#10b981", color:"#000", border:"none", borderRadius:20, padding:"7px 16px", fontSize:12, fontWeight:600, cursor:"pointer"}}>
              Get Started
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section className="grid-bg noise" style={{position:"relative", paddingTop:120, paddingBottom:80, borderBottom:"1px solid rgba(255,255,255,0.07)", overflow:"hidden"}}>
          <div style={{position:"absolute", top:-100, right:-100, width:500, height:500, background:"radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)", pointerEvents:"none"}} />
          <div style={{maxWidth:1100, margin:"0 auto", padding:"0 24px"}}>
            <div style={{display:"inline-flex", alignItems:"center", gap:8, borderRadius:20, border:"1px solid rgba(16,185,129,0.25)", background:"rgba(16,185,129,0.07)", padding:"5px 14px", fontSize:11, color:"#34d399", marginBottom:20, fontWeight:500}}>
              <span style={{width:6, height:6, borderRadius:"50%", background:"#10b981", display:"inline-block"}} />
              Developer Insights & API Resources
            </div>
            <h1 style={{fontFamily:"'Syne', sans-serif", fontSize:"clamp(36px, 6vw, 68px)", fontWeight:800, lineHeight:1.05, letterSpacing:"-2px", maxWidth:700, marginBottom:16}}>
              The blog for<br />
              <span style={{color:"#10b981"}}>API-first</span> developers.
            </h1>
            <p style={{color:"#6b7280", fontSize:15, maxWidth:480, lineHeight:1.7, marginBottom:32}}>
              Verified guides, honest comparisons, and practical insights for building with APIs in production.
            </p>
            <div style={{display:"flex", gap:12, flexWrap:"wrap", alignItems:"center"}}>
              <div style={{position:"relative", display:"flex", alignItems:"center"}}>
                <svg style={{position:"absolute", left:14, color:"#6b7280", pointerEvents:"none"}} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:40, padding:"10px 16px 10px 36px", fontSize:13, color:"#fff", width:260, outline:"none", transition:"border 0.2s"}}
                  onFocus={e=>e.target.style.borderColor="#10b981"}
                  onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}
                />
              </div>
              <div style={{display:"flex", alignItems:"center", gap:6, color:"#6b7280", fontSize:12}}>
                <span>{ARTICLES.length} articles</span>
                <span>·</span>
                <span style={{color:"#10b981"}}>All verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY PILLS */}
        <div style={{borderBottom:"1px solid rgba(255,255,255,0.06)", position:"sticky", top:60, background:"rgba(5,10,11,0.95)", backdropFilter:"blur(12px)", zIndex:50}}>
          <div style={{maxWidth:1100, margin:"0 auto", padding:"0 24px", overflowX:"auto"}}>
            <div style={{display:"flex", gap:6, padding:"12px 0", whiteSpace:"nowrap"}}>
              {CATEGORIES.map(cat => (
                <button key={cat} className={`tag-pill ${activeCategory===cat?"active":""}`}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    background: activeCategory===cat ? "#10b981" : "rgba(255,255,255,0.05)",
                    color: activeCategory===cat ? "#000" : "#9ca3af",
                    border: "1px solid",
                    borderColor: activeCategory===cat ? "#10b981" : "rgba(255,255,255,0.08)",
                    borderRadius:40, padding:"6px 14px", fontSize:11, fontWeight:500, cursor:"pointer"
                  }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{maxWidth:1100, margin:"0 auto", padding:"48px 24px 80px"}}>

          {/* FEATURED */}
          {activeCategory === "All" && !searchQuery && (
            <div style={{marginBottom:56}}>
              <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:20}}>
                <div style={{width:3, height:18, background:"#10b981", borderRadius:2}} />
                <span style={{fontSize:11, fontWeight:600, color:"#6b7280", letterSpacing:"0.08em", textTransform:"uppercase"}}>Featured</span>
              </div>
              <div className="card-hover glow" onClick={() => setSelectedArticle(featured)}
                style={{
                  background:"linear-gradient(135deg, rgba(16,185,129,0.08), rgba(0,0,0,0.4))",
                  border:"1px solid rgba(16,185,129,0.2)", borderRadius:20,
                  padding:"40px 44px", cursor:"pointer", display:"grid",
                  gridTemplateColumns:"1fr auto", gap:32, alignItems:"center",
                  position:"relative", overflow:"hidden"
                }}>
                <div style={{position:"absolute", top:-60, right:-60, width:280, height:280, background:"radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", pointerEvents:"none"}} />
                <div>
                  <div style={{display:"flex", gap:10, marginBottom:16, alignItems:"center"}}>
                    <span style={{fontSize:20}}>{featured.tag}</span>
                    <span style={{fontSize:11, color:"#10b981", fontWeight:500, background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:20, padding:"3px 10px"}}>{featured.category}</span>
                    <span style={{fontSize:11, color:"#6b7280"}}>{featured.read}</span>
                    <span style={{fontSize:11, color:"#6b7280"}}>·</span>
                    <span style={{fontSize:11, color:"#6b7280"}}>👁 {featured.views}</span>
                  </div>
                  <h2 style={{fontFamily:"'Syne', sans-serif", fontSize:"clamp(20px, 3vw, 30px)", fontWeight:700, lineHeight:1.2, marginBottom:12, maxWidth:600}}>
                    {featured.title}
                  </h2>
                  <p style={{color:"#9ca3af", fontSize:14, lineHeight:1.7, maxWidth:560}}>{featured.desc}</p>
                  <div style={{display:"flex", alignItems:"center", gap:6, marginTop:20, color:"#10b981", fontSize:13, fontWeight:500}}>
                    Read article <span style={{fontSize:16}}>→</span>
                  </div>
                </div>
                <div style={{
                  width:160, height:160, borderRadius:16, flexShrink:0,
                  background:"linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:64
                }}>{featured.tag}</div>
              </div>
            </div>
          )}

          {/* TRENDING ROW */}
          {activeCategory === "All" && !searchQuery && (
            <div style={{marginBottom:56}}>
              <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:20}}>
                <div style={{width:3, height:18, background:"#f59e0b", borderRadius:2}} />
                <span style={{fontSize:11, fontWeight:600, color:"#6b7280", letterSpacing:"0.08em", textTransform:"uppercase"}}>Trending</span>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16}}>
                {trending.map((a, i) => (
                  <div key={a.id} className="card-hover" onClick={() => setSelectedArticle(a)}
                    style={{
                      background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
                      borderRadius:16, padding:"20px", cursor:"pointer", display:"flex", gap:16, alignItems:"flex-start"
                    }}>
                    <div style={{fontSize:28, flexShrink:0, width:44, height:44, background:"rgba(255,255,255,0.04)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center"}}>{a.tag}</div>
                    <div>
                      <div style={{display:"flex", gap:8, marginBottom:6, alignItems:"center"}}>
                        <span style={{fontSize:10, color:"#10b981", fontWeight:500}}>{a.category}</span>
                        <span style={{fontSize:10, color:"#6b7280"}}>👁 {a.views}</span>
                      </div>
                      <div style={{fontSize:13, fontWeight:600, lineHeight:1.4, color:"#e5e7eb"}}>{a.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ALL ARTICLES GRID */}
          <div>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12}}>
              <div style={{display:"flex", alignItems:"center", gap:8}}>
                <div style={{width:3, height:18, background:"#fff", borderRadius:2}} />
                <span style={{fontSize:11, fontWeight:600, color:"#6b7280", letterSpacing:"0.08em", textTransform:"uppercase"}}>
                  {searchQuery ? `Results for "${searchQuery}"` : activeCategory === "All" ? "All Articles" : activeCategory}
                </span>
                <span style={{fontSize:11, color:"#374151", background:"rgba(255,255,255,0.05)", borderRadius:20, padding:"2px 8px"}}>{filtered.length}</span>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={{textAlign:"center", padding:"60px 0", color:"#6b7280"}}>
                <div style={{fontSize:40, marginBottom:12}}>🔍</div>
                <div style={{fontSize:15}}>No articles found for "{searchQuery}"</div>
              </div>
            ) : (
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:20}}>
                {filtered.map(a => (
                  <div key={a.id} className="card-hover" onClick={() => setSelectedArticle(a)}
                    style={{
                      background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
                      borderRadius:18, overflow:"hidden", cursor:"pointer"
                    }}>
                    <div style={{height:100, background:`linear-gradient(135deg, ${a.gradient.replace("from-","").replace("to-","")})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, position:"relative"}}>
                      {a.tag}
                      <div style={{position:"absolute", top:10, right:10, fontSize:10, background:"rgba(0,0,0,0.5)", borderRadius:20, padding:"2px 8px", color:"#9ca3af", backdropFilter:"blur(4px)"}}>
                        👁 {a.views}
                      </div>
                    </div>
                    <div style={{padding:"20px"}}>
                      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
                        <span style={{fontSize:10, color:"#10b981", fontWeight:500, background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.15)", borderRadius:20, padding:"3px 10px"}}>{a.category}</span>
                        <span style={{fontSize:10, color:"#6b7280"}}>{a.read}</span>
                      </div>
                      <h3 style={{fontFamily:"'Syne', sans-serif", fontSize:15, fontWeight:700, lineHeight:1.35, marginBottom:8, color:"#f3f4f6"}}>{a.title}</h3>
                      <p style={{fontSize:12, color:"#6b7280", lineHeight:1.65, marginBottom:14}}>{a.desc}</p>
                      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                        <span style={{fontSize:11, color:"#4b5563"}}>{a.date}</span>
                        <span style={{fontSize:12, color:"#10b981", fontWeight:500}}>Read →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ARTICLE MODAL */}
        {selectedArticle && (
          <div style={{position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"0"}}
            onClick={e => { if(e.target === e.currentTarget) setSelectedArticle(null); }}>
            <div style={{position:"absolute", inset:0, background:"rgba(0,0,0,0.85)", backdropFilter:"blur(8px)"}} onClick={() => setSelectedArticle(null)} />
            <div className="article-modal" ref={articleRef}
              onScroll={e => {
                const el = e.target;
                const p = el.scrollHeight - el.clientHeight;
                setReadingProgress(p > 0 ? (el.scrollTop / p) * 100 : 0);
              }}
              style={{
                position:"relative", background:"#0d1a1c", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:"0 0 20px 20px", width:"100%", maxWidth:720,
                maxHeight:"100vh", overflowY:"auto", zIndex:201, marginTop:0
              }}>
              {/* Progress bar */}
              <div style={{position:"sticky", top:0, height:2, background:"rgba(255,255,255,0.06)", zIndex:10}}>
                <div className="progress-bar" style={{height:"100%", background:"#10b981", width:`${readingProgress}%`}} />
              </div>

              {/* Modal header */}
              <div style={{padding:"20px 28px 0", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div style={{display:"flex", gap:8, alignItems:"center"}}>
                  <span style={{fontSize:11, color:"#10b981", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:20, padding:"3px 10px", fontWeight:500}}>{selectedArticle.category}</span>
                  <span style={{fontSize:11, color:"#4b5563"}}>{selectedArticle.read}</span>
                  <span style={{fontSize:11, color:"#4b5563"}}>·</span>
                  <span style={{fontSize:11, color:"#4b5563"}}>{selectedArticle.date}</span>
                </div>
                <button onClick={() => setSelectedArticle(null)}
                  style={{background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#9ca3af", fontSize:16}}>
                  ×
                </button>
              </div>

              <div style={{padding:"20px 28px 40px"}}>
                <div style={{fontSize:40, marginBottom:16}}>{selectedArticle.tag}</div>
                <h1 style={{fontFamily:"'Syne', sans-serif", fontSize:"clamp(20px, 4vw, 28px)", fontWeight:800, lineHeight:1.2, marginBottom:16, letterSpacing:"-0.5px"}}>{selectedArticle.title}</h1>
                <p style={{color:"#6b7280", fontSize:14, lineHeight:1.7, marginBottom:28, paddingBottom:24, borderBottom:"1px solid rgba(255,255,255,0.07)"}}>{selectedArticle.desc}</p>
                <div style={{fontSize:14}}>{renderContent(selectedArticle.content)}</div>

                {/* Related articles */}
                <div style={{marginTop:40, paddingTop:28, borderTop:"1px solid rgba(255,255,255,0.07)"}}>
                  <div style={{fontSize:11, color:"#6b7280", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:16}}>More Articles</div>
                  <div style={{display:"flex", flexDirection:"column", gap:10}}>
                    {ARTICLES.filter(a => a.id !== selectedArticle.id).slice(0,3).map(a => (
                      <div key={a.id} onClick={() => setSelectedArticle(a)}
                        style={{display:"flex", gap:12, alignItems:"center", padding:"12px 14px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, cursor:"pointer", transition:"border-color 0.2s"}}
                        onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(16,185,129,0.3)"}
                        onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
                        <span style={{fontSize:20, flexShrink:0}}>{a.tag}</span>
                        <div>
                          <div style={{fontSize:12, fontWeight:600, color:"#e5e7eb", lineHeight:1.3}}>{a.title}</div>
                          <div style={{fontSize:11, color:"#6b7280", marginTop:2}}>{a.category} · {a.read}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}