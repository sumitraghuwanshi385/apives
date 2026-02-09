import React, { useState } from 'react';
import { ShieldCheck, Activity, FileText, Lock, CheckCircle2, ChevronRight, List, LifeBuoy, HelpCircle, Mail, Handshake, Target, Rocket, Zap,  Crown,
  Layers,
  Compass,
  TerminalSquare,Cookie, 
  Users } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { CustomSelect } from '../components/CustomSelect';

const PageLayout: React.FC<{ title: string; subtitle: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, subtitle, icon: Icon, children }) => (
  <div className="min-h-screen bg-black pt-28 pb-20 relative selection:bg-mora-500/30">
    <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-dark-900 to-transparent pointer-events-none"></div>
    <div className="absolute top-28 left-4 lg:left-8 z-20">
      <BackButton />
    </div>
    <div className="max-w-2xl lg:max-w-6xl xl:max-w-7xl mx-auto px-6 relative z-10 pt-8">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-2.5 bg-mora-500/10 rounded-2xl border border-mora-500/20 mb-5 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
            <Icon size={28} className="text-mora-500" />
        </div>
        <h1 className="text-2xl md:text-4xl font-display font-bold text-white mb-3 tracking-tight">{title}</h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto font-light leading-relaxed">{subtitle}</p>
      </div>
      <div className="bg-dark-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-5 md:p-8 shadow-2xl animate-slide-up">
        {children}
      </div>
    </div>
  </div>
);

