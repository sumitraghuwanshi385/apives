import { useNavigate } from "react-router-dom";

export default function SerpApiOffer() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ================= HERO ================= */}
      <section className="pt-24 pb-10 text-center">

        <div className="flex items-center justify-center gap-3 mb-6">

          <img
            src="https://res.cloudinary.com/dp7avkarg/image/upload/v1706953800/Picsart_26-02-03_23-05-57-796_hiswhn.jpg"
            className="w-10 h-10 rounded-xl bg-white p-[3px]"
          />

          <span className="text-slate-500 text-lg font-bold">×</span>

          <img
            src="https://res.cloudinary.com/dp7avkarg/image/upload/f_auto,q_auto/apives-logo_kgcnxp.png"
            className="w-12 h-12 object-contain"
          />

        </div>

        <h1 className="text-3xl md:text-5xl font-bold">
          $500 SerpAPI Credits
        </h1>

        <p className="text-slate-400 mt-3 text-sm md:text-base max-w-xl mx-auto">
          Exclusive offer for Apives builders. Get free credits to test and scale your API-powered products.
        </p>

      </section>


      {/* ================= OFFER HIGHLIGHT ================= */}
      <section className="py-8 text-center">

        <div className="max-w-xl mx-auto border border-green-500/30 bg-green-500/10 rounded-2xl p-6">

          <p className="text-green-400 font-bold text-lg">
            🎁 What You Get
          </p>

          <p className="mt-2 text-slate-300 text-sm">
            Each selected user receives <span className="text-white font-bold">$500 in SerpAPI credits</span> to use for building and testing projects.
          </p>

        </div>

      </section>


      {/* ================= HOW TO REDEEM ================= */}
      <section className="py-10">

        <div className="max-w-2xl mx-auto px-6">

          <h2 className="text-xl md:text-2xl font-bold mb-4">
            How to Redeem
          </h2>

          <div className="space-y-4 text-slate-300 text-sm">

            <p>1. Click on <span className="text-white font-semibold">"Claim"</span> or visit SerpAPI.</p>

            <p>2. Reach out to SerpAPI support via:</p>

            <ul className="list-disc ml-5">
              <li>Email: contact@serpapi.com</li>
              <li>Or their live chat support</li>
            </ul>

            <p>
              3. Mention the code: <span className="text-green-400 font-bold">Apives500</span>
            </p>

            <p>
              4. Their team will manually add credits to your account.
            </p>

          </div>

        </div>

      </section>


      {/* ================= IMPORTANT ================= */}
      <section className="py-8">

        <div className="max-w-2xl mx-auto px-6">

          <h2 className="text-xl md:text-2xl font-bold mb-4">
            Important Details
          </h2>

          <div className="space-y-3 text-sm text-slate-400">

            <p>• Only <span className="text-white font-semibold">30 users</span> will receive this offer</p>

            <p>• Each user gets <span className="text-white font-semibold">$500 credits</span></p>

            <p>• First come, first served basis</p>

            <p>• Limited time offer — may expire anytime</p>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="py-12 text-center">

        <button
          onClick={() => window.open("https://serpapi.com", "_blank")}
          className="px-6 py-3 rounded-full bg-white text-black font-bold uppercase text-xs tracking-widest hover:scale-105 transition-all"
        >
          Go to SerpAPI
        </button>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        © Apives — Built for Developers
      </footer>

    </div>
  );
}