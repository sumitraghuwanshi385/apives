import React, {
  useEffect,
  useMemo,
  useState,
  memo
} from "react";

import {
  Search,
  Clock,
  ArrowRight,
  X,
  ChevronRight,
  BookOpen,
  ExternalLink,
  MessageCircle,
  AtSign,
  BriefcaseBusiness,
  Users,
  Send,
  Radio,
  Link2,
  Check,
  ArrowLeft,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  readTime: string;
  source: string;
  sourceUrl: string;
  content: string;
  keywords: string[];
}

/* =========================================================
   BLOG DATA
   Simple language + SEO focused titles/content
========================================================= */

const ARTICLES: Article[] = [
  {
    id: 1,
    slug: "rest-vs-graphql-vs-grpc",
    title: "REST vs GraphQL vs gRPC: Which API Should You Use?",
    excerpt:
      "REST, GraphQL, and gRPC solve different API problems. Learn when to use each one, their main differences, and which API architecture makes sense for your product.",
    tag: "API Architecture",
    date: "August 14, 2026",
    readTime: "9 min read",
    source: "Apives",
    sourceUrl: "#",
    keywords: [
      "REST API",
      "GraphQL",
      "gRPC",
      "API architecture",
      "REST vs GraphQL",
      "GraphQL vs gRPC",
    ],
    content: `
## REST API: The Best Default for Most Products

REST is still the easiest API style to understand and build.

It works directly with HTTP methods such as GET, POST, PUT, PATCH, and DELETE. Almost every programming language, framework, API gateway, and developer tool supports REST.

REST is usually the right choice when you are building a public API, mobile app backend, SaaS product, or CRUD-based application.

## When GraphQL Makes More Sense

GraphQL lets the client ask for exactly the data it needs.

This can be useful when an application has many related resources. Instead of making several API requests, a client can often fetch the required data with one GraphQL query.

GraphQL works especially well for complex dashboards, mobile applications, and products where frontend requirements change often.

The downside is extra complexity around caching, authorization, query limits, and server-side performance.

## When to Use gRPC

gRPC is designed mainly for fast communication between backend services.

It uses Protocol Buffers and HTTP/2, which makes it efficient for internal microservices and high-performance systems.

gRPC is a strong choice when low latency, streaming, and strict service contracts are important.

For a normal public developer API, REST is usually easier to consume.

## REST vs GraphQL vs gRPC

There is no single winner.

Use REST for most public APIs. Use GraphQL when clients need flexible access to connected data. Use gRPC when backend services need fast and strongly typed communication.

Many modern systems use more than one.

The important decision is not which API style is trending. It is which one makes your API easier to build, maintain, and use.
`,
  },

  {
    id: 2,
    slug: "best-llm-apis-2026",
    title: "Best LLM APIs in 2026: OpenAI vs Anthropic vs Gemini",
    excerpt:
      "A practical guide to the leading LLM APIs in 2026, including speed, cost, context, streaming, reliability, and how to build a multi-model AI system.",
    tag: "AI & LLMs",
    date: "August 12, 2026",
    readTime: "10 min read",
    source: "Apives",
    sourceUrl: "#",
    keywords: [
      "LLM APIs",
      "AI APIs",
      "OpenAI API",
      "Anthropic API",
      "Gemini API",
      "best AI API 2026",
    ],
    content: `
## LLM APIs Are Now Core Infrastructure

AI APIs are no longer limited to experiments.

Developers now use language models for search, customer support, coding tools, document processing, agents, automation, and content generation.

The main challenge is choosing the right model for each job.

## OpenAI

OpenAI APIs are a strong general-purpose option.

They have a large developer ecosystem, mature SDKs, good tooling, and support for text, reasoning, structured outputs, and other AI workloads.

Use them when you want a broadly capable model with strong developer support.

## Anthropic

Anthropic models are popular for long documents, coding, reasoning, and instruction-heavy workloads.

They can be a good fit for applications that need detailed responses and large amounts of context.

## Google Gemini

Gemini is especially useful for multimodal applications.

It can work with text, images, audio, video, and code depending on the model.

This makes Gemini interesting for applications that need more than plain text generation.

## The Smart Strategy: Use Multiple Models

You do not always need one AI provider.

A production AI application can route simple requests to cheaper models and complex requests to stronger models.

For example:

Simple classification → smaller model.

Normal chat → fast model.

Complex reasoning → stronger model.

Large document processing → long-context model.

This approach can reduce AI costs while keeping quality high.

## Always Add Streaming

Streaming makes AI applications feel much faster.

Instead of waiting for the complete response, users see the answer appear as it is generated.

For chatbots and AI assistants, streaming should usually be part of the default production design.
`,
  },

  {
    id: 3,
    slug: "api-security-best-practices",
    title: "API Security Best Practices: 10 Common API Security Risks",
    excerpt:
      "Learn the most common API security problems, including broken authorization, weak authentication, rate limit issues, and unsafe input handling.",
    tag: "API Security",
    date: "August 10, 2026",
    readTime: "9 min read",
    source: "Apives",
    sourceUrl: "#",
    keywords: [
      "API security",
      "API security best practices",
      "OWASP API Security",
      "API vulnerabilities",
      "secure REST API",
    ],
    content: `
## Why API Security Matters

APIs often sit directly between users and important application data.

If an API has a security problem, attackers may be able to access accounts, payments, private information, or internal systems.

Security should therefore be designed into the API from the beginning.

## 1. Broken Object Authorization

One of the most common API problems is failing to check whether a user can access a specific object.

For example, a user changes:

/api/orders/1001

to:

/api/orders/1002

The server must verify that the second order belongs to the authenticated user.

Never trust an ID just because the user is logged in.

## 2. Weak Authentication

Use strong authentication and short-lived access tokens.

Do not store secrets in frontend code. Never hardcode API keys in public repositories.

For user applications, modern OAuth flows with PKCE are a strong option.

## 3. Missing Rate Limits

Every public API should consider rate limiting.

Without limits, attackers can abuse expensive endpoints, brute-force credentials, or overload infrastructure.

Rate limits should normally return HTTP 429 with a useful Retry-After header.

## 4. Unsafe Input

Never assume API input is safe.

Validate request bodies, query parameters, headers, uploaded files, and IDs.

Use allowlists where possible.

## 5. Poor Error Messages

Detailed internal errors can expose database names, stack traces, file paths, or implementation details.

Return useful errors to developers without exposing sensitive internal information.

## API Security Checklist

Use strong authentication.

Check authorization for every protected resource.

Validate all input.

Add rate limits.

Protect secrets.

Use HTTPS.

Log suspicious activity.

Keep dependencies updated.

Security is not one feature. It is a layer across the entire API.
`,
  },

  {
    id: 4,
    slug: "how-to-build-production-ready-api",
    title: "How to Build a Production-Ready API: 7 Essential Steps",
    excerpt:
      "A simple step-by-step API development process covering API design, authentication, validation, errors, performance, testing, and monitoring.",
    tag: "API Development",
    date: "August 8, 2026",
    readTime: "8 min read",
    source: "Apives",
    sourceUrl: "#",
    keywords: [
      "build API",
      "production API",
      "API development",
      "REST API development",
      "API best practices",
    ],
    content: `
## 1. Understand the API Users

Before writing code, decide who will use the API.

Will it be used by your frontend? Mobile applications? External developers? Internal services?

The answer affects authentication, documentation, versioning, and performance requirements.

## 2. Design the API First

Define endpoints, request formats, response formats, authentication, and errors before implementing everything.

OpenAPI is useful because the API contract can become a shared source of truth.

## 3. Add Authentication Early

Do not leave authentication until the end.

Decide whether the API needs API keys, OAuth, JWTs, sessions, or service-to-service credentials.

Authentication and authorization are different. Being logged in does not automatically mean a user can access every resource.

## 4. Validate Requests

Validate every important input at the API boundary.

Check types, required fields, allowed values, string lengths, numbers, IDs, and uploaded data.

Good validation prevents many bugs before they reach your business logic.

## 5. Design Good Errors

API errors should tell developers what went wrong and how to fix it.

Use consistent HTTP status codes and a predictable JSON error structure.

## 6. Test Realistic Traffic

Do not only test a simple health endpoint.

Test real user flows, expensive database queries, authentication, writes, and high traffic.

Measure P50, P95, and P99 latency.

## 7. Monitor the API

Production APIs need logs, metrics, uptime monitoring, error tracking, and alerts.

When something breaks, your team should know what happened before users start reporting it.

A production-ready API is not just working code. It is an API that can be understood, tested, monitored, and maintained.
`,
  },

  {
    id: 5,
    slug: "openapi-specification-guide",
    title: "OpenAPI Specification: Why Your API Needs It",
    excerpt:
      "OpenAPI is more than API documentation. Learn how an OpenAPI specification can generate SDKs, mock servers, tests, types, and better developer documentation.",
    tag: "Developer Experience",
    date: "August 6, 2026",
    readTime: "7 min read",
    source: "Apives",
    sourceUrl: "#",
    keywords: [
      "OpenAPI",
      "OpenAPI specification",
      "Swagger",
      "API documentation",
      "API SDK generation",
    ],
    content: `
## What Is OpenAPI?

OpenAPI is a standard way to describe an HTTP API.

It defines endpoints, parameters, request bodies, responses, authentication, schemas, and examples.

Tools can then read that specification and automatically create useful developer resources.

## OpenAPI Can Generate SDKs

A good OpenAPI document can be used to generate client libraries for different programming languages.

This saves developers from manually writing API request code.

It also makes your API easier to integrate.

## Mock Servers

Mock servers can use the OpenAPI specification to return example responses.

Frontend teams can start building before the backend is completely finished.

## Better API Documentation

Tools can turn OpenAPI into interactive documentation.

Developers can read an endpoint description, see request examples, understand authentication, and test requests from the browser.

## Spec-First API Development

One useful approach is to write the API specification before implementation.

This forces the team to agree on the API contract early.

Changing an API design before launch is cheap. Changing it after hundreds of developers depend on it is much harder.

## The API Specification Should Be a Source of Truth

Do not create documentation that says one thing while the real API behaves differently.

Keep the specification and API implementation synchronized.

A good OpenAPI file can become the foundation for documentation, SDKs, tests, mocks, and developer tools.
`,
  },

  {
    id: 6,
    slug: "webhook-best-practices",
    title: "Webhook Best Practices: How to Build Reliable Webhooks",
    excerpt:
      "Learn how to build reliable webhook systems with signature verification, retries, idempotency, queues, fast responses, and safe event processing.",
    tag: "Webhooks",
    date: "August 4, 2026",
    readTime: "8 min read",
    source: "Apives",
    sourceUrl: "#",
    keywords: [
      "webhooks",
      "webhook best practices",
      "webhook security",
      "webhook retries",
      "webhook idempotency",
    ],
    content: `
## What Is a Webhook?

A webhook lets one system send an HTTP request to another system when something happens.

For example:

A payment succeeds.

A user signs up.

An order is created.

A subscription changes.

Webhooks are simple, but production webhook systems need careful design.

## Respond Quickly

Your webhook endpoint should normally acknowledge the request quickly.

Do not perform a large database job or long AI task before returning a response.

A better pattern is:

Receive event → verify it → store or queue it → return 2xx → process asynchronously.

## Verify the Signature

Always verify webhook signatures when the provider supports them.

This helps ensure the event actually came from the expected service.

Never process sensitive webhook data before authentication.

## Expect Duplicate Events

Webhook providers may retry events.

Your system must therefore handle the same event more than once.

Store an event ID and use it as an idempotency key.

If the event was already processed, safely ignore the duplicate.

## Expect Retries

Temporary failures happen.

Use exponential backoff rather than retrying every second.

A typical strategy can retry after increasing intervals and eventually mark the event as failed.

## Build Webhook Logs

A good webhook system should show:

Event ID.

Delivery status.

HTTP response.

Attempt number.

Request time.

Response time.

Error details.

This makes debugging much easier for API users.

Reliable webhooks are mostly about handling failure correctly.
`,
  },

  {
    id: 7,
    slug: "oauth-2-pkce-client-credentials",
    title: "OAuth 2.0 Explained: PKCE vs Client Credentials",
    excerpt:
      "Understand the OAuth 2.0 flows developers actually use, including Authorization Code with PKCE, Client Credentials, token refresh, and common mistakes.",
    tag: "Authentication",
    date: "August 2, 2026",
    readTime: "8 min read",
    source: "Apives",
    sourceUrl: "#",
    keywords: [
      "OAuth 2.0",
      "OAuth PKCE",
      "Client Credentials",
      "OAuth authentication",
      "API authentication",
    ],
    content: `
## OAuth 2.0 Is About Delegated Access

OAuth lets an application access resources without directly handling another user's password.

The correct OAuth flow depends on the type of application.

## Authorization Code with PKCE

PKCE is commonly used for mobile apps, browser applications, and other public clients.

The application creates a temporary verifier and challenge.

The authorization server later checks them before issuing tokens.

This helps protect authorization codes from being stolen and reused.

## Client Credentials

Client Credentials is designed for machine-to-machine communication.

There is no user involved.

For example, your backend service needs to call another company's API.

The service authenticates itself and receives an access token.

## Access Tokens Should Expire

Long-lived access tokens increase risk.

Use short-lived access tokens and refresh tokens where appropriate.

Refresh token rotation can provide another layer of protection.

## Do Not Use Passwords as API Keys

Never ask developers to send usernames and passwords to every API request.

Use dedicated credentials and modern authentication standards.

## Avoid the Old Implicit Flow

New applications should generally avoid the OAuth Implicit Flow.

Authorization Code with PKCE is the safer modern pattern for public clients.

The right OAuth flow depends on who is making the request and on whose behalf it is being made.
`,
  },

  {
    id: 8,
    slug: "graphql-n-plus-one-dataloader",
    title: "GraphQL at Scale: How to Fix the N+1 Query Problem",
    excerpt:
      "Learn why GraphQL applications suffer from N+1 database queries and how DataLoader, caching, batching, and good schema design can solve the problem.",
    tag: "GraphQL",
    date: "July 30, 2026",
    readTime: "8 min read",
    source: "Apives",
    sourceUrl: "#",
    keywords: [
      "GraphQL",
      "GraphQL N+1",
      "DataLoader",
      "GraphQL performance",
      "GraphQL scalability",
    ],
    content: `
## What Is the N+1 Problem?

The N+1 problem happens when one API request causes many extra database queries.

For example, you request 100 users.

The API makes one query for users.

Then it makes another query for each user's company.

That creates 101 database queries.

This can become very slow.

## Why GraphQL Can Make It Worse

GraphQL allows clients to request nested data.

That is powerful, but poorly designed resolvers can create many database calls.

The problem may not appear during development with ten records.

At production scale, it can overload the database.

## DataLoader

DataLoader is a common solution.

Instead of querying the database separately for every user, DataLoader collects IDs and loads them together.

One hundred individual requests can become one batched database query.

## Add Caching Carefully

Caching can reduce repeated work, but it should not hide a bad data model.

First fix inefficient queries.

Then add caching where the data is suitable for it.

## Monitor Database Queries

GraphQL performance is not only about API response time.

Monitor:

Database query count.

Query duration.

P95 latency.

Memory usage.

Resolver execution time.

A fast GraphQL API starts with efficient data access.
`,
  },

  {
    id: 9,
    slug: "api-load-testing-guide",
    title: "API Load Testing: How to Test an API Before Launch",
    excerpt:
      "A practical API load testing guide covering k6, realistic traffic, response time, P95 and P99 latency, error rates, and database bottlenecks.",
    tag: "API Testing",
    date: "July 28, 2026",
    readTime: "7 min read",
    source: "Apives",
    sourceUrl: "#",
    keywords: [
      "API load testing",
      "API performance testing",
      "k6",
      "API stress testing",
      "API testing tools",
    ],
    content: `
## Why API Load Testing Matters

An API can work perfectly with ten users and fail badly with ten thousand.

Load testing helps you find those problems before real users do.

## Test Real User Behavior

Do not only send requests to /health.

A realistic test should include:

Login.

Search.

Read operations.

Writes.

Large responses.

Expensive endpoints.

Different users.

Realistic request patterns.

## Measure P95 and P99

Average response time can hide slow requests.

P95 tells you how fast 95% of requests completed.

P99 shows an even slower part of the traffic.

These numbers are more useful than average latency alone.

## k6 Is a Good Starting Point

k6 lets developers write load tests using JavaScript.

You can define virtual users, request rates, thresholds, and test scenarios.

It is a practical option for many REST API projects.

## Watch Your Database

The database is often the first bottleneck.

Look for:

Missing indexes.

N+1 queries.

Slow joins.

Too many database connections.

Large queries.

Load testing is not about reaching the biggest number.

It is about finding where the system starts becoming unhealthy and fixing that point.
`,
  },

  {
    id: 10,
    slug: "best-serverless-platforms-api",
    title: "Best Serverless Platforms for APIs in 2026",
    excerpt:
      "Compare AWS Lambda, Cloudflare Workers, and Vercel Functions for API hosting. Understand cold starts, pricing, performance, and the best use case for each.",
    tag: "Cloud & Infra",
    date: "July 25, 2026",
    readTime: "8 min read",
    source: "Apives",
    sourceUrl: "#",
    keywords: [
      "serverless API",
      "AWS Lambda",
      "Cloudflare Workers",
      "Vercel Functions",
      "API hosting",
    ],
    content: `
## Serverless APIs Are Popular for a Reason

Serverless platforms remove much of the infrastructure work required to deploy an API.

You write the function, deploy it, and the platform handles scaling.

But different platforms have different strengths.

## AWS Lambda

Lambda is a strong choice for teams already using AWS.

It integrates with databases, queues, storage, IAM, monitoring, and many other AWS services.

It is especially useful for enterprise and complex backend workloads.

## Cloudflare Workers

Cloudflare Workers run close to users around the world.

They are useful for low-latency APIs, edge authentication, routing, caching, and globally distributed applications.

They also have a different runtime model from traditional Node.js servers.

## Vercel Functions

Vercel is particularly convenient for modern full-stack applications.

If your frontend and backend are built together, deployment can be extremely simple.

It is a strong choice for teams that value development speed.

## Which Should You Choose?

Choose Lambda when you need the AWS ecosystem.

Choose Cloudflare Workers when edge performance matters.

Choose Vercel when you want a simple full-stack deployment workflow.

There is no rule saying one product must use only one platform.
`,
  },

  {
    id: 11,
    slug: "why-apives-verifies-apis",
    title: "Why Apives Verifies APIs Before Listing Them",
    excerpt:
      "See how Apives checks APIs before listing them, including endpoint availability, authentication, response quality, pricing information, and reliability.",
    tag: "About Apives",
    date: "July 22, 2026",
    readTime: "6 min read",
    source: "Apives",
    sourceUrl: "#",
    keywords: [
      "Apives",
      "API directory",
      "verified APIs",
      "API discovery",
      "API marketplace",
      "API verification",
    ],
    content: `
## API Discovery Has a Quality Problem

There are thousands of public APIs online.

Finding an API is easy.

Finding an API that actually works, has clear documentation, and matches its advertised features is much harder.

That is the problem Apives is built to solve.

## We Check API Availability

An API listing should not simply contain a URL.

We care about whether the API is reachable and whether its endpoints actually respond.

Availability and response behavior are important signals for developers deciding which API to use.

## We Look at Authentication

API authentication should match the documentation.

If an API says it uses an API key, OAuth, or another authentication method, the integration experience should make sense for developers.

Clear authentication information saves developers hours of trial and error.

## We Care About Real API Details

Good API discovery needs more than a name and description.

Developers want to know:

What the API does.

How authentication works.

Whether it is free or paid.

What the API limits are.

How to get started.

Where the API is hosted.

How reliable it appears.

## Why Verification Matters

A large directory is not automatically a useful directory.

Apives focuses on making API discovery faster and more useful by putting important information in one place.

The goal is simple:

**Find an API. Understand it. Try it. Build with it.**
`,
  },
];