export const SponsorshipPage: React.FC = () => (
  <PageLayout title="For Sponsorship" subtitle="Partner with the world's growing API ecosystem. Showcase your brand to thousands of developers globally." icon={Handshake}>
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
          <Target className="text-mora-500 mb-3" size={20} />
          <h3 className="text-white font-bold text-base mb-1.5">Targeted Reach</h3>
          <p className="text-slate-400 text-xs leading-relaxed">Connect directly with active developers, tech-leads, and founders building the next generation of software worldwide.</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
          <Rocket className="text-mora-500 mb-3" size={20} />
          <h3 className="text-white font-bold text-base mb-1.5">Brand Visibility</h3>
          <p className="text-slate-400 text-xs leading-relaxed">Secure high-impact placement across Apives from the landing grid and discovery flows to curated communications, ensuring your brand is seen exactly where developers evaluate and trust APIs.</p>
        </div>
      </div>

      <div className="border-t border-white/10 pt-10 space-y-10">

  {/* HEADER */}
  <div>
    <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-3">
      Sponsor Placement Structure
    </h3>
    <p className="text-slate-400 text-sm leading-relaxed">
      Apives is next-gen API ecosystem where builders easily discover and understand APIs.
      <br /><br />
      Our sponsorship structure is designed to give brands contextual visibility,
      long-term credibility, and direct exposure to active builders at the right moments.
      <br /><br />
      Each tier is intentionally limited to maintain signal over noise.
    </p>
  </div>

  {/* APEX */}
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Crown className="text-amber-400" size={18} />
      <h4 className="text-white font-bold">Apex Sponsors</h4>
    </div>
    <p className="text-slate-400 text-xs">
      Top-tier brand visibility for category-defining companies.
    </p>
    <ul className="space-y-2">
      {[
        'Slots: 2',
        'Displayed directly below “Total APIs Listed”',
        'First impression visibility on the landing page',
        'Premium branding & trust association'
      ].map((t, i) => (
        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
          <CheckCircle2 size={14} className="text-mora-500 mt-0.5" />
          {t}
        </li>
      ))}
    </ul>
    <span className="text-[10px] uppercase tracking-widest text-mora-400 font-bold">
      Label: Apex Sponsor
    </span>
  </div>

  {/* PRIME */}
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Layers className="text-sky-400" size={18} />
      <h4 className="text-white font-bold">Prime Sponsors</h4>
    </div>
    <p className="text-slate-400 text-xs">
      Always-visible, long-term brand presence.
    </p>
    <ul className="space-y-2">
      {[
        'Slots: 4',
        'Displayed on the Landing Page (above Footer)',
        'Consistent exposure across all pages',
        'Strong recall without disrupting UX'
      ].map((t, i) => (
        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
          <CheckCircle2 size={14} className="text-mora-500 mt-0.5" />
          {t}
        </li>
      ))}
    </ul>
    <span className="text-[10px] uppercase tracking-widest text-mora-400 font-bold">
      Label: Prime Sponsor
    </span>
  </div>

  {/* ZENITH */}
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Compass className="text-orange-400" size={18} />
      <h4 className="text-white font-bold">Zenith Sponsors</h4>
    </div>
    <p className="text-slate-400 text-xs">
      Discovery-focused placement for high-intent users.
    </p>
    <ul className="space-y-2">
      {[
        'Slots: 2',
        'Displayed on the Browse APIs page',
        'Visible during core discovery flows',
        'Aligned with high-intent users'
      ].map((t, i) => (
        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
          <CheckCircle2 size={14} className="text-mora-500 mt-0.5" />
          {t}
        </li>
      ))}
    </ul>
    <span className="text-[10px] uppercase tracking-widest text-mora-400 font-bold">
      Label: Zenith Sponsor
    </span>
  </div>

  {/* CONSOLE */}
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <TerminalSquare className="text-purple-400" size={18} />
      <h4 className="text-white font-bold">Console Partners</h4>
    </div>
    <p className="text-slate-400 text-xs">
      Infrastructure & tooling trust layer.
    </p>
    <ul className="space-y-2">
      {[
        'Slots: 2',
        'Displayed inside the Developer Console',
        'Official infrastructure / tooling partners',
        'High trust, low noise placement'
      ].map((t, i) => (
        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
          <CheckCircle2 size={14} className="text-mora-500 mt-0.5" />
          {t}
        </li>
      ))}
    </ul>
    <span className="text-[10px] uppercase tracking-widest text-mora-400 font-bold">
      Label: Console Partner
    </span>
  </div>

  {/* COMMUNITY */}
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Users className="text-green-400" size={18} />
      <h4 className="text-white font-bold">Community Sponsors</h4>
    </div>
    <p className="text-slate-400 text-xs">
      Supporting the ecosystem and developer adoption.
    </p>
    <ul className="space-y-2">
      {[
        'Fresh APIs page: 2 slots',
        'Community Favorites page: 2 slots',
        'Embedded inside community-focused experiences',
        'Built for ecosystem-first brands'
      ].map((t, i) => (
        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
          <CheckCircle2 size={14} className="text-mora-500 mt-0.5" />
          {t}
        </li>
      ))}
    </ul>
    <span className="text-[10px] uppercase tracking-widest text-mora-400 font-bold">
      Label: Community Sponsor
    </span>
  </div>

</div>

      <div className="bg-mora-500/10 border border-mora-500/20 rounded-2xl p-6 text-center">
        <h3 className="text-lg font-bold text-white mb-1.5">Ready to Interface?</h3>
        <p className="text-slate-400 text-xs mb-5">For detailed pricing,additional placement opportunities and packages, reach out to our team.</p>
        <div className="flex flex-col items-center gap-3">
          <a href="mailto:beatslevelone@gmail.com" className="bg-mora-600 hover:bg-mora-500 text-white font-bold py-2.5 px-8 rounded-full transition-all shadow-lg flex items-center gap-2 text-xs">
            <Mail size={16} /> beatslevelone@gmail.com
          </a>
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Signal Response: 24-48 hours</span>
        </div>
      </div>
    </div>
  </PageLayout>
);

