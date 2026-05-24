import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { LocationProvider } from './context/LocationContext'
import { UIProvider } from './context/UIContext'
import GlobalAuthModal from './components/GlobalAuthModal'
import './index.css'
import App from './App.tsx'
import AllCaregivers from './pages/AllCaregivers.tsx'

import CaregiverDetail from './pages/CaregiverDetail.tsx'
import JobDetail from './pages/JobDetail.tsx'
import AllJobs from './pages/AllJobs.tsx'
import SafetyTips from './pages/SafetyTips.tsx'
import { SubscriptionProvider } from './context/SubscriptionContext'

import Pricing from './pages/Pricing.tsx'
import ResumeTips from './pages/ResumeTips.tsx'
import Resources from './pages/Resources.tsx'

import PrivacyPolicy from './pages/PrivacyPolicy.tsx'
import TermsOfService from './pages/TermsOfService.tsx'
import CookiesPolicy from './pages/CookiesPolicy.tsx'
import AboutUs from './pages/AboutUs.tsx'

// Dashboard shell
import DashboardLayout from './components/dashboard/DashboardLayout.tsx'
// Role-aware router
import DashboardRouter from './pages/dashboard/DashboardRouter.tsx'
// Family pages
import FamilyJobPosts from './pages/dashboard/family/FamilyJobPosts.tsx'
import FamilySavedCaregivers from './pages/dashboard/family/FamilySavedCaregivers.tsx'
import FamilyMessages from './pages/dashboard/family/FamilyMessages.tsx'
import FamilyNotifications from './pages/dashboard/family/FamilyNotifications.tsx'
import FamilySubscription from './pages/dashboard/family/FamilySubscription.tsx'
// Caregiver pages
import CaregiverListing from './pages/dashboard/caregiver/CaregiverListing.tsx'
import CaregiverJobMatches from './pages/dashboard/caregiver/CaregiverJobMatches.tsx'
import CaregiverReviews from './pages/dashboard/caregiver/CaregiverReviews.tsx'
import CaregiverPhotos from './pages/dashboard/caregiver/CaregiverPhotos.tsx'
import CaregiverReferences from './pages/dashboard/caregiver/CaregiverReferences.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <UIProvider>
          <LocationProvider>
            <SubscriptionProvider>
              <ScrollToTop />
              <GlobalAuthModal />
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/caregivers" element={<AllCaregivers />} />
                <Route path="/caregivers/:id" element={<CaregiverDetail />} />
                <Route path="/jobs" element={<AllJobs />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/safety-tips" element={<SafetyTips />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/resume-tips" element={<ResumeTips />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/cookies" element={<CookiesPolicy />} />

                {/* ── Dashboard (role-adaptive) ───────────────────────── */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardRouter page="overview" />} />
                  <Route path="profile" element={<DashboardRouter page="profile" />} />
                  <Route path="contact-requests" element={<DashboardRouter page="contact-requests" />} />
                  <Route path="messages" element={<FamilyMessages />} />
                  <Route path="notifications" element={<FamilyNotifications />} />
                  {/* Family-only */}
                  <Route path="job-posts" element={<FamilyJobPosts />} />
                  <Route path="saved" element={<FamilySavedCaregivers />} />
                  <Route path="subscription" element={<FamilySubscription />} />
                  {/* Caregiver-only */}
                  <Route path="listing" element={<CaregiverListing />} />
                  <Route path="job-matches" element={<CaregiverJobMatches />} />
                  <Route path="reviews" element={<CaregiverReviews />} />
                  <Route path="photos" element={<CaregiverPhotos />} />
                  <Route path="references" element={<CaregiverReferences />} />
                </Route>
              </Routes>
            </SubscriptionProvider>
          </LocationProvider>
          </UIProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
