import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CookieBanner } from "./components/CookieBanner";

/* BUILD PAGES */
import BuildChatbots from "./pages/build/BuildChatbots";
import BuildVoiceToText from "./pages/build/BuildVoiceToText";
import BuildPayments from "./pages/build/BuildPayments";
import BuildAuthentication from "./pages/build/BuildAuthentication";
import BuildAnalytics from "./pages/build/BuildAnalytics";

/* CORE PAGES */
import { LandingPage } from "./pages/LandingPage";
import { BrowseApis } from "./pages/BrowseApis";
import { ApiDetails } from "./pages/ApiDetails";
import { ProviderDashboard } from "./pages/ProviderDashboard";
import { AccessPage } from "./pages/AuthPages";
import { SubmitApi } from "./pages/SubmitApi";
import { FreshApis } from "./pages/FreshApis";
import { PopularApis } from "./pages/PopularApis";
import { OnboardingPage } from "./pages/Onboarding";

/* ADMIN */
import SponsorAnalytics from "./pages/SponsorAnalytics";

/* STATIC PAGES */
import {
  EnterprisePage,
  DocumentationPage,
  StatusPage,
  CookiesPage,
  PrivacyPage,
  TermsPage,
  SupportPage,
  SponsorshipPage
} from "./pages/StaticPages";

/* 🔥 Scroll to top on route change */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <>
      <CookieBanner />
      <ScrollToTop />

      <div className="flex flex-col min-h-screen bg-black font-sans text-slate-50 selection:bg-mora-500 selection:text-black">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* LANDING */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/browse" element={<BrowseApis />} />

            {/* 🔥 BUILD USE-CASES */}
            <Route path="/build/chatbots" element={<BuildChatbots />} />
            <Route path="/build/voice" element={<BuildVoiceToText />} />
            <Route path="/build/payments" element={<BuildPayments />} />
            <Route path="/build/authentication" element={<BuildAuthentication />} />
            <Route path="/build/analytics" element={<BuildAnalytics />} />

            {/* API & PROVIDER */}
            <Route path="/submit" element={<SubmitApi />} />
            <Route path="/api/:id" element={<ApiDetails />} />
            <Route path="/provider" element={<ProviderDashboard />} />

            {/* AUTH */}
            <Route path="/access" element={<AccessPage />} />

            {/* LISTINGS */}
            <Route path="/fresh" element={<FreshApis />} />
            <Route path="/popular" element={<PopularApis />} />

            {/* ONBOARDING */}
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* STATIC / FOOTER */}
            <Route path="/enterprise" element={<EnterprisePage />} />
            <Route path="/docs" element={<DocumentationPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/sponsorship" element={<SponsorshipPage />} />

            {/* ADMIN */}
            <Route path="/admin/sponsors" element={<SponsorAnalytics />} />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;