export const SupportPage: React.FC = () => {
    const [subject, setSubject] = useState('Technical Issue');
    const [supportSuccess, setSupportSuccess] = useState(false);

    const supportOptions = ["Technical Issue", "Billing Inquiry", "Sponsorship Query", "Bug Report", "Other"];

const handleSupportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const data = new FormData(form);

        await fetch('https://formsubmit.co/ajax/beatslevelone@gmail.com', {
            method: 'POST',
            body: data,
        });

        setSupportSuccess(true);
        form.reset();
    };

    return (
        <PageLayout title="Help and Support" subtitle="Need help with integration or have a question? Our team is here to assist you." icon={LifeBuoy}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-bold text-white mb-3">Contact Gateway</h3>
                    <p className="text-slate-400 text-xs mb-5 leading-relaxed">
                        For direct inquiries regarding the Apives platform, API submissions, or technical difficulties, please use the form.
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                            <Mail size={14} className="text-mora-500" /> beatslevelone@gmail.com
                        </div>
                    </div>
                </div>
                
                <div className="md:col-span-2">
                    <form onSubmit={handleSupportSubmit} className="space-y-3.5">
                        <input type="hidden" name="_subject" value={`Apives Support Request: ${subject}`} />
                        <input type="hidden" name="contact_category" value={subject} />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input 
                              type="text" 
                              name="name" 
                              required 
                              className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-mora-500/50 outline-none transition-all placeholder-slate-700" 
                              placeholder="Name" 
                            />
                            <input 
  type="email" 
  name="email" 
  placeholder="Email (optional)" 
  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-mora-500/50 outline-none transition-all placeholder-slate-700"
/>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider ml-1">Subject</label>
                          <CustomSelect value={subject} onChange={setSubject} options={supportOptions} icon={List} triggerClassName="!py-2.5 !text-xs" />
                        </div>

                        <textarea 
                          name="message" 
                          required 
                          rows={3} 
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-mora-500/50 outline-none transition-all placeholder-slate-700 resize-none" 
                          placeholder="Explain your technical query..."
                        ></textarea>
{supportSuccess && (
  <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl px-4 py-3 flex items-center gap-2">
    <CheckCircle2 size={14} />
    Support request sent successfully. We’ll respond within 24–48 hours.
  </div>
)}

                        
                        <button 
                          type="submit" 
                          className="bg-mora-600 hover:bg-mora-500 text-white font-bold py-2.5 px-6 rounded-full transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center gap-2 uppercase tracking-widest text-[10px]"
                        >
                            Send Signal <ChevronRight size={14} />
                        </button>
                    </form>
                </div>
            </div>
        </PageLayout>
    );
};
export const CookiesPage: React.FC = () => (
  <PageLayout
    title="Cookie Policy"
    subtitle="A simple and transparent explanation of how cookies help Apives work better for you."
    icon={Cookie}
  >
    <div className="prose prose-invert max-w-none text-slate-400 space-y-6">

      <section>
        <h3 className="text-white text-lg font-bold mb-2">
          What are cookies?
        </h3>
        <p className="text-xs leading-relaxed">
          Cookies are small pieces of data stored in your browser. They help websites
          remember simple preferences and keep things running smoothly between visits.
        </p>
      </section>

      <section>
        <h3 className="text-white text-lg font-bold mb-2">
          How Apives uses cookies
        </h3>
        <p className="text-xs leading-relaxed">
          Apives uses cookies only to support basic platform functionality like
          remembering your session, keeping you logged in, and maintaining a consistent
          experience as you explore APIs.
        </p>
      </section>

      <section>
        <h3 className="text-white text-lg font-bold mb-2">
          What we don’t do
        </h3>
        <p className="text-xs leading-relaxed">
          We do not use cookies for intrusive tracking, cross-site profiling,
          or selling personal data. Our goal is usability, not surveillance.
        </p>
      </section>

      <section>
        <h3 className="text-white text-lg font-bold mb-2">
          Your choice
        </h3>
        <p className="text-xs leading-relaxed">
          You’re free to accept or decline cookies. Even if you choose not to allow them,
          most parts of Apives will continue to work normally.
        </p>
      </section>

      <section>
        <h3 className="text-white text-lg font-bold mb-2">
          Questions?
        </h3>
        <p className="text-xs leading-relaxed">
          If you have any questions about cookies or privacy, feel free to reach out at
          <span className="text-mora-400 font-semibold"> beatslevelone@gmail.com</span>.
        </p>
      </section>

    </div>
  </PageLayout>
);

export const PrivacyPage: React.FC = () => (
  <PageLayout title="Privacy Policy" subtitle="How we handle your data. Simple and clear rules for our users." icon={Lock}>
    <div className="prose prose-invert max-w-none text-slate-400 space-y-6">
        <section>
            <h3 className="text-white text-lg font-bold mb-2">1. Information We Collect</h3>
            <p className="text-xs leading-relaxed">
                We only ask for very basic information like your name and email when you create an account. This is just to make sure your saved APIs are synced across your devices and to let you manage any APIs you choose to post on our directory.
            </p>
        </section>
        <section>
            <h3 className="text-white text-lg font-bold mb-2">2. How We Use API Data</h3>
            <p className="text-xs leading-relaxed">
                Apives is a directory, not a proxy. When you use an API found here, your data usually goes directly to that provider. We do not see, read, or store the actual data packets you send through these third-party services.
            </p>
        </section>
        <section>
  <h3 className="text-white text-lg font-bold mb-2">
    3. Platform Integrity & Verification
  </h3>
  <p className="text-xs leading-relaxed">
    Apives highlights APIs based on quality, clarity, and platform standards. Verified badges indicate that a listing has been manually reviewed for accuracy and authenticity at the time of approval. Verification does not imply ownership, control, or ongoing monitoring of third-party services. Our goal is to reduce noise and help developers discover reliable APIs with confidence.
  </p>
</section>
        <section>
            <h3 className="text-white text-lg font-bold mb-2">4. Security Expectations</h3>
            <p className="text-xs leading-relaxed">
                We use standard industry methods to protect your email and account. However, since no system is perfect, we can't promise that things will never go wrong.
            </p>
        </section>
        <section>
            <h3 className="text-white text-lg font-bold mb-2">5. Deleting Your Info</h3>
            <p className="text-xs leading-relaxed">
                Your data is yours. If you want to delete your account or any API you listed, just send us an email at our support address: beatslevelone@gmail.com. We'll manually wipe your data.
            </p>
        </section>
    </div>
  </PageLayout>
);