/* =========================================================
   FILTERS
========================================================= */

const FILTERS = [
  "All",
  "API Architecture",
  "AI & LLMs",
  "API Security",
  "API Development",
  "Developer Experience",
  "Webhooks",
  "Authentication",
  "GraphQL",
  "API Testing",
  "Cloud & Infra",
  "About Apives",
];

/* =========================================================
   SEO
========================================================= */

function updateSEO(article?: Article | null) {
  const title = article
    ? `${article.title} | Apives Blog`
    : "Apives Blog — API Guides, Engineering & Developer Insights";

  const description = article
    ? article.excerpt
    : "Apives Blog covers APIs, API development, API security, authentication, AI APIs, GraphQL, webhooks, testing, and modern API infrastructure.";

  const keywords = article
    ? article.keywords.join(", ")
    : "API blog, APIs, API development, API security, REST API, GraphQL, AI APIs, webhooks";

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
   CONTENT RENDERER
========================================================= */

function renderContent(text: string) {
  const lines = text.trim().split("\n");

  return lines.map((line, index) => {
    const clean = line.trim();

    if (!clean) {
      return <div key={index} className="h-3" />;
    }

    if (clean.startsWith("## ")) {
      return (
        <h2
          key={index}
          className="
            mt-10 mb-4
            text-[21px] md:text-[24px]
            font-bold
            tracking-[-0.5px]
            text-white
          "
        >
          {clean.replace("## ", "")}
        </h2>
      );
    }

    return (
      <p
        key={index}
        className="
          mb-4
          text-[15px] md:text-[16px]
          leading-[1.85]
          text-slate-400
        "
      >
        {clean}
      </p>
    );
  });
}

/* =========================================================
   SHARE BUTTON
========================================================= */

interface ShareButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const ShareButton = ({
  label,
  icon,
  onClick,
}: ShareButtonProps) => {
  return (
    <button
      onClick={onClick}
      aria-label={`Share on ${label}`}
      title={label}
      className="
        group
        relative
        w-10 h-10
        md:w-11 md:h-11
        rounded-full
        flex
        items-center
        justify-center
        shrink-0

        bg-mora-500/[0.07]
        backdrop-blur-xl

        border border-mora-500/20

        text-mora-400

        shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]

        hover:bg-mora-500/15
        hover:border-mora-500/40
        hover:text-mora-300
        hover:-translate-y-0.5

        active:scale-90

        transition-all
        duration-200
      "
    >
      {icon}

      <span
        className="
          pointer-events-none
          absolute
          -bottom-8
          left-1/2
          -translate-x-1/2
          whitespace-nowrap

          px-2
          py-1
          rounded-md

          bg-black
          border border-white/10
          text-[9px]
          text-slate-300

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
};

/* =========================================================
   ARTICLE DETAIL
========================================================= */

interface ArticleDetailProps {
  article: Article;
  articles: Article[];
  onBack: () => void;
  onSelect: (article: Article) => void;
}

function ArticleDetail({
  article,
  articles,
  onBack,
  onSelect,
}: ArticleDetailProps) {
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

  const shareUrl = `${window.location.origin}/blog/${article.slug}`;

  const share = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(article.title);

    let url = "";

    switch (platform) {
      case "WhatsApp":
        url = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;

      case "X":
        url = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;

      case "LinkedIn":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;

      case "Facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;

      case "Telegram":
        url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
        break;

      case "Reddit":
        url = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
        break;

      case "Email":
        url = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
        break;
    }

    if (url) {
      window.open(
        url,
        "_blank",
        "noopener,noreferrer,width=700,height=600"
      );
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      console.error("Unable to copy link");
    }
  };

  const related = articles
    .filter((a) => a.id !== article.id)
    .sort((a, b) =>
      a.tag === article.tag ? -1 : b.tag === article.tag ? 1 : 0
    )
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#080a0d] text-white">

      {/* TOP BAR */}

      <div
        className="
          sticky
          top-0
          z-50

          bg-[#080a0d]/95
          backdrop-blur-xl

          border-b
          border-white/[0.06]
        "
      >
        <div
          className="
            max-w-[860px]
            mx-auto
            px-5
            md:px-8
            h-14
            flex
            items-center
            justify-between
          "
        >

          <button
            onClick={onBack}
            className="
              flex
              items-center
              gap-2
              text-[11px]
              uppercase
              tracking-[0.16em]
              font-semibold
              text-slate-500
              hover:text-white
              transition-colors
            "
          >
            <ArrowLeft size={14} />
            Blog
          </button>

          <div className="flex items-center gap-2">
            <BookOpen
              size={14}
              className="text-mora-500"
            />

            <span
              className="
                hidden
                sm:block
                text-[10px]
                font-bold
                tracking-[0.18em]
                uppercase
                text-slate-500
              "
            >
              Apives Blog
            </span>
          </div>

        </div>
      </div>

      {/* ARTICLE */}

      <article
        className="
          max-w-[760px]
          mx-auto
          px-5
          md:px-8
          pt-12
          md:pt-20
          pb-24
        "
      >

        {/* CATEGORY */}

        <div
          className="
            text-[10px]
            uppercase
            tracking-[0.18em]
            font-bold
            text-mora-500
            mb-5
          "
        >
          {article.tag}
        </div>

        {/* TITLE */}

        <h1
          className="
            text-[32px]
            sm:text-[42px]
            md:text-[52px]

            leading-[1.08]

            tracking-[-1.8px]
            md:tracking-[-2.5px]

            font-bold

            text-white

            mb-6
          "
        >
          {article.title}
        </h1>

        {/* EXCERPT */}

        <p
          className="
            text-[17px]
            md:text-[19px]

            leading-[1.65]

            text-slate-500

            max-w-[700px]

            mb-7
          "
        >
          {article.excerpt}
        </p>

        {/* META + SHARE */}

        <div
          className="
            border-y
            border-white/[0.07]

            py-5

            flex
            flex-col
            sm:flex-row

            sm:items-center
            sm:justify-between

            gap-5

            mb-12
          "
        >

          {/* DATE */}

          <div
            className="
              flex
              items-center
              gap-3
              text-[11px]
              text-slate-500
            "
          >
            <span>{article.date}</span>

            <span className="text-slate-700">
              •
            </span>

            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {article.readTime}
            </span>
          </div>

          {/* SHARE */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <span
              className="
                hidden
                sm:block
                mr-1

                text-[9px]
                uppercase
                tracking-[0.14em]
                font-bold

                text-slate-600
              "
            >
              Share
            </span>

            <ShareButton
              label="WhatsApp"
              icon={<MessageCircle size={16} />}
              onClick={() => share("WhatsApp")}
            />

            <ShareButton
              label="X"
              icon={<AtSign size={16} />}
              onClick={() => share("X")}
            />

            <ShareButton
              label="LinkedIn"
              icon={<BriefcaseBusiness size={16} />}
              onClick={() => share("LinkedIn")}
            />

            <ShareButton
              label="Facebook"
              icon={<Users size={16} />}
              onClick={() => share("Facebook")}
            />

            <ShareButton
              label="Telegram"
              icon={<Send size={16} />}
              onClick={() => share("Telegram")}
            />

            <ShareButton
              label="Reddit"
              icon={<Radio size={16} />}
              onClick={() => share("Reddit")}
            />

            <ShareButton
              label={copied ? "Copied" : "Copy link"}
              icon={
                copied ? (
                  <Check size={16} />
                ) : (
                  <Link2 size={16} />
                )
              }
              onClick={copyLink}
            />

          </div>
        </div>

        {/* CONTENT */}

        <div className="article-content">
          {renderContent(article.content)}
        </div>

        {/* SOURCE */}

        {article.sourceUrl !== "#" && (
          <div
            className="
              mt-12
              pt-6
              border-t
              border-white/[0.07]

              flex
              items-center
              justify-between
              gap-4
            "
          >

            <div>
              <div
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.15em]
                  text-slate-600
                  font-bold
                  mb-1
                "
              >
                Source
              </div>

              <div className="text-[13px] text-slate-400">
                {article.source}
              </div>
            </div>

            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                items-center
                gap-2

                text-[10px]
                uppercase
                tracking-widest
                font-bold

                text-mora-500
                hover:text-mora-400
              "
            >
              Visit Source
              <ExternalLink size={12} />
            </a>

          </div>
        )}

        {/* RELATED */}

        <section
          className="
            mt-20
            pt-8
            border-t
            border-white/[0.07]
          "
        >

          <div
            className="
              text-[10px]
              uppercase
              tracking-[0.18em]
              font-bold
              text-slate-600
              mb-6
            "
          >
            Continue Reading
          </div>

          <div className="space-y-0">

            {related.map((relatedArticle, index) => (
              <button
                key={relatedArticle.id}
                onClick={() => {
                  onSelect(relatedArticle);
                  window.scrollTo({
                    top: 0,
                    behavior: "instant" as ScrollBehavior,
                  });
                }}
                className="
                  w-full
                  text-left

                  py-5

                  flex
                  items-center
                  justify-between
                  gap-5

                  border-b
                  border-white/[0.06]

                  group
                "
              >

                <div className="min-w-0">

                  <div
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.13em]
                      font-bold
                      text-mora-500/70
                      mb-2
                    "
                  >
                    {relatedArticle.tag}
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
                    {relatedArticle.title}
                  </div>

                  <div
                    className="
                      mt-2
                      flex
                      items-center
                      gap-2

                      text-[10px]
                      text-slate-600
                    "
                  >
                    <span>{relatedArticle.date}</span>
                    <span>•</span>
                    <span>{relatedArticle.readTime}</span>
                  </div>

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
            ))}

          </div>
        </section>

      </article>
    </main>
  );
}

