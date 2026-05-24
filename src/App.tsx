import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import JobListings from './components/JobListings';
import JobSeekers from './components/JobSeekers';
import HowItWorks from './components/HowItWorks';
import UrgentHire from './components/UrgentHire';
import PostAdModal from './components/PostAdModal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

function App() {
  const [postAdOpen, setPostAdOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePostAd = () => {
    setPostAdOpen(true);
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar onPostAd={handlePostAd} onAuth={() => setAuthOpen(true)} />
      <Hero onPostAd={handlePostAd} onBrowse={() => scrollTo('#listings')} />
      <Categories />
      <UrgentHire />
      <JobListings />
      <JobSeekers />
      <HowItWorks />
      <Footer />

      <PostAdModal isOpen={postAdOpen} onClose={() => setPostAdOpen(false)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

export default App;