export const TermsPage: React.FC = () => (
  <PageLayout title="Terms of Service" subtitle="Common sense rules for using the Apives platform." icon={ShieldCheck}>
     <div className="prose prose-invert max-w-none text-slate-400 space-y-6">
        <section>
            <h3 className="text-white text-lg font-bold mb-2">1. Being a Good Builder</h3>
            <p className="text-xs leading-relaxed">
                Apives is a community tool designed for constructive innovation. By using it, you agree not to spam other users, post fake or broken APIs on purpose, or try to hack our servers.
            </p>
        </section>
        <section>
            <h3 className="text-white text-lg font-bold mb-2">2. Third-Party API Disclaimer</h3>
            <p className="text-xs leading-relaxed">
                The APIs listed in our directory are owned and run by other companies. We check them once when they are posted, but we can't guarantee they will stay online or work perfectly forever.
            </p>
        </section>
        <section>
            <h3 className="text-white text-lg font-bold mb-2">3. No "Perfect System" Guarantees</h3>
            <p className="text-xs leading-relaxed">
                We provide Apives "as is." Technology breaks sometimes, and we aren't responsible for any issues your apps have because an external API went down.
            </p>
        </section>
        <section>
            <h3 className="text-white text-lg font-bold mb-2">4. Content Ownership</h3>
            <p className="text-xs leading-relaxed">
                If you post an API, you are responsible for making sure you have the right to share it. We reserve the right to remove any listing that looks like spam without giving a reason.
            </p>
        </section>
        <section>
            <h3 className="text-white text-lg font-bold mb-2">5. Rule Updates</h3>
            <p className="text-xs leading-relaxed">
                The digital grid is constantly evolving. We might update these terms if the site grows. Your continued interface with the Apives platform constitutes acceptance.
            </p>
        </section>
    </div>
  </PageLayout>
);

export const EnterprisePage: React.FC = () => (
  <PageLayout title="Enterprise" subtitle="High-scale support for organizations." icon={Activity}>
    <div className="space-y-8">
        <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed text-xs">
            <h3 className="text-white text-lg md:text-xl font-bold mb-3">Industrial-Scale Integration</h3>
            <p>
                For organizations that demand the highest levels of reliability and performance, Apives Enterprise offers a suite of advanced features tailored for large-scale operations.
            </p>
            <p>
                Our Enterprise tier includes dedicated account management, custom SLAs (Service Level Agreements), and priority routing for support tickets. We also offer private node hosting for your team.
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
                { title: 'Custom SLAs', desc: 'Guaranteed uptime and support response times for mission-critical integrations.' },
                { title: 'Private Grid', desc: 'Host internal APIs for your team with SSO and granular access controls.' },
                { title: 'Monitoring', desc: 'Deep-dive analytics and real-time alerts for all your node dependencies.' }
            ].map((feature, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <h4 className="text-white font-bold mb-1.5 text-xs">{feature.title}</h4>
                    <p className="text-slate-400 text-[10px] leading-relaxed">{feature.desc}</p>
                </div>
            ))}
        </div>

        <div className="text-center py-8 bg-mora-500/5 border border-mora-500/20 rounded-3xl">
            <h3 className="text-lg font-bold text-white mb-2">Scaling Up?</h3>
            <p className="text-slate-400 mb-6 max-w-xs mx-auto text-[11px]">We provide dedicated support and higher limits for large-scale integrations. Reach out to our sales team.</p>
            <a href="mailto:beatslevelone@gmail.com" className="bg-white text-black font-bold py-2.5 px-8 rounded-full hover:bg-mora-500 transition-all uppercase tracking-widest text-[10px]">Contact Sales Gateway</a>
        </div>
    </div>
  </PageLayout>
);