/* =========================================================
   ARTICLE LIST ITEM
========================================================= */

const ArticleListItem = memo(function ArticleListItem({
  article,
  onClick,
}: {
  article: Article;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        text-left

        py-7
        md:py-8

        border-b
        border-white/[0.07]

        group
      "
    >

      {/* DATE */}

      <div
        className="
          text-[12px]
          md:text-[13px]

          font-medium

          text-slate-500

          mb-4
        "
      >
        {article.date}
      </div>

      {/* TITLE */}

      <h2
        className="
          max-w-[760px]

          text-[22px]
          md:text-[27px]

          leading-[1.25]

          tracking-[-0.6px]

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

          leading-[1.7]

          text-slate-500

          mb-4
        "
      >
        {article.excerpt}
      </p>

      {/* META */}

      <div
        className="
          flex
          items-center
          gap-3

          text-[10px]
          md:text-[11px]

          text-slate-600
        "
      >

        <span
          className="
            text-mora-500/80
            uppercase
            tracking-[0.12em]
            font-bold
          "
        >
          {article.tag}
        </span>

        <span>•</span>

        <span className="flex items-center gap-1">
          <Clock size={10} />
          {article.readTime}
        </span>

        <span
          className="
            ml-auto

            flex
            items-center
            gap-1.5

            text-slate-600
            group-hover:text-mora-500

            transition-colors
          "
        >
          Read
          <ArrowRight
            size={12}
            className="
              group-hover:translate-x-1
              transition-transform
            "
          />
        </span>

      </div>

    </button>
  );
});

