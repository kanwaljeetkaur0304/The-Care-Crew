import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import JobListings from './components/JobListings';
import JobSeekers from './components/JobSeekers';
import HowItWorks from './components/HowItWorks';
import UrgentHire from './components/UrgentHire';
import PostAdModal from './components/PostAdModal';
import Footer from './components/Footer';
import { useUI } from './context/UIContext';

function App() {
  const [postAdOpen, setPostAdOpen] = useState(false);
  const { openAuthModal } = useUI();

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePostAd = () => {
    setPostAdOpen(true);
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar onPostAd={handlePostAd} onAuth={openAuthModal} />
      <Hero onPostAd={handlePostAd} onBrowse={() => scrollTo('#listings')} />
      <Categories />
      <UrgentHire />
      <JobListings />
      <JobSeekers />
      <HowItWorks />
      <Footer />

      <PostAdModal isOpen={postAdOpen} onClose={() => setPostAdOpen(false)} />
    </div>
  );
}

export default App;
