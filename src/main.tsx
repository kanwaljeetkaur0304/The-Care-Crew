import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { LocationProvider } from './context/LocationContext'
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LocationProvider>
            <SubscriptionProvider>
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
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/cookies" element={<CookiesPolicy />} />
              </Routes>
            </SubscriptionProvider>
          </LocationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
