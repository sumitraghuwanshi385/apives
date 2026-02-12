import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import SponsorAnalytics from "./pages/SponsorAnalytics";
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { BrowseApis } from './pages/BrowseApis';
import { ApiDetails } from './pages/ApiDetails';
import { ProviderDashboard } from './pages/ProviderDashboard';
import { AccessPage } from './pages/AuthPages';
import { SubmitApi } from './pages/SubmitApi';
import { FreshApis } from './pages/FreshApis';
import { PopularApis } from './pages/PopularApis';
import { OnboardingPage } from './pages/Onboarding';
import {
  EnterprisePage,
  DocumentationPage,
  StatusPage,
  CookiesPage,
  PrivacyPage,
  TermsPage,
  SupportPage,
  SponsorshipPage
} from './pages/StaticPages';

import { CookieBanner } from "./components/CookieBanner";

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
      {/* ✅ Cookie banner — global */}
      <CookieBanner />

      <ScrollToTop />

      <div className="flex flex-col min-h-screen bg-black font-sans text-slate-50 selection:bg-mora-500 selection:text-black">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/browse" element={<BrowseApis />} />
            <Route path="/submit" element={<SubmitApi />} />
            <Route path="/api/:id" element={<ApiDetails />} />
            <Route path="/provider" element={<ProviderDashboard />} />
            <Route path="/access" element={<AccessPage />} />
            <Route path="/fresh" element={<FreshApis />} />
            <Route path="/popular" element={<PopularApis />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Footer pages */}
            <Route path="/enterprise" element={<EnterprisePage />} />
            <Route path="/docs" element={<DocumentationPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/sponsorship" element={<SponsorshipPage />} />

            {/* Admin */}
            <Route path="/admin/sponsors" element={<SponsorAnalytics />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
}


export default App;