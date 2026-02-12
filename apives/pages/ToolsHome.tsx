import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Code2,
  ShieldCheck,
  Braces,
  Webhook,
  Lock,
  Cpu
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Encoding",
  "Security",
  "Testing",
  "Utilities"
];

const TOOLS = [
  {
    id: "json-formatter",
    name: "JSON Formatter",
    desc: "Format, prettify and validate JSON instantly.",
    icon: Braces,
    category: "Utilities"
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    desc: "Decode JWT tokens safely in your browser.",
    icon: ShieldCheck,
    category: "Security"
  },
  {
    id: "base64",
    name: "Base64 Encoder",
    desc: "Encode & decode Base64 strings instantly.",
    icon: Lock,
    category: "Encoding"
  },
  {
    id: "webhook-tester",
    name: "Webhook Tester",
    desc: "Test webhook payloads in real time.",
    icon: Webhook,
    category: "Testing"
  }
];

export default function ToolsHome() {
  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-24 relative overflow-hidden">

      {/* 🌌 BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.08),transparent_60%)] pointer-events-none" />

      {/* 🔰 HERO */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-20 px-4"
      >
        <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-2xl mb-6">
          <Cpu className="text-mora-500" size={32} />
        </div>

        <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight">
          Apives Developer Tools
        </h1>

        <p className="text-slate-400 mt-5 text-sm md:text-lg leading-relaxed">
          Fast, privacy-first utilities built for developers, founders and
          builders. No login. No tracking.
        </p>
      </motion.div>

      {/* 🧩 CATEGORIES */}
      <div className="flex flex-wrap justify-center gap-3 mb-16 px-4">
        {CATEGORIES.map((cat) => (
          <span
            key={cat}
            className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-slate-300 text-[11px] uppercase tracking-wider font-bold"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* 🛠 TOOLS GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {TOOLS.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="
                bg-dark-900/60
                backdrop-blur-xl
                border border-white/10
                rounded-[1.8rem]
                p-6
                hover:border-mora-500/40
                hover:shadow-[0_0_40px_rgba(34,197,94,0.15)]
                transition-all
              "
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-mora-500/15 text-mora-400">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {tool.name}
                </h3>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed">
                {tool.desc}
              </p>

              <div className="flex items-center justify-between mt-6">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                  Client-side • Instant
                </span>

                <Link
                  to={`/tools/${tool.id}`}
                  className="text-mora-500 font-bold text-sm hover:underline"
                >
                  Open →
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 🔐 TRUST SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="max-w-3xl mx-auto mt-24 px-6 text-center"
      >
        <div className="inline-flex items-center justify-center p-3 bg-green-500/10 border border-green-500/20 rounded-full mb-4">
          <ShieldCheck size={18} className="text-green-400" />
        </div>

        <p className="text-slate-400 text-sm leading-relaxed">
          All tools run entirely in your browser.  
          <br />
          Apives does not store, track or transmit your data.
        </p>
      </motion.div>
    </div>
  );
}