export const DocumentationPage: React.FC = () => (
  <PageLayout title="Documentation" subtitle="Learn how to use the grid." icon={FileText}>
    <div className="space-y-8 prose prose-invert max-w-none text-slate-400 text-xs">
        <section>
            <h3 className="text-white text-lg md:text-xl font-bold mb-3">Introduction to Apives</h3>
            <p className="leading-relaxed">
                Apives is designed as a discovery layer for the modern web. Whether you are looking for identity solutions or payment rails, our directory provides a standardized interface.
            </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2 text-xs"><Rocket size={16} className="text-mora-500" /> Getting Started</h3>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                    1. Create your Identity Node.<br />
                    2. Browse the Grid categories.<br />
                    3. Evaluate nodes based on latency.<br />
                    4. Use the Playground to verify responses.
                </p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2 text-xs"><Zap size={16} className="text-mora-500" /> Posting APIs</h3>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                    1. Navigate to 'Submit API'.<br />
                    2. Provide high-quality metadata.<br />
                    3. Define your endpoints using JSON.<br />
                    4. Upload Visual Proofs for trust.
                </p>
            </div>
        </div>

        <section>
            <h3 className="text-white text-lg md:text-xl font-bold mb-3">Advanced Config</h3>
            <p className="leading-relaxed">
                For power users, Apives supports complex endpoint definitions including custom headers and body parameters. Ensure your mock responses are accurate.
            </p>
        </section>
<section className="not-prose">
  <h3 className="text-white text-lg md:text-xl font-bold mb-4">
    Makers of Apives
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
    {/* Founder */}
    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
      <h4 className="text-white font-bold text-sm mb-1">
        Prince Gupta
      </h4>
      <p className="text-mora-400 text-[10px] uppercase tracking-widest mb-2">
        Founder
      </p>
      <p className="text-slate-400 text-[11px] leading-relaxed">
        Building Apives to bring clarity, trust, and structure to how developers
        discover and evaluate APIs on the modern web.
      </p>
    </div>

    {/* Co-Founder */}
    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
      <h4 className="text-white font-bold text-sm mb-1">
        Sumit Raghuwanshi
      </h4>
      <p className="text-mora-400 text-[10px] uppercase tracking-widest mb-2">
        Co-Founder
      </p>
      <p className="text-slate-400 text-[11px] leading-relaxed">
        Focused on platform architecture, reliability, and shaping Apives
        into a scalable ecosystem for builders and API providers.
      </p>
    </div>

  </div>
</section>
    </div>
  </PageLayout>
);

export const StatusPage: React.FC = () => (
  <PageLayout title="System Status" subtitle="Current grid health and operational logs." icon={Activity}>
    <div className="space-y-6">
        <div className="flex items-center gap-3 bg-mora-500/10 p-4 rounded-2xl border border-mora-500/20">
            <div className="w-3 h-3 bg-mora-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
            <span className="text-white font-bold text-sm md:text-base">All Systems Operational</span>
        </div>

        <div className="prose prose-invert max-w-none text-slate-400 text-xs">
            <p className="leading-relaxed">
                We maintain a 99.9% uptime for the Apives discovery grid. Our monitoring systems track the health of the directory, the provider console, and the playground layers in real-time.
            </p>
        </div>

        <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-widest text-[9px]">Incident Logs</h4>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden font-mono text-[8px]">
                <div className="px-3 py-2.5 border-b border-white/5 flex justify-between">
                    <span className="text-slate-500">2024-03-20 14:30</span>
                    <span className="text-mora-400">SUCCESS</span>
                    <span className="text-slate-300">Playground Verified</span>
                </div>
                <div className="px-3 py-2.5 border-b border-white/5 flex justify-between">
                    <span className="text-slate-500">2024-03-19 09:15</span>
                    <span className="text-mora-400">SUCCESS</span>
                    <span className="text-slate-300">Grid Indexing Complete</span>
                </div>
                <div className="px-3 py-2.5 flex justify-between">
                    <span className="text-slate-500">2024-03-18 22:45</span>
                    <span className="text-yellow-500">MAINTENANCE</span>
                    <span className="text-slate-300">Database Optimized</span>
                </div>
            </div>
        </div>
    </div>
  </PageLayout>
);