/* =========================================================
   MAIN BLOG PAGE
========================================================= */

export default function ApivesBlog() {
  const [selectedArticle, setSelectedArticle] =
    useState<Article | null>(null);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [activeFilter, setActiveFilter] =
    useState("All");

  /* SEO */

  useEffect(() => {
    updateSEO(null);
  }, []);

  /* SEARCH */

  const filteredArticles = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    return ARTICLES.filter((article) => {

      const matchesCategory =
        activeFilter === "All" ||
        article.tag === activeFilter;

      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.tag.toLowerCase().includes(query) ||
        article.keywords.some((keyword) =>
          keyword.toLowerCase().includes(query)
        );

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  /* DETAIL */

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
            behavior: "instant" as ScrollBehavior,
          });
        }}
        onSelect={(article) => {
          setSelectedArticle(article);
        }}
      />
    );
  }

  return (
    <>
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          background: #080a0d;
        }

        * {
          box-sizing: border-box;
        }

        ::selection {
          background: rgba(34,197,94,0.22);
          color: white;
        }

        ::-webkit-scrollbar {
          width: 5px;
        }

        ::-webkit-scrollbar-track {
          background: #080a0d;
        }

        ::-webkit-scrollbar-thumb {
          background: #20252b;
          border-radius: 999px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #22c55e;
        }

        input::placeholder {
          color: #525963;
        }

        .blog-search:focus {
          border-color: rgba(34,197,94,0.35) !important;
          background: rgba(255,255,255,0.035) !important;
        }
      `}</style>

      <main
        className="
          min-h-screen

          bg-[#080a0d]

          text-white
        "
      >

        {/* =================================================
            SIMPLE HEADER
        ================================================= */}

        <section
          className="
            max-w-[900px]
            mx-auto

            px-5
            md:px-8

            pt-20
            md:pt-28

            pb-14
            md:pb-20
          "
        >

          <h1
            className="
              text-[38px]
              md:text-[52px]

              leading-none

              tracking-[-2px]

              font-bold

              text-white

              mb-5
            "
          >
            Blog
          </h1>

          <p
            className="
              text-[19px]
              md:text-[22px]

              text-slate-500

              leading-[1.5]

              font-normal
            "
          >
            Deep dives on APIs.
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

            pb-5
          "
        >

          <div className="relative max-w-[360px]">

            <Search
              size={15}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2

                text-slate-600
              "
            />

            <input
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Search articles"
              className="
                blog-search

                w-full

                h-11

                pl-11
                pr-10

                rounded-xl

                bg-white/[0.02]

                border
                border-white/[0.08]

                outline-none

                text-[13px]
                text-slate-300

                transition-all
              "
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2

                  text-slate-600
                  hover:text-white
                "
              >
                <X size={14} />
              </button>
            )}

          </div>

        </section>

        {/* =================================================
            FILTERS
        ================================================= */}

        <section
          className="
            max-w-[900px]
            mx-auto

            px-5
            md:px-8

            pb-2

            overflow-x-auto
          "
        >

          <div
            className="
              flex
              gap-5

              min-w-max

              py-3
            "
          >

            {FILTERS.map((filter) => {
              const active =
                activeFilter === filter;

              return (
                <button
                  key={filter}
                  onClick={() =>
                    setActiveFilter(filter)
                  }
                  className={`
                    text-[10px]
                    md:text-[11px]

                    uppercase
                    tracking-[0.08em]

                    font-semibold

                    transition-colors

                    whitespace-nowrap

                    ${
                      active
                        ? "text-mora-500"
                        : "text-slate-600 hover:text-slate-300"
                    }
                  `}
                >
                  {filter}
                </button>
              );
            })}

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
              border-white/[0.07]
            "
          >

            {filteredArticles.length > 0 ? (

              filteredArticles.map((article) => (
                <ArticleListItem
                  key={article.id}
                  article={article}
                  onClick={() =>
                    setSelectedArticle(article)
                  }
                />
              ))

            ) : (

              <div
                className="
                  py-24

                  text-center
                "
              >
                <p
                  className="
                    text-[14px]
                    text-slate-600
                    mb-4
                  "
                >
                  No articles found.
                </p>

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("All");
                  }}
                  className="
                    text-[11px]

                    text-mora-500

                    hover:text-mora-400
                  "
                >
                  Clear filters
                </button>
              </div>

            )}

          </div>

        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer
          className="
            border-t
            border-white/[0.06]

            max-w-[900px]
            mx-auto

            px-5
            md:px-8

            py-8
          "
        >

          <div
            className="
              flex
              flex-col
              sm:flex-row

              sm:items-center
              sm:justify-between

              gap-3
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <BookOpen
                size={13}
                className="text-mora-500"
              />

              <span
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.15em]
                  font-bold
                  text-slate-600
                "
              >
                Apives Blog
              </span>

            </div>

            <span
              className="
                text-[10px]
                text-slate-700
              "
            >
              API knowledge for builders.
            </span>

          </div>

        </footer>

      </main>
    </>
  );
}