export default function ApivesBlogsPage() { const blogs = [ { title: "How to Find Reliable APIs Faster", desc: "A practical guide for developers to avoid broken APIs and save integration time.", category: "API Discovery", read: "5 min read", }, { title: "Best Search APIs for Modern Apps", desc: "Comparing search APIs based on speed, pricing, docs, and reliability.", category: "Search APIs", read: "7 min read", }, { title: "Why API Documentation Often Fails Developers", desc: "The hidden problems developers face while integrating APIs in production.", category: "Developer Experience", read: "6 min read", }, { title: "How Apives Verifies APIs", desc: "Inside our process for testing API quality, endpoints, uptime, and examples.", category: "Apives", read: "4 min read", }, { title: "Top Free APIs for Indie Hackers", desc: "Useful APIs every solo founder and indie hacker should know about.", category: "Indie Hackers", read: "8 min read", }, { title: "Building Faster With Better APIs", desc: "Why choosing the right APIs early can speed up product development massively.", category: "Startups", read: "5 min read", }, ];

return ( <div className="min-h-screen bg-black text-white"> {/* Hero */} <section className="border-b border-white/10 bg-gradient-to-b from-[#10191b] to-black"> <div className="max-w-6xl mx-auto px-6 py-24"> <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-sm text-green-400 mb-6"> Apives Blog </div>

<h1 className="text-5xl md:text-7xl font-black leading-tight max-w-4xl">
        Insights for developers building with APIs.
      </h1>

      <p className="text-zinc-400 text-lg mt-6 max-w-2xl leading-relaxed">
        Learn about API discovery, integrations, developer tools, startup workflows, and reliable APIs for modern applications.
      </p>

      <div className="mt-10 flex gap-4 flex-wrap">
        <button className="bg-green-500 hover:bg-green-400 transition px-6 py-3 rounded-2xl text-black font-semibold">
          Explore Articles
        </button>

        <button className="border border-white/10 hover:border-green-500/50 transition px-6 py-3 rounded-2xl text-white">
          API Guides
        </button>
      </div>
    </div>
  </section>

  {/* Featured */}
  <section className="max-w-6xl mx-auto px-6 py-16">
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-gradient-to-br from-green-500/10 to-zinc-900 border border-white/10 rounded-3xl p-8 hover:border-green-500/40 transition">
        <div className="text-sm text-green-400 mb-4">Featured Article</div>

        <h2 className="text-4xl font-bold leading-tight">
          The API discovery problem is bigger than most developers think.
        </h2>

        <p className="text-zinc-400 mt-5 leading-relaxed text-lg">
          Developers waste hours testing unreliable APIs, incomplete docs, and outdated examples. Here’s how Apives aims to simplify that process.
        </p>

        <button className="mt-8 bg-white text-black px-5 py-3 rounded-xl font-semibold hover:opacity-90 transition">
          Read Article
        </button>
      </div>

      <div className="grid gap-6">
        {blogs.slice(0, 3).map((blog, i) => (
          <div
            key={i}
            className="bg-zinc-900 border border-white/10 rounded-2xl p-6 hover:border-green-500/40 transition"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-green-400 text-sm">{blog.category}</span>
              <span className="text-zinc-500 text-sm">{blog.read}</span>
            </div>

            <h3 className="text-2xl font-bold">{blog.title}</h3>

            <p className="text-zinc-400 mt-3 leading-relaxed">
              {blog.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* Blog Grid */}
  <section className="max-w-6xl mx-auto px-6 pb-24">
    <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
      <h2 className="text-4xl font-bold">Latest Articles</h2>

      <input
        type="text"
        placeholder="Search blogs..."
        className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 w-full md:w-80 outline-none focus:border-green-500"
      />
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog, i) => (
        <div
          key={i}
          className="bg-zinc-900 rounded-3xl border border-white/10 overflow-hidden hover:border-green-500/40 transition group"
        >
          <div className="h-52 bg-gradient-to-br from-green-500/20 to-zinc-800" />

          <div className="p-6">
            <div className="flex justify-between items-center text-sm mb-4">
              <span className="text-green-400">{blog.category}</span>
              <span className="text-zinc-500">{blog.read}</span>
            </div>

            <h3 className="text-2xl font-bold group-hover:text-green-400 transition">
              {blog.title}
            </h3>

            <p className="text-zinc-400 mt-4 leading-relaxed">
              {blog.desc}
            </p>

            <button className="mt-6 text-green-400 hover:text-green-300 transition font-semibold">
              Read More →
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>

  {/* Newsletter */}
  <section className="border-t border-white/10 bg-zinc-950">
    <div className="max-w-4xl mx-auto px-6 py-24 text-center">
      <h2 className="text-5xl font-black leading-tight">
        Stay updated with developer insights.
      </h2>

      <p className="text-zinc-400 mt-5 text-lg max-w-2xl mx-auto leading-relaxed">
        Get updates about APIs, developer tools, startup workflows, and curated resources directly in your inbox.
      </p>

      <div className="mt-10 flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-green-500"
        />

        <button className="bg-green-500 hover:bg-green-400 transition text-black font-bold px-8 py-4 rounded-2xl">
          Subscribe
        </button>
      </div>
    </div>
  </section>

  {/* Footer */}
  <footer className="border-t border-white/10 bg-black">
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-6 text-zinc-400">
      <div>
        <div className="text-2xl font-black text-white">Apives</div>
        <p className="mt-3 max-w-md leading-relaxed">
          Discover reliable APIs faster with clear pricing, endpoint examples, and curated developer insights.
        </p>
      </div>

      <div className="flex gap-10 flex-wrap">
        <div>
          <div className="text-white font-semibold mb-3">Pages</div>
          <ul className="space-y-2">
            <li>Home</li>
            <li>APIs</li>
            <li>Blogs</li>
            <li>Pricing</li>
          </ul>
        </div>

        <div>
          <div className="text-white font-semibold mb-3">Resources</div>
          <ul className="space-y-2">
            <li>Developer Guides</li>
            <li>API Collections</li>
            <li>Docs</li>
            <li>Support</li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</div>

); }