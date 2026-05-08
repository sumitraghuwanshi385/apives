import { useState, useEffect, useRef } from "react";
import {
  Search, Clock, Eye, TrendingUp, ArrowRight, X,
  Bookmark, ChevronRight, Layers, Zap, Cpu, Code2,
  FileText, Rocket, BarChart2, BookOpen, Swords, Star
} from "lucide-react";

// ── Data ────────────────────────────────────────────────────────────────────

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
    accent: "#10b981",
    Icon: Search,
    content: `## The API Discovery Problem

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

The goal isn't just to find an API. It's to find one you can build on confidently—one that won't wake you up at 3am when a third-party dependency silently changes.`
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
    accent: "#3b82f6",
    Icon: Zap,
    content: `## Why Search APIs Matter More Than Ever

Search isn't a feature anymore—it's infrastructure. Users expect instant, relevant, typo-tolerant results in every application they touch. Building great search from scratch is a six-month project. Using the right search API is a two-day integration.

But not all search APIs are created equal. In 2026, the market has matured significantly, and the differences between options are sharper than ever.

## The Contenders

### Algolia
Still the gold standard for developer experience. Algolia's dashboard is polished, their SDKs work across every major language, and their typo tolerance is genuinely excellent. The catch: pricing scales aggressively past the free tier.

**Best for:** SaaS products, e-commerce, documentation search.
**Pricing:** Free up to 10K records. Paid plans from $50/month.

### Typesense
The open-source alternative that's been closing the gap fast. Typesense is blazingly fast (sub-50ms at scale), can be self-hosted, and has a generous cloud tier.

**Best for:** Teams that want control, indie hackers, budget-conscious startups.
**Pricing:** Free self-hosted. Cloud from $0.000015 per search operation.

### Meilisearch
Another strong open-source contender. Meilisearch prioritizes ease of setup—you can have a working search instance in under five minutes.

**Best for:** Blogs, small apps, rapid prototypes.
**Pricing:** Free self-hosted. Cloud plans from €29/month.

### Elasticsearch (OpenSearch)
The enterprise powerhouse. Complex to set up and operate, but unmatched in flexibility.

**Best for:** Enterprise applications, log analysis, complex data search.
**Pricing:** Free self-hosted. AWS OpenSearch from ~$0.02/hour.

## The Verdict

For most modern applications in 2026, **Typesense Cloud** hits the best balance of performance, pricing, and simplicity. If you need enterprise-grade support and maximum DX polish, Algolia is still king.`
  },
  {
    id: 3,
    title: "Apives vs. RapidAPI vs. ProgrammableWeb: Which Directory Actually Helps?",
    desc: "An honest comparison of the top API marketplaces—what each does well, where they fall short, and why verification changes everything.",
    category: "Apives vs Others",
    read: "8 min read",
    date: "May 2, 2026",
    featured: false,
    views: "18.7K",
    accent: "#8b5cf6",
    Icon: Swords,
    content: `## The API Directory Landscape in 2026

When a developer needs an API, they usually start with a search engine or one of three major directories: RapidAPI, ProgrammableWeb, or Apives. Each takes a fundamentally different approach to the same problem.

## RapidAPI

RapidAPI is the largest API marketplace on the internet. They have tens of thousands of APIs, a unified authentication layer, and billing abstraction.

**What it does well:**
- Massive catalog
- Unified API key (one key for multiple APIs)
- Built-in billing and usage tracking
- In-browser testing console

**Where it falls short:**
- Quality is inconsistent. Thousands of APIs are abandoned, broken, or poorly maintained.
- The unified billing model creates vendor lock-in
- No independent verification of uptime or docs accuracy

## ProgrammableWeb

ProgrammableWeb was the original API directory—launched in 2005, it was the definitive reference for years. In 2021, MuleSoft (Salesforce) shut it down. The archive is accessible but no longer maintained.

**Current status:** Legacy resource only. Don't rely on it for current API discovery.

## Apives

Apives takes a different philosophy: fewer APIs, verified quality.

**What it does well:**
- Active verification of endpoints, uptime, and documentation
- Curated catalog—APIs are tested before listing
- Real uptime data, not just what vendors claim
- Clean, fast discovery UX focused on developer needs

## The Bottom Line

If you want **volume**, go to RapidAPI. If you want **quality you can trust**, use Apives.

The fundamental insight Apives is built on: a smaller catalog of verified, working APIs is more valuable than a massive catalog full of noise. Developers don't need ten thousand options. They need five great ones.`
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
    accent: "#f59e0b",
    Icon: FileText,
    content: `## The Documentation Gap

There's a persistent, uncomfortable truth in software development: most API documentation is written for the person who built the API, not for the developer trying to use it.

## The Five Failure Modes

### 1. Example Responses That Aren't Real
The most damaging failure. A doc shows you a response payload with five fields. In production, the actual response has twelve fields—some of which change your integration logic entirely.

### 2. Auth Flows Described Incorrectly
Authentication is the first thing developers implement and the most critical to get right. Yet auth documentation is among the most frequently wrong.

### 3. Rate Limits Without Context
"Rate limited to 100 requests per minute" tells you almost nothing. Is that per endpoint? Per IP? Per API key? Is it a sliding window or a fixed window?

### 4. Error Codes Without Actionable Guidance
A list of error codes is not documentation. What specific field was wrong? What format was expected? What's the correct input?

### 5. No Changelog
APIs change. That's fine and expected. What's not fine is changing an API without telling anyone.

## What Great Documentation Looks Like

The best API documentation shares several traits:

- **Real, runnable examples** — Copy-paste code that actually works.
- **Versioned docs** — You can see what changed between v1 and v2.
- **Interactive testing** — Try the endpoint in the browser before writing any code.
- **Explicit error tables** — Every error code with a cause and a fix.
- **Authentication flow diagrams** — Visual flows for OAuth, API key, JWT.`
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
    accent: "#ec4899",
    Icon: Rocket,
    content: `## Building Lean with the Right APIs

The best thing that happened to indie hackers in the last five years is the explosion of generous free API tiers. You can build a legitimately impressive product today with zero API spend if you know which APIs to use.

## 1. Resend (Email)
$0 for 3,000 emails/month. Clean API, beautiful dashboard, built specifically for developers. If you're not using Resend for transactional email, you're probably overpaying.

## 2. Cloudflare Workers (Compute + Edge)
100,000 free requests/day on the Workers free tier. Run code at the edge globally for literally nothing.

## 3. Supabase (Database + Auth)
Two free projects, 500MB database storage, 50,000 monthly active users on Auth. Supabase's free tier is genuinely usable in early production.

## 4. OpenWeatherMap (Weather)
1,000 API calls/day free. Current weather, 5-day forecasts, historical data.

## 5. ExchangeRate-API (Currency)
1,500 free requests/month. Accurate, fast currency conversion for 170+ currencies. No credit card required.

## 6. ipapi (IP Geolocation)
1,000 free requests/day. Get country, city, timezone, and currency from an IP address.

## 7. NewsAPI (News Data)
100 requests/day on the developer plan. Aggregate headlines from 80,000+ news sources.

## 8. Abstract API (Email Validation)
100 free validations/month. Catch fake emails before they pollute your user base.

## How to Vet a Free API Tier

Before building on any free tier, check:

- **What happens when you exceed the limit?** Hard block, soft limit, or auto-charged?
- **Is there a rate limit on top of the monthly limit?**
- **Does the free tier include webhooks?** Many don't.
- **What's the data retention policy?**`
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
    accent: "#06b6d4",
    Icon: Cpu,
    content: `## Why Verification Matters

Any website can list APIs. The hard part—the part that actually helps developers—is knowing which ones actually work.

Apives runs a multi-stage verification process on every API before it appears in the directory.

## Stage 1: Endpoint Reachability

The first check is simple: do the documented endpoints respond? We verify:

- HTTP status codes match expected values
- Response times are under a defined threshold
- SSL certificates are valid and not expiring soon
- CORS headers are correctly configured

## Stage 2: Authentication Verification

We verify that the documented authentication method actually works:

- API key authentication: test with a valid key, verify rejection with an invalid key
- OAuth 2.0: walk through the documented flow
- JWT: verify token generation and validation

## Stage 3: Response Schema Validation

We compare the actual response schema from each endpoint against what the documentation claims. If the docs say a field exists but the actual response puts it elsewhere, we flag it.

## Stage 4: Uptime Monitoring

After an API passes initial verification, it enters ongoing monitoring:

- Health checks every 5 minutes
- P50, P95, P99 latency tracked
- 30-day and 90-day uptime calculated
- Incident history recorded

## Stage 5: Documentation Completeness Score

We evaluate documentation against a rubric covering endpoint coverage, parameter descriptions, error codes, changelog presence, and code examples.

## What Gets Rejected

- Uptime below 99% over 30 days
- Documentation with more than 20% inaccuracy
- No clear pricing information
- Authentication flow that doesn't match documentation`
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
    accent: "#f97316",
    Icon: BarChart2,
    content: `## The Compounding Effect of API Choices

Most startup founders think about APIs tactically. "I need email, so I'll use Mailgun. I need payments, so I'll use Stripe." Fair enough.

But the best engineering teams at fast-growing startups think about APIs strategically. The difference shows up six months later when one team is moving at twice the speed of the other.

## Technical Debt You Don't See Coming

When you choose an API in week one, you're not just choosing functionality—you're choosing:

- **The shape of your data model** — How you store API responses affects your entire DB schema
- **Your error handling patterns** — A poorly designed error response propagates bad patterns throughout your codebase
- **Your testing strategy** — APIs with good sandboxes produce better-tested code
- **Your observability posture** — APIs with good logging/webhook support make incidents easier to debug

## The Three Criteria That Matter Most

### 1. Breaking Change Frequency
Look for: semantic versioning with actual deprecation timelines, a changelog updated at every release, a mailing list for change notifications.

### 2. Webhook Support
Real-time webhooks vs. polling is not just a performance question—it's an architecture question. Always prefer APIs with robust webhook support, even if you don't need it immediately.

### 3. SDK Quality
A good SDK is worth weeks of development time. Check GitHub commit frequency, retry/backoff handling, TypeScript support, and test utilities.

## A Fast Evaluation Framework

For any API you're considering, spend 30 minutes:

- Test the quickstart — Did it work in under 15 minutes?
- Read the last 10 GitHub issues — Are they bugs or feature requests?
- Check uptime over the last 90 days — Is it above 99.5%?
- Find the pricing ceiling — What does it cost at 10x your current usage?`
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
    accent: "#84cc16",
    Icon: Layers,
    content: `## Three Paradigms, One Decision

The REST vs GraphQL vs gRPC debate has been running for years, and it's still generating heat. That's because there isn't a universal right answer—each approach has genuine strengths and genuine weaknesses.

## REST: The Default for Good Reason

REST maps naturally to HTTP, it's universally understood, and every major language has mature REST client libraries.

**When REST wins:**
- Public APIs consumed by many different clients
- CRUD-heavy applications (most web apps)
- When you need excellent caching (REST is cache-friendly by design)
- Simple, well-defined resource models

**When REST struggles:**
- Complex queries requiring data from multiple resources (N+1 problem)
- Mobile clients on constrained networks (over-fetching is real)
- Real-time requirements

## GraphQL: The Right Tool for Complex Data

**When GraphQL wins:**
- Applications with complex, nested data relationships
- Mobile clients where bandwidth matters
- Products where the frontend evolves faster than the backend
- When you're serving multiple client types from one API

**When GraphQL struggles:**
- Simple CRUD applications (overkill)
- Caching (HTTP caching doesn't work naturally)
- Teams new to the paradigm

## gRPC: Extreme Performance for Internal Services

**When gRPC wins:**
- Microservices communicating with each other
- High-throughput, low-latency requirements
- Strongly-typed contracts across team boundaries
- Streaming data

**When gRPC struggles:**
- Browser-based clients
- Public APIs (developer experience is worse)
- Debugging (binary format is not human-readable)

## The Hybrid Approach

Most mature companies use all three: REST for public-facing APIs, GraphQL for their primary product API, and gRPC for internal service communication. That's not indecision—it's using the right tool for each job.`
  }
];

