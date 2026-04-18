"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Image as ImageIcon, 
  Mic, 
  Scissors, 
  BarChart3, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Users,
  Zap
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-orange-400 bg-clip-text text-transparent">
          RESW AI
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#roadmap" className="hover:text-white transition-colors">Roadmap</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full transition-all border border-white/10">
            Login
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-black/95 border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4 text-center">
              <a href="#features" onClick={() => setIsOpen(false)} className="text-gray-300">Features</a>
              <a href="#roadmap" onClick={() => setIsOpen(false)} className="text-gray-300">Roadmap</a>
              <a href="#faq" onClick={() => setIsOpen(false)} className="text-gray-300">FAQ</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[#05050A]">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-700/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-blue-700/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[800px] h-[400px] bg-orange-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Parallax Shapes */}
      <motion.div style={{ y: y1 }} className="absolute top-20 right-20 w-24 h-24 border border-white/10 rounded-full blur-sm" />
      <motion.div style={{ y: y2 }} className="absolute bottom-40 left-20 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl rotate-12" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-6 backdrop-blur-sm">
            ✨ The AI Growth OS for YouTube Creators
          </span>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-tight">
            Grow Faster with <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-orange-400 bg-clip-text text-transparent animate-gradient-x">
              RESW AI
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Scripting, thumbnails, voiceover, clipping, and analytics—all in one workspace built specifically for serious creators.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a href="#waitlist" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              Join the Waitlist <ArrowRight size={18} />
            </a>
            <a href="#roadmap" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-all flex items-center justify-center">
              View Creator Roadmap
            </a>
          </div>

          <p className="text-sm text-gray-500 font-mono">
            Early access seats: <span className="text-orange-400">10,000</span> · Limited invite-only beta
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const WaitlistForm = () => {
  const [email, setEmail] = useState("");
  const [type, setType] = useState("Beginner Creator");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      console.log("Waitlist Signup:", { email, type });
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <section id="waitlist" className="py-24 relative bg-black">
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden backdrop-blur-xl">
          {/* Glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
          
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Secure Your Spot</h2>
            <p className="text-gray-400">Join 10,000+ creators waiting for early access.</p>
          </div>

          {status === "success" ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
              <p className="text-gray-400 mb-6">We'll email you before launch.</p>
              <div className="inline-block px-4 py-2 bg-orange-500/10 text-orange-400 rounded-lg text-sm border border-orange-500/20">
                🔥 Refer friends soon to unlock 2 months free Premium.
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option>Beginner Creator</option>
                  <option>Faceless Channel</option>
                  <option>Agency</option>
                  <option>Other</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <span className="animate-pulse">Joining...</span>
                ) : (
                  <>Join Waitlist <Sparkles size={18} /></>
                )}
              </button>
              <p className="text-xs text-center text-gray-500 mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

const Benefits = () => {
  const benefits = [
    {
      icon: <Zap className="text-yellow-400" />,
      title: "From Idea to Viral Video",
      desc: "Generate full video concepts, scripts, and assets in minutes, not hours."
    },
    {
      icon: <Users className="text-blue-400" />,
      title: "YouTube-First Tools",
      desc: "Built specifically for retention, CTR, and algorithm growth—not generic text."
    },
    {
      icon: <Sparkles className="text-purple-400" />,
      title: "Premium Experience",
      desc: "Invite-only access ensures high-quality tools and a focused community."
    }
  ];

  return (
    <section className="py-24 bg-[#05050A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {React.cloneElement(item.icon as React.ReactElement, { size: 24 })}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    { icon: <Play />, title: "Smart Scripts", desc: "AI that writes hooks and retains attention." },
    { icon: <ImageIcon />, title: "Thumbnail Gen", desc: "High-CTR thumbnail ideas generated instantly." },
    { icon: <BarChart3 />, title: "Competitor Analyzer", desc: "See what's working in your niche right now." },
    { icon: <Mic />, title: "Voiceover Studio", desc: "Ultra-realistic AI voices tuned for storytelling." },
    { icon: <Sparkles />, title: "Text-to-Video", desc: "Generate B-roll and scenes from simple prompts." },
    { icon: <Scissors />, title: "Clipping OS", desc: "Turn long videos into viral Shorts automatically." },
  ];

  return (
    <section id="features" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Everything You Need to <span className="text-blue-400">Scale</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">One workspace to replace your entire tech stack.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-blue-900/10 transition-all cursor-default group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white mb-4 group-hover:rotate-6 transition-transform">
                {React.cloneElement(f.icon as React.ReactElement, { size: 20 })}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Flow = () => {
  return (
    <section className="py-24 bg-[#05050A] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">The Creator Flow</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          {[
            { step: "01", title: "Plan & Script", desc: "Generate video ideas and full scripts." },
            { step: "02", title: "Create Assets", desc: "Make thumbnails, voiceovers, and B-roll." },
            { step: "03", title: "Optimize & Clip", desc: "Analyze performance and auto-clip shorts." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative flex flex-col items-center text-center bg-[#05050A] p-4 z-10"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-b from-white/10 to-transparent border border-white/10 flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Roadmap = () => {
  const stages = [
    { title: "Stage 1: Core Growth", items: ["Script Generator", "Thumbnail Ideas", "Analytics Dashboard"], active: true },
    { title: "Stage 2: Creative Studio", items: ["AI Voiceover", "Text-to-Image", "B-Roll Gen"], active: false },
    { title: "Stage 3: Clipping OS", items: ["Auto-Shorts", "Advanced Analytics", "Team Collaboration"], active: false },
  ];

  return (
    <section id="roadmap" className="py-24 bg-black">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Product Roadmap</h2>
        
        <div className="space-y-8 relative before:absolute before:left-4 md:before:left-1/2 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-blue-500 before:to-orange-500">
          {stages.map((stage, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={cn(
                "relative flex flex-col md:flex-row gap-8 items-center",
                i % 2 === 0 ? "md:flex-row-reverse" : ""
              )}
            >
              <div className="flex-1 w-full md:w-auto" />
              
              <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-black border-4 border-purple-500 z-10 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>

              <div className={cn(
                "flex-1 w-full p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm",
                stage.active ? "border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)]" : "opacity-60"
              )}>
                <h3 className={cn("text-xl font-bold mb-4", stage.active ? "text-purple-400" : "text-gray-400")}>
                  {stage.title}
                </h3>
                <ul className="space-y-2">
                  {stage.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle2 size={16} className={stage.active ? "text-purple-400" : "text-gray-600"} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqs = [
    { q: "Who is RESW AI for?", a: "RESW AI is built for YouTube creators, faceless channel owners, and small agencies who want to scale production without losing quality." },
    { q: "How is this different from ChatGPT?", a: "ChatGPT is generic. RESW AI is trained specifically on viral YouTube data, understanding retention, CTR, and pacing." },
    { q: "Is there a free plan?", a: "We offer a limited free tier during beta, but full access will be part of our Premium subscription." },
    { q: "When will RESW AI launch?", a: "We are rolling out access to waitlist members starting next month. Join now to secure early access." },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-[#05050A]">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-medium text-white">{faq.q}</span>
                {openIndex === i ? <ChevronUp className="text-purple-400" /> : <ChevronDown className="text-gray-500" />}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="p-6 pt-0 text-gray-400 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          RESW AI
        </div>
        
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Roadmap</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
        </div>

        <div className="text-xs text-gray-600">
          © 2024 RESW AI. Invite-only beta.
        </div>
      </div>
    </footer>
  );
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Navbar />
      <Hero />
      <Benefits />
      <Features />
      <Flow />
      <Roadmap />
      <FAQ />
      <WaitlistForm />
      <Footer />
    </main>
  );
}