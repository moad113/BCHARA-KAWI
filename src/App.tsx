import React, { useEffect, useState } from 'react';
import { ShoppingCart, User, Truck, Star, Scissors } from 'lucide-react';
import { motion } from 'motion/react';
import { VoiceAssistant } from './components/VoiceAssistant';

const Navbar = () => (
  <nav className="absolute top-0 w-full z-50 px-8 py-6 flex justify-between items-center glass-panel border-b-0 border-x-0 border-t-0">
    <div className="text-2xl font-serif tracking-widest text-[#D4AF37]">L'OR CAFTAN</div>
    <div className="hidden md:flex space-x-8 text-sm uppercase tracking-widest text-[#F5F5DC]/80">
      <a href="#" className="hover:text-[#D4AF37] transition-colors">Home</a>
      <a href="#" className="hover:text-[#D4AF37] transition-colors">Collection</a>
      <a href="#" className="hover:text-[#D4AF37] transition-colors">About</a>
      <a href="#" className="hover:text-[#D4AF37] transition-colors">Contact</a>
    </div>
    <div className="flex space-x-6 text-[#D4AF37]">
      <User className="w-5 h-5 cursor-pointer hover:text-[#F5F5DC] transition-colors" strokeWidth={1.5} />
      <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-[#F5F5DC] transition-colors" strokeWidth={1.5} />
    </div>
  </nav>
);

const GoldDust = () => {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; top: string; size: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 1}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 10 + 5}s`,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="dust-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
      {/* Bokeh effects */}
      <div className="bokeh bg-[#D4AF37] w-96 h-96 top-1/4 left-1/4" />
      <div className="bokeh bg-[#C5A059] w-[500px] h-[500px] bottom-1/4 right-1/4" />
      <div className="bokeh bg-[#F5F5DC] w-64 h-64 top-1/2 left-1/2" />
    </div>
  );
};

const Hero = () => (
  <section className="relative h-screen flex items-center justify-center overflow-hidden">
    {/* Background Image */}
    <div 
      className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1583391733958-d15317a99a16?q=80&w=2000&auto=format&fit=crop")',
      }}
    >
      {/* Dark Overlay for Cinematic Vibe */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/60 via-[#0D0D0D]/40 to-[#0D0D0D] z-0" />
    </div>

    <GoldDust />

    <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-20">
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6 leading-tight"
      >
        <span className="text-gradient-gold">Exquisite</span><br />
        <span className="text-[#F5F5DC]">Moroccan Caftans</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="text-lg md:text-xl text-[#F5F5DC]/80 font-sans font-light mb-12 max-w-2xl mx-auto"
      >
        Discover the epitome of luxury and tradition. Intricately embroidered masterpieces for your most unforgettable moments.
      </motion.p>

      <motion.button 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="bg-gold-lux text-[#0D0D0D] px-10 py-4 rounded-sm font-sans uppercase tracking-widest text-sm font-bold transition-all duration-300"
      >
        Explore Collection
      </motion.button>
    </div>
  </section>
);

const BenefitBar = () => (
  <section className="relative z-20 -mt-16 max-w-6xl mx-auto px-4">
    <div className="glass-panel rounded-lg py-8 px-4 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <Truck className="w-8 h-8 text-[#D4AF37]" strokeWidth={1} />
        <h3 className="font-serif text-xl text-[#F5F5DC]">Free Shipping</h3>
        <p className="text-sm text-[#F5F5DC]/60 font-light">Worldwide delivery on all luxury orders.</p>
      </div>
      <div className="flex flex-col items-center space-y-4 md:border-x border-[#D4AF37]/20 md:px-8">
        <Star className="w-8 h-8 text-[#D4AF37]" strokeWidth={1} />
        <h3 className="font-serif text-xl text-[#F5F5DC]">Premium Quality</h3>
        <p className="text-sm text-[#F5F5DC]/60 font-light">Hand-selected silks and intricate embroidery.</p>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <Scissors className="w-8 h-8 text-[#D4AF37]" strokeWidth={1} />
        <h3 className="font-serif text-xl text-[#F5F5DC]">Custom Tailoring</h3>
        <p className="text-sm text-[#F5F5DC]/60 font-light">Made to measure for the perfect fit.</p>
      </div>
    </div>
  </section>
);

const ThreeDSlideshow = () => {
  const images = [
    "https://images.unsplash.com/photo-1583391733958-d15317a99a16?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515347619152-14123c126611?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1596450514735-111a2fe02935?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583391733975-642c3a53fc1f?q=80&w=800&auto=format&fit=crop",
  ];

  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRotation((prev) => prev - 72); // 360 / 5 = 72
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-32 overflow-hidden perspective-1000">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-serif mb-4 text-[#F5F5DC]">The Royal Gallery</h2>
        <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs">A 360° View of Elegance</p>
      </div>

      <div className="relative h-[450px] w-full flex items-center justify-center">
        <motion.div
          animate={{ rotateY: rotation }}
          transition={{ duration: 1.5, ease: [0.45, 0, 0.55, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-[300px] h-[400px]"
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-sm overflow-hidden border border-[#D4AF37]/30 shadow-2xl"
              style={{
                transform: `rotateY(${i * 72}deg) translateZ(400px)`,
                backfaceVisibility: "hidden",
              }}
            >
              <img src={img} alt={`Caftan ${i}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/80 to-transparent" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const CategoryCards = () => {
  const categories = [
    {
      title: "New Arrivals",
      image: "https://images.unsplash.com/photo-1515347619152-14123c126611?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Luxury Caftans",
      image: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Bridal",
      image: "https://images.unsplash.com/photo-1596450514735-111a2fe02935?q=80&w=800&auto=format&fit=crop",
    }
  ];

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif mb-4 text-[#F5F5DC]">Curated Collections</h2>
        <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="group relative h-[500px] overflow-hidden rounded-sm cursor-pointer"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${cat.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
            
            <div className="absolute bottom-0 left-0 w-full p-8 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-2xl font-serif text-[#F5F5DC] mb-2">{cat.title}</h3>
              <div className="w-0 h-[1px] bg-[#D4AF37] mx-auto group-hover:w-16 transition-all duration-500"></div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="px-10 py-4 border border-[#D4AF37] text-[#D4AF37] rounded-sm font-sans uppercase tracking-widest text-sm font-semibold hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all duration-300"
        >
          View All Collections
        </motion.button>
      </div>
    </section>
  );
};

