import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Brain, Compass, GraduationCap, Heart, Mail, MapPin, Sparkles, Star, Users, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FlickeringGrid } from '../components/ui/flickering-grid'; // Ensure this path is correct!

// --- Data ---
const STATS = [
  { value: '50+', label: 'Universities', icon: GraduationCap },
  { value: '200+', label: 'Programs', icon: BookOpen },
  { value: '21k+', label: 'Students', icon: Users },
  { value: '4.8', label: 'Avg Rating', icon: Star },
];

const TEAM = [
  { name: 'Abebe Girma', role: 'Founder & CEO', avatar: 'https://i.pravatar.cc/150?u=101', bio: 'Former student who struggled to find the right university. Built Finask to solve that.' },
  { name: 'Tigist Haile', role: 'Head of Product', avatar: 'https://i.pravatar.cc/150?u=102', bio: 'UX researcher passionate about making education accessible to every Ethiopian student.' },
  { name: 'Dawit Bekele', role: 'Lead Engineer', avatar: 'https://i.pravatar.cc/150?u=103', bio: 'Full-stack engineer with a love for building tools that matter.' },
  { name: 'Sara Tesfaye', role: 'Data & AI', avatar: 'https://i.pravatar.cc/150?u=104', bio: 'Machine learning engineer turning university data into actionable insights.' },
];