const CATEGORIES = [
  "All", "API Discovery", "Search APIs", "Apives vs Others",
  "Developer Experience", "Indie Hackers", "Apives", "Startups", "API Design"
];

const CATEGORY_ICONS = {
  "All": Layers,
  "API Discovery": Search,
  "Search APIs": Zap,
  "Apives vs Others": Swords,
  "Developer Experience": Code2,
  "Indie Hackers": Rocket,
  "Apives": Star,
  "Startups": BarChart2,
  "API Design": Cpu,
};

// ── Markdown renderer ────────────────────────────────────────────────────────

function renderContent(content) {
  const lines = content.trim().split("\n");
  const elements = [];
  let listBuffer = [];

  const flushList = (key) => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} className="my-3 space-y-1.5 pl-5">
          {listBuffer.map((item, j) => (
            <li key={j} className="text-zinc-400 text-[13.5px] leading-relaxed list-disc marker:text-emerald-500">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  lines.forEach((line, i) => {
    if (line.startsWith("## ")) {
      flushList(i);
      elements.push(
        <h2 key={i} className="text-[17px] font-semibold text-white mt-8 mb-3 tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushList(i);
      elements.push(
        <h3 key={i} className="text-[14px] font-semibold text-emerald-400 mt-5 mb-2">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList(i);
      elements.push(<div key={i} className="h-1" />);
    } else {
      flushList(i);
      elements.push(
        <p key={i} className="text-zinc-400 text-[13.5px] leading-relaxed">
          {renderInline(line)}
        </p>
      );
    }
  });
  flushList("end");
  return elements;
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-zinc-200 font-semibold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

// ── Sub-components ───────────────────────────────────────────────────────────

function ArticleCard({ article, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
    >
      {/* Card accent bar */}
      <div
        className="h-[2px] w-full opacity-60"
        style={{ background: `linear-gradient(90deg, ${article.accent}, transparent)` }}
      />
      <div className="p-5">
        {/* Icon + category row */}
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${article.accent}18`, border: `1px solid ${article.accent}30` }}
          >
            <article.Icon size={14} style={{ color: article.accent }} />
          </div>
          <span
            className="text-[10.5px] font-medium px-2.5 py-0.5 rounded-full border"
            style={{ color: article.accent, background: `${article.accent}12`, borderColor: `${article.accent}25` }}
          >
            {article.category}
          </span>
          <span className="text-[10.5px] text-zinc-600 ml-auto">{article.date}</span>
        </div>

        {/* Title */}
        <h3
          className="text-[14px] font-semibold text-zinc-100 leading-snug mb-2 group-hover:text-white transition-colors"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {article.title}
        </h3>

        {/* Desc */}
        <p className="text-[12px] text-zinc-500 leading-relaxed mb-4 line-clamp-2">
          {article.desc}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-[11px] text-zinc-600">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {article.read}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={11} />
            {article.views}
          </span>
          <span className="ml-auto flex items-center gap-0.5 font-medium transition-colors" style={{ color: article.accent }}>
            Read <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </button>
  );
}

function TrendingCard({ article, rank, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex items-start gap-3 p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/[0.05] hover:border-white/[0.13] focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
    >
      <span className="text-[11px] font-bold text-zinc-700 w-5 shrink-0 mt-0.5">
        {String(rank).padStart(2, "0")}
      </span>
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${article.accent}18`, border: `1px solid ${article.accent}28` }}
      >
        <article.Icon size={13} style={{ color: article.accent }} />
      </div>
      <div className="min-w-0">
        <p
          className="text-[12.5px] font-semibold text-zinc-200 leading-snug mb-1 group-hover:text-white transition-colors"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {article.title}
        </p>
        <div className="flex items-center gap-2 text-[10.5px] text-zinc-600">
          <Eye size={10} />
          {article.views}
          <span className="text-zinc-700">·</span>
          {article.read}
        </div>
      </div>
    </button>
  );
}

// ── Article Modal ────────────────────────────────────────────────────────────

function ArticleModal({ article, onClose, onSelectArticle }) {
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 220);
  };

  const onScroll = (e) => {
    const el = e.currentTarget;
    const h = el.scrollHeight - el.clientHeight;
    setProgress(h > 0 ? (el.scrollTop / h) * 100 : 0);
  };

  const related = ARTICLES.filter(a => a.id !== article.id).slice(0, 3);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center"
      style={{ padding: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="relative z-10 w-full max-w-[700px] h-screen overflow-y-auto bg-[#0a1214] border-x border-white/[0.08] transition-all duration-220"
        style={{
          transform: visible ? "translateY(0)" : "translateY(24px)",
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Reading progress */}
        <div className="sticky top-0 h-[2px] bg-white/[0.06] z-20">
          <div
            className="h-full bg-emerald-500 transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Sticky header */}
        <div className="sticky top-[2px] z-10 px-7 py-3.5 flex items-center justify-between bg-[#0a1214]/95 backdrop-blur border-b border-white/[0.07]">
          <div className="flex items-center gap-2">
            <span
              className="text-[10.5px] font-medium px-2.5 py-0.5 rounded-full border"
              style={{ color: article.accent, background: `${article.accent}12`, borderColor: `${article.accent}28` }}
            >
              {article.category}
            </span>
            <span className="text-[10.5px] text-zinc-600 flex items-center gap-1">
              <Clock size={10} />{article.read}
            </span>
            <span className="text-zinc-700 text-[10.5px]">·</span>
            <span className="text-[10.5px] text-zinc-600">{article.date}</span>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.1] transition-all cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>

        {/* Content */}
        <div className="px-7 py-8 pb-16">
          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
            style={{ background: `${article.accent}18`, border: `1px solid ${article.accent}30` }}
          >
            <article.Icon size={20} style={{ color: article.accent }} />
          </div>

          <h1
            className="text-[22px] font-bold text-white leading-tight mb-3 tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {article.title}
          </h1>

          <p className="text-zinc-500 text-[13.5px] leading-relaxed mb-6 pb-6 border-b border-white/[0.07]">
            {article.desc}
          </p>

          {/* Article body */}
          <div className="text-[13.5px]">
            {renderContent(article.content)}
          </div>

          {/* Related */}
          <div className="mt-12 pt-8 border-t border-white/[0.07]">
            <p className="text-[10.5px] font-semibold text-zinc-600 tracking-widest uppercase mb-4">
              Continue Reading
            </p>
            <div className="space-y-2">
              {related.map(a => (
                <button
                  key={a.id}
                  onClick={() => { onSelectArticle(a); scrollRef.current?.scrollTo(0, 0); setProgress(0); }}
                  className="group w-full text-left flex items-center gap-3 p-3.5 bg-white/[0.03] border border-white/[0.07] rounded-xl cursor-pointer hover:bg-white/[0.05] hover:border-white/[0.12] transition-all focus:outline-none"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${a.accent}15`, border: `1px solid ${a.accent}25` }}
                  >
                    <a.Icon size={13} style={{ color: a.accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-semibold text-zinc-200 group-hover:text-white transition-colors leading-snug truncate"
                       style={{ fontFamily: "'Syne', sans-serif" }}>
                      {a.title}
                    </p>
                    <p className="text-[10.5px] text-zinc-600 mt-0.5">{a.category} · {a.read}</p>
                  </div>
                  <ChevronRight size={13} className="text-zinc-600 group-hover:text-zinc-400 shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function ApivesBlogsPage() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
  const trending = [...ARTICLES].sort((a, b) => parseFloat(b.views) - parseFloat(a.views)).slice(0, 3);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #060c0e; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a1214; }
        ::-webkit-scrollbar-thumb { background: #1f2f31; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #10b981; }
        .grid-pattern {
          background-image:
            linear-gradient(rgba(16,185,129,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.035) 1px, transparent 1px);
          background-size: 44px 44px;
        }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#060c0e", minHeight: "100vh", color: "#fff" }}>

        {/* ── NAV ── */}
        <nav
          className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
          style={{
            background: scrolled ? "rgba(6,12,14,0.94)" : "transparent",
            backdropFilter: scrolled ? "blur(14px)" : "none",
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          }}
        >
          <div className="max-w-[1080px] mx-auto px-6 h-14 flex items-center justify-between">
            <div className="font-bold text-[17px] tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              <span className="text-emerald-400">api</span>
              <span className="text-white">ves</span>
            </div>
            <div className="hidden md:flex gap-6 text-[12.5px] text-zinc-500">
              {["Home", "APIs", "Blog", "Pricing", "Docs"].map(n => (
                <span
                  key={n}
                  className="cursor-pointer transition-colors duration-150 hover:text-white"
                  style={{ color: n === "Blog" ? "#10b981" : undefined }}
                >
                  {n}
                </span>
              ))}
            </div>
            <button className="bg-emerald-500 text-black text-[11.5px] font-semibold px-4 py-1.5 rounded-full hover:bg-emerald-400 transition-colors cursor-pointer border-0">
              Get Started
            </button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="grid-pattern relative pt-28 pb-16 border-b border-white/[0.06] overflow-hidden">
          <div className="absolute top-[-80px] right-[-80px] w-[480px] h-[480px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 65%)" }} />
          <div className="absolute bottom-0 left-[30%] w-[300px] h-[200px] pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)" }} />

          <div className="max-w-[1080px] mx-auto px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-3 py-1 text-[11px] text-emerald-400 font-medium mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Developer Insights & API Resources
            </div>

            <h1
              className="text-[clamp(34px,5.5vw,60px)] font-extrabold leading-[1.07] tracking-[-2px] max-w-[580px] mb-4"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              The blog for<br />
              <span className="text-emerald-400">API-first</span> developers.
            </h1>

            <p className="text-zinc-500 text-[14px] max-w-[420px] leading-relaxed mb-7">
              Verified guides, honest comparisons, and practical insights for building with APIs in production.
            </p>

            {/* Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex items-center">
                <Search size={13} className="absolute left-3.5 text-zinc-500 pointer-events-none" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="bg-white/[0.05] border border-white/[0.1] rounded-full pl-9 pr-4 py-2.5 text-[12.5px] text-white w-[240px] outline-none transition-colors duration-150 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:bg-white/[0.07]"
                />
              </div>
              <div className="flex items-center gap-1.5 text-[11.5px] text-zinc-600">
                <BookOpen size={12} />
                <span>{ARTICLES.length} articles</span>
                <span className="text-zinc-700">·</span>
                <span className="text-emerald-500">All verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── CATEGORY PILLS ── */}
        <div
          className="sticky top-14 z-50 border-b border-white/[0.06]"
          style={{ background: "rgba(6,12,14,0.96)", backdropFilter: "blur(14px)" }}
        >
          <div className="max-w-[1080px] mx-auto px-6 overflow-x-auto">
            <div className="flex gap-1.5 py-3 whitespace-nowrap">
              {CATEGORIES.map(cat => {
                const CatIcon = CATEGORY_ICONS[cat];
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium border cursor-pointer transition-all duration-150 focus:outline-none"
                    style={{
                      background: active ? "#10b981" : "rgba(255,255,255,0.04)",
                      color: active ? "#000" : "#6b7280",
                      borderColor: active ? "#10b981" : "rgba(255,255,255,0.07)",
                    }}
                  >
                    <CatIcon size={10} />
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="max-w-[1080px] mx-auto px-6 py-12 pb-20">

          {/* Featured */}
          {activeCategory === "All" && !searchQuery && (
            <div className="mb-12">
              <SectionLabel color="#10b981" label="Featured" />
              <button
                onClick={() => setSelectedArticle(featured)}
                className="group w-full text-left rounded-2xl border border-emerald-500/[0.18] bg-emerald-500/[0.05] p-8 cursor-pointer transition-all duration-200 hover:border-emerald-500/30 hover:bg-emerald-500/[0.07] relative overflow-hidden focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              >
                <div className="absolute top-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)" }} />
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 items-center mb-4">
                      <span className="text-[10.5px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
                        {featured.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10.5px] text-zinc-600"><Clock size={10} />{featured.read}</span>
                      <span className="text-zinc-700 text-[10.5px]">·</span>
                      <span className="flex items-center gap-1 text-[10.5px] text-zinc-600"><Eye size={10} />{featured.views}</span>
                    </div>
                    <h2
                      className="text-[clamp(18px,2.5vw,26px)] font-bold leading-snug mb-3 max-w-[540px] tracking-tight group-hover:text-white transition-colors"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {featured.title}
                    </h2>
                    <p className="text-zinc-500 text-[13.5px] leading-relaxed max-w-[500px] mb-5">
                      {featured.desc}
                    </p>
                    <div className="inline-flex items-center gap-1.5 text-emerald-400 text-[13px] font-medium">
                      Read article <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl shrink-0 flex items-center justify-center bg-emerald-500/[0.1] border border-emerald-500/20">
                    <featured.Icon size={44} className="text-emerald-400 opacity-70" />
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Trending */}
          {activeCategory === "All" && !searchQuery && (
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
                <div className="w-[3px] h-4 bg-white/40 rounded-full" />
                <span className="text-[10.5px] font-semibold text-zinc-500 tracking-widest uppercase">
                  {searchQuery ? `Results for "${searchQuery}"` : activeCategory === "All" ? "All Articles" : activeCategory}
                </span>
                <span className="text-[10.5px] text-zinc-700 bg-white/[0.04] border border-white/[0.07] rounded-full px-2 py-0.5">
                  {filtered.length}
                </span>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
                  <Search size={22} className="text-zinc-600" />
                </div>
                <p className="text-zinc-500 text-[14px] font-medium mb-1">No articles found</p>
                <p className="text-zinc-700 text-[12.5px]">No results for "{searchQuery}"</p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  className="mt-4 text-[12px] text-emerald-500 hover:text-emerald-400 transition-colors cursor-pointer bg-transparent border-0"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(a => (
                  <ArticleCard key={a.id} article={a} onClick={() => setSelectedArticle(a)} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── MODAL ── */}
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

// ── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ color, label, Icon }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-[3px] h-[14px] rounded-full" style={{ background: color }} />
      {Icon && <Icon size={11} style={{ color }} />}
      <span className="text-[10.5px] font-semibold text-zinc-500 tracking-widest uppercase">{label}</span>
    </div>
  );
}