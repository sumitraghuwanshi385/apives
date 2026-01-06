import React, { useState } from 'react';
import { ShieldCheck, Activity, FileText, Lock, CheckCircle2, ChevronRight, List, LifeBuoy, HelpCircle, Mail, Handshake, Target, Rocket, Zap } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { CustomSelect } from '../components/CustomSelect';

const PageLayout: React.FC<{ title: string; subtitle: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, subtitle, icon: Icon, children }) => (
  <div className="min-h-screen bg-black pt-28 pb-20 relative selection:bg-mora-500/30">
    <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-dark-900 to-transparent pointer-events-none"></div>
    <div className="absolute top-28 left-4 lg:left-8 z-20">
      <BackButton />
    </div>
    <div className="max-w-3xl mx-auto px-6 relative z-10 pt-12">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-mora-500/10 rounded-2xl border border-mora-500/20 mb-6 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
            <Icon size={32} className="text-mora-500" />
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">{title}</h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto font-light leading-relaxed">{subtitle}</p>
      </div>
      <div className="bg-dark-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl animate-slide-up">
        {children}
      </div>
    </div>
  </div>
);

export const SponsorshipPage: React.FC = () => (
  <PageLayout title="For Sponsorship" subtitle="Partner with the world's growing API ecosystem. Showcase your brand to thousands of developers globally." icon={Handshake}>
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <Target className="text-mora-500 mb-4" size={24} />
          <h3 className="text-white font-bold text-lg mb-2">Targeted Reach</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Connect directly with active developers, tech-leads, and founders building the next generation of software worldwide. Our platform attracts a highly niche audience of power builders who are looking for the best infrastructure to fuel their products.</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <Rocket className="text-mora-500 mb-4" size={24} />
          <h3 className="text-white font-bold text-lg mb-2">Brand Visibility</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Get prominent placement across our platform, including the landing page, directory sidebar, and newsletters. We don't just show ads; we integrate your brand into the discovery process, helping developers find your tools when they need them most.</p>
        </div>
      </div>

      <div className="border-t border-white/10 pt-10">
        <h3 className="text-2xl font-bold text-white mb-6">Partnership Value Proposition</h3>
        <p className="text-slate-400 text-base mb-6 leading-relaxed">
          Apives is more than just a directory; it's a global hub for innovation. By sponsoring the grid, you align your brand with the future of the technology landscape. Our sponsors gain access to a dedicated dashboard tracking impressions, clicks, and conversion signals from high-intent builders. Whether you are a cloud provider, a specialized API service, or a dev-tool SaaS, our sponsorship tiers are designed to provide maximum ROI. 
          <br /><br />
          We offer "Promoted Node" status, which places your API at the top of relevant search results with a distinct "Partner" badge. This significantly increases visibility and trust. Additionally, our bi-weekly newsletter reaches thousands of developers, featuring "Sponsor Spotlights" that deep-dive into your service's capabilities, complete with sample code and integration guides.
        </p>
        <ul className="space-y-4">
          {[
            'Featured "Promoted Node" status in all relevant category searches.',
            'Dedicated "Sponsor Spotlight" in our bi-weekly developer newsletter.',
            'Custom sample apps and integration guides created by our engineering team.',
            'Priority placement in our "Top Rated" and "Editor\'s Choice" sections.',
            'Collaborative hackathons and developer outreach programs.'
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-300">
              <CheckCircle2 size={18} className="text-mora-500 mt-1 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-mora-500/10 border border-mora-500/20 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Ready to Interface?</h3>
        <p className="text-slate-400 mb-6">For detailed pricing and custom partnership packages, reach out to our team.</p>
        <div className="flex flex-col items-center gap-4">
          <a href="mailto:beatslevelone@gmail.com" className="bg-mora-600 hover:bg-mora-500 text-white font-bold py-3 px-10 rounded-full transition-all shadow-lg flex items-center gap-2">
            <Mail size={18} /> beatslevelone@gmail.com
          </a>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Signal Response: 24-48 hours</span>
        </div>
      </div>
    </div>
  </PageLayout>
);

export const SupportPage: React.FC = () => {
    const [subject, setSubject] = useState('Technical Issue');
    const supportOptions = ["Technical Issue", "Billing Inquiry", "Sponsorship Query", "Bug Report", "Other"];

    return (
        <PageLayout title="Help and Support" subtitle="Need help with integration or have a question? Our team is here to assist you." icon={LifeBuoy}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-1">
                    <h3 className="text-xl font-bold text-white mb-4">Contact Gateway</h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                        For direct inquiries regarding the Apives platform, API submissions, or technical difficulties, please use the form or email us directly. We strive to provide a rapid response to all grid members.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 p-4 rounded-xl border border-white/5">
                            <Mail size={16} className="text-mora-500" /> beatslevelone@gmail.com
                        </div>
                    </div>
                </div>
                
                <div className="md:col-span-2">
                    <form action="https://formsubmit.co/beatslevelone@gmail.com" method="POST" className="space-y-4">
                        <input type="hidden" name="_subject" value={`Apives Support Request: ${subject}`} />
                        <input type="hidden" name="contact_category" value={subject} />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input 
                              type="text" 
                              name="name" 
                              required 
                              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-mora-500/50 outline-none transition-all placeholder-slate-700" 
                              placeholder="Name" 
                            />
                            <input 
                              type="email" 
                              name="email" 
                              required 
                              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-mora-500/50 outline-none transition-all placeholder-slate-700" 
                              placeholder="Email" 
                            />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Subject</label>
                          <CustomSelect value={subject} onChange={setSubject} options={supportOptions} icon={List} />
                        </div>

                        <textarea 
                          name="message" 
                          required 
                          rows={4} 
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-mora-500/50 outline-none transition-all placeholder-slate-700 resize-none" 
                          placeholder="Explain your technical query..."
                        ></textarea>
                        
                        <button 
                          type="submit" 
                          className="bg-mora-600 hover:bg-mora-500 text-white font-bold py-3 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center gap-2 uppercase tracking-widest text-xs"
                        >
                            Send Signal <ChevronRight size={16} />
                        </button>
                    </form>
                </div>
            </div>
        </PageLayout>
    );
};

export const PrivacyPage: React.FC = () => (
  <PageLayout title="Privacy Policy" subtitle="How we handle your data. Simple and clear rules for our users." icon={Lock}>
    <div className="prose prose-invert max-w-none text-slate-400 space-y-8">
        <section>
            <h3 className="text-white text-xl font-bold mb-3">1. Information We Collect</h3>
            <p>
                We only ask for very basic information like your name and email when you create an account. This is just to make sure your saved APIs are synced across your devices and to let you manage any APIs you choose to post on our directory. We don't ask for personal stuff we don't need. Our collection process is guided by the principle of data minimization, ensuring that your digital footprint remains as light as possible while still receiving the full benefits of the Apives ecosystem.
            </p>
            <p>
                When you interact with the grid, we may log certain non-identifying technical information such as browser types, referring pages, and access times. This is purely used to optimize the interface and ensure that the platform remains performant under varying loads. We do not track individual user behavior across the wider web.
            </p>
        </section>
        <section>
            <h3 className="text-white text-xl font-bold mb-3">2. How We Use API Data</h3>
            <p>
                Apives is a directory, not a proxy. When you use an API found here, your data usually goes directly to that provider. We do not see, read, or store the actual data packets you send through these third-party services. We only track simple stats like how many people clicked an API or gave it an upvote to help other developers find good tools.
            </p>
            <p>
                As a node manager, any data you provide about your API is publicly visible to help users evaluate your service. This includes descriptions, endpoints, and mock responses. We ensure that your contact email remains private unless you choose to include it in public-facing fields. Our system acts as an index, ensuring discoverability while maintaining the boundary between the directory and the actual execution of your API calls.
            </p>
        </section>
        <section>
            <h3 className="text-white text-xl font-bold mb-3">3. Tracking & Cookies</h3>
            <p>
                We might use small cookies to remember your login session. We don't use aggressive tracking to follow you around the internet. We aren't in the business of selling your data to advertisers—we just want to build a better directory for developers. Our cookies are functional, designed to maintain state and provide a seamless user experience.
            </p>
            <p>
                Users can control cookie settings through their browser preferences. However, disabling all cookies may prevent certain features like "Saved APIs" or the "Provider Console" from functioning correctly. We do not utilize third-party tracking pixels that correlate your identity with external advertising profiles.
            </p>
        </section>
        <section>
            <h3 className="text-white text-xl font-bold mb-3">4. Security Expectations</h3>
            <p>
                We use standard industry methods to protect your email and account, including encryption at rest and secure transmission protocols (HTTPS). However, since no system is perfect, we can't promise that things will never go wrong. We do our best to keep the grid safe, but you should use unique passwords and common sense when using our platform.
            </p>
            <p>
                We regularly review our security posture to mitigate emerging threats. In the event of a security incident, we have protocols in place to notify affected users as soon as possible. Security is a shared responsibility, and we encourage users to report any vulnerabilities through our support gateway.
            </p>
        </section>
        <section>
            <h3 className="text-white text-xl font-bold mb-3">5. Deleting Your Info</h3>
            <p>
                Your data is yours. If you want to delete your account or any API you listed, just send us an email at our support address: beatslevelone@gmail.com. We'll manually wipe your data from our systems within a few working days. This "Right to be Forgotten" is a core tenet of our platform philosophy.
            </p>
            <p>
                Once a deletion request is processed, any associated local data, session states, and public listings will be permanently removed. Some non-identifying analytical data may persist in aggregate logs, but it will be impossible to re-link this data to your personal identity.
            </p>
        </section>
    </div>
  </PageLayout>
);

export const TermsPage: React.FC = () => (
  <PageLayout title="Terms of Service" subtitle="Common sense rules for using the Apives platform." icon={ShieldCheck}>
     <div className="prose prose-invert max-w-none text-slate-400 space-y-8">
        <section>
            <h3 className="text-white text-xl font-bold mb-3">1. Being a Good Builder</h3>
            <p>
                Apives is a community tool designed for constructive innovation. By using it, you agree not to spam other users, post fake or broken APIs on purpose, or try to hack our servers. Basically, use the site for building cool stuff, not for breaking things. Prohibited activities include, but are not limited to, unauthorized crawling of the directory, attempting to circumvent security firewalls, or using the platform to distribute malicious scripts.
            </p>
            <p>
                We expect all members of the grid to maintain a professional standard of conduct. Disrespectful behavior in feedback or support channels may result in account termination. Our goal is to foster a safe, efficient, and inspiring environment for the global tech ecosystem.
            </p>
        </section>
        <section>
            <h3 className="text-white text-xl font-bold mb-3">2. Third-Party API Disclaimer</h3>
            <p>
                The APIs listed in our directory are owned and run by other people/companies. We check them once when they are posted, but we can't guarantee they will stay online or work perfectly forever. If an API provider changes their rules or goes offline, that's out of our control. Always read the provider's own terms before using their API in a production environment.
            </p>
            <p>
                Apives does not act as a broker or guarantor for the performance of third-party nodes. Any financial transactions or subscription agreements made with an API provider are strictly between you and that provider. We provide the map, but you are responsible for the journey.
            </p>
        </section>
        <section>
            <h3 className="text-white text-xl font-bold mb-3">3. No "Perfect System" Guarantees</h3>
            <p>
                We provide Apives "as is." While we try to keep the site online 24/7 and free of bugs, we don't officially guarantee 100% uptime or that every piece of info in the directory is perfectly up-to-date. Technology breaks sometimes, and we aren't responsible for any issues your apps have because an external API went down.
            </p>
            <p>
                Under no circumstances shall Apives Systems be liable for any direct, indirect, incidental, or consequential damages arising out of your use or inability to use the platform. This includes lost profits, data loss, or system downtime. We advise all builders to implement robust error handling and fallback mechanisms in their own code.
            </p>
        </section>
        <section>
            <h3 className="text-white text-xl font-bold mb-3">4. Content Ownership</h3>
            <p>
                If you post an API, you are responsible for making sure you have the right to share it. We reserve the right to remove any listing that looks like spam, is illegal, or seems suspicious without giving a detailed reason. By submitting content to the grid, you grant Apives a non-exclusive, worldwide, royalty-free license to display and promote that content.
            </p>
            <p>
                You retain full ownership of your API services and intellectual property. Apives only hosts the discovery profile. If we receive a valid DMCA or copyright infringement notice regarding your listing, we will act in accordance with applicable laws to remove the offending material.
            </p>
        </section>
        <section>
            <h3 className="text-white text-xl font-bold mb-3">5. Rule Updates</h3>
            <p>
                The digital grid is constantly evolving, and so must our rules. We might update these terms if the site grows or if the law changes. If we make big changes, we'll try to put a notice on the homepage or send an email. If you keep using the site after an update, it means you're cool with the new rules.
            </p>
            <p>
                We recommend checking this page periodically to stay informed about your rights and responsibilities. Your continued interface with the Apives platform constitutes acceptance of the most current version of these Terms of Service. For any clarification on these terms, contact beatslevelone@gmail.com.
            </p>
        </section>
    </div>
  </PageLayout>
);

  <PageLayout title="Enterprise" subtitle="High-scale support for organizations." icon={Activity}>
    <div className="space-y-10">
        <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed text-sm md:text-base">
            <h3 className="text-white text-xl md:text-2xl font-bold mb-4">Industrial-Scale Integration</h3>
            <p>
                For organizations that demand the highest levels of reliability and performance, Apives Enterprise offers a suite of advanced features tailored for large-scale operations. As your project moves from MVP to production, the complexity of managing multiple API dependencies increases. Apives Enterprise provides the governance and monitoring tools necessary to maintain system integrity.
            </p>
            </div>
            </div>
            </div>
);
};

export default StaticPages;
          