// Reconfigured spans for a beautiful 2-1 / 1-2 interlocking Bento Grid
// FIX: Added the 'glow' property to resolve the TypeScript error
const VALUES = [
  { 
    id: 'ai', icon: Brain, title: 'AI-Powered Discovery', 
    desc: 'Smart recommendations tailored to each student\'s goals, location, and interests. We eliminate the guesswork.', 
    color: 'bg-brand-blue', text: 'text-brand-blue', border: 'border-blue-500/20', span: 'col-span-1 md:col-span-2',
    glow: 'shadow-blue-500/50'
  },
  { 
    id: 'student', icon: Heart, title: 'Student First', 
    desc: 'Every decision we make starts with one question: does this help the student?', 
    color: 'bg-indigo-500', text: 'text-indigo-500', border: 'border-indigo-500/20', span: 'col-span-1 md:col-span-1',
    glow: 'shadow-indigo-500/50'
  },
  { 
    id: 'data', icon: Zap, title: 'Always Current', 
    desc: 'Real-time data on programs, rankings, and campus life — always up to date.', 
    color: 'bg-brand-yellow', text: 'text-amber-500', border: 'border-amber-500/20', span: 'col-span-1 md:col-span-1',
    glow: 'shadow-amber-500/50'
  },
  { 
    id: 'local', icon: MapPin, title: 'Built for Ethiopia', 
    desc: 'Designed specifically for the nuances of the Ethiopian higher education landscape, understanding local constraints and opportunities.', 
    color: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500/20', span: 'col-span-1 md:col-span-2',
    glow: 'shadow-emerald-500/50'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const AboutPage = () => {
  // Automatically detect dark mode for the grid color
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full min-h-screen pb-24 bg-slate-50/50 dark:bg-[#0a0a0a]/50 transition-colors duration-300 relative overflow-hidden">
      
      {/* ── FOOLPROOF BACKGROUND (FlickeringGrid + Blur Orbs) ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FlickeringGrid
          className="absolute inset-0 w-full h-full [mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]"
          squareSize={4}
          gridGap={6}
          color={isDark ? "#60A5FA" : "#2563eb"}
          maxOpacity={isDark ? 0.2 : 0.15}
          flickerChance={0.3}
        />
        {/* Deep ambient glows for 3D volume */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-blue/10 dark:bg-brand-blue/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-brand-yellow/10 dark:bg-brand-yellow/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-24 px-6 z-10 flex flex-col items-center justify-center min-h-[65vh]">
        <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-white/5 backdrop-blur-md text-brand-blue dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-slate-200 dark:border-white/10 shadow-sm"
          >
            <Compass size={14} className="text-brand-yellow animate-pulse" />
            Our Origins
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter text-slate-900 dark:text-white mb-6 leading-[0.95]"
          >
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-indigo-500 pb-2">Ethiopian</span> <br className="hidden md:block"/> Students
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12 font-medium"
          >
            Finding the right university used to be a guessing game. We built Finask to be the ultimate compass for your academic journey.
          </motion.p>
        </div>
      </section>

      {/* ── THE STATS DOCK (Sleek Glassmorphic Belt) ── */}
      <section className="px-6 pb-32 relative z-20 -mt-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto bg-white/60 dark:bg-zinc-900/60 backdrop-blur-3xl border border-white dark:border-white/10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(37,99,235,0.15)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] p-2 md:p-3"
        >
          <div className="flex flex-wrap md:flex-nowrap items-center justify-around gap-y-8 rounded-[2rem] bg-white/90 dark:bg-[#0a0a0a]/90 border border-slate-100 dark:border-white/5 py-8 md:py-10 px-4 shadow-inner">
            {STATS.map((stat, i) => (
              <React.Fragment key={stat.label}>
                <div className="flex flex-col items-center w-1/2 md:w-auto text-center px-4 group cursor-default">
                  <stat.icon size={28} className="text-brand-blue mb-4 opacity-80 group-hover:scale-110 group-hover:text-brand-yellow transition-all duration-300" />
                  <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">{stat.value}</p>
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{stat.label}</p>
                </div>
                {i !== STATS.length - 1 && (
                  <div className="hidden md:block w-px h-20 bg-gradient-to-b from-transparent via-slate-200 dark:via-white/10 to-transparent" />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── MISSION & EDITORIAL OVERLAP ── */}
      <section className="px-6 pb-32 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
            
            {/* Text Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-10 bg-brand-blue rounded-full" />
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">The Gap <br/> We're Bridging</h2>
              </div>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-medium">
                Ethiopia has over 50 universities spread across 11 regions. Each has unique programs, varying climates, and distinct campus cultures. Yet, most students make their biggest life choice based purely on proximity or hearsay.
              </p>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10 font-medium">
                We aggregate millions of data points — from MoSHE rankings to campus amenities — and surface it through a clean, intuitive platform so you can focus on what matters: your future.
              </p>
              
              <div className="flex items-center gap-4 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/5 p-4 rounded-[1.5rem] w-fit shadow-sm">
                <div className="flex -space-x-4">
                  {[1,2,3].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/150?u=${i+30}`} className="w-12 h-12 rounded-full border-4 border-white dark:border-zinc-800 object-cover shadow-sm" alt="Student" />
                  ))}
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">
                  Trusted by <br/> <span className="text-brand-blue dark:text-blue-400 text-base">21,000+ students</span>
                </p>
              </div>
            </motion.div>

            {/* Dynamic Image Composition Side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 relative h-[450px] md:h-[600px] w-full mt-10 lg:mt-0"
            >
              {/* Back Image */}
              <div className="absolute top-0 right-0 w-[75%] h-[70%] rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-zinc-800 shadow-2xl border border-white/20 z-0">
                <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600" alt="Campus" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-brand-blue/10 mix-blend-multiply dark:mix-blend-overlay" />
              </div>
              
              {/* Front Overlapping Image */}
              <div className="absolute bottom-0 left-0 w-[65%] h-[65%] rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-zinc-800 shadow-2xl border-[8px] border-white dark:border-[#050505] z-10">
                <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600" alt="Students" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>

              {/* Floating Accent Card */}
              <div className="absolute top-1/2 left-[5%] -translate-y-1/2 rounded-[2rem] bg-white/95 dark:bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-6 border border-slate-200/50 dark:border-white/10 shadow-2xl z-20">
                  <Sparkles size={28} className="text-brand-yellow mb-2" />
                  <h3 className="font-black text-slate-900 dark:text-white text-3xl">50+</h3>
                  <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mt-1">Campuses</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUES (INTERLOCKING BENTO BOX) ── */}
      <section className="px-6 pb-32 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Our Core DNA</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg">The principles that guide how we build and curate the Finask platform.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${v.span} bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 hover:shadow-2xl hover:border-brand-blue/30 transition-all duration-500 group flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-16 h-16 ${v.color} rounded-[1.2rem] flex items-center justify-center text-white shadow-lg ${v.glow} mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <v.icon size={28} />
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white text-2xl md:text-3xl mb-4 tracking-tight leading-none">{v.title}</h3>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-auto pt-6">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STAGGERED TEAM PANES ── */}
      <section className="px-6 pb-32 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">The Architects</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg">The minds building the future of Ethiopian higher education discovery.</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-start"
          >
            {TEAM.map((member, i) => (
              <motion.div
                variants={itemVariants}
                key={member.name}
                // Premium organic stagger: evens push down, odds push up
                className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] p-6 pb-8 text-center hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.15)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 group ${i % 2 !== 0 ? 'lg:mt-16' : ''}`}
              >
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500" />
                  <img src={member.avatar} alt={member.name} className="relative w-full h-full rounded-full object-cover border-4 border-white dark:border-[#0a0a0a] shadow-xl group-hover:-translate-y-2 transition-transform duration-500" />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-xl md:text-2xl mb-1 tracking-tight">{member.name}</h3>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-brand-blue mb-5">{member.role}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed px-2">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PREMIUM CTA CONSOLE ── */}
      <section className="px-6 pb-12 relative z-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 dark:bg-[#111111] border border-slate-800 dark:border-white/10 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl"
          >
            {/* Ambient CTA Glows */}
            <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[150%] bg-brand-blue/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-50%] left-[-10%] w-[60%] h-[150%] bg-brand-yellow/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md text-white rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-8 border border-white/20">
                <Compass size={14} className="text-brand-yellow" /> Your Future Awaits
              </div>
              <h2 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">Find Your <span className="text-brand-blue">Campus</span></h2>
              <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium">
                Join thousands of students who bypassed the guesswork and found their perfect match with our intelligent discovery engine.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/universities" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:-translate-y-1">
                  Start Discovering <ArrowRight size={18} />
                </Link>
                <a href="mailto:hello@finask.et" className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black transition-all hover:-translate-y-1">
                  Contact Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;