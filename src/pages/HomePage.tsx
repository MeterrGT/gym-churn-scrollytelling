import React from 'react';
import { CyberCanvas } from '@/components/CyberCanvas';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Projects } from '@/components/Projects';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { useScrollspy } from '@/hooks/useScrollspy';

interface HomePageProps {
  onEasterEggClick: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onEasterEggClick }) => {
  const activeSection = useScrollspy(
    ['hero', 'about', 'skills', 'projects', 'contact'],
    200
  );

  return (
    <div className="portfolio-app-root">
      {/* Background Interactive Canvas and Ambient Glows */}
      <CyberCanvas />

      {/* 1. Navbar */}
      <Navbar activeSection={activeSection} />

      {/* 2. Hero Component */}
      <Hero onEasterEggClick={onEasterEggClick} />

      {/* 3. About Component ('Hakkımda') */}
      <About />

      {/* 4. Skills Component ('Beceriler') */}
      <Skills />

      {/* 5. Combined Uniform 3 Projects Grid: Gym Churn (with Scrollytelling link), Kestirimci Bakım, Laptop Fiyat */}
      <Projects />

      {/* 6. Contact Component ('İletişim') */}
      <Contact />

      {/* 7. Footer Component */}
      <Footer />
    </div>
  );
};

export default HomePage;