const AudioSection = () => (
  <section className="py-24 px-4 max-w-4xl mx-auto text-center">
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="glass-panel p-12 rounded-lg border border-[#D4AF37]/30 relative overflow-hidden"
    >
      <div className="relative z-10">
        <h3 className="text-3xl font-serif mb-8 text-[#F5F5DC]">استمع إلى: Ghazala Dialik</h3>
        <div className="flex justify-center">
          <audio controls className="w-full max-w-md custom-audio">
            <source src="Ghazala_Dialik.mp3" type="audio/mpeg" />
            متصفحك لا يدعم تشغيل الملفات الصوتية.
          </audio>
        </div>
        <p className="mt-6 text-sm text-[#F5F5DC]/60 italic font-light tracking-widest uppercase">The Sound of Moroccan Heritage</p>
      </div>
      {/* Decorative elements */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#D4AF37] opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#C5A059] opacity-10 rounded-full blur-3xl"></div>
    </motion.div>
  </section>
);

export default function App() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F5F5DC] font-sans selection:bg-[#D4AF37] selection:text-[#0D0D0D]">
      <Navbar />
      <Hero />
      <BenefitBar />
      <ThreeDSlideshow />
      <CategoryCards />
      <AudioSection />
      <VoiceAssistant />
      
      <footer className="border-t border-[#D4AF37]/20 py-12 text-center text-sm text-[#F5F5DC]/50 font-light">
        <p>&copy; 2026 L'OR CAFTAN. All rights reserved.</p>
      </footer>
    </div>
  );
}
