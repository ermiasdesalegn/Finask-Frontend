import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import heroImg from "../../assets/hero-img.png";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-brand-blue/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-brand-yellow/5 blur-[100px] rounded-full translate-y-1/4 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-brand-blue rounded-full text-sm font-bold mb-8 border border-blue-100 dark:border-blue-500/20"
          >
            <span className="w-2 h-2 bg-brand-blue rounded-full animate-pulse" />
            Ethiopia's First All-in-One University Guide
          </motion.div>
          <h1 className="text-5xl lg:text-7xl font-black leading-[0.95] mb-8 dark:text-white tracking-tighter">
            Smart <br />
            <span className="text-brand-blue">Discovery</span> <br />
            for Ethiopia
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-lg leading-relaxed">
            Empowering students with AI-driven insights to navigate their academic future with confidence.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link to="/universities" className="px-10 py-5 bg-brand-blue text-white rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/40 hover:-translate-y-1 active:scale-95">
              Get Started <ArrowRight size={22} />
            </Link>
            <button className="px-10 py-5 border-2 border-slate-200 dark:border-white/10 rounded-2xl font-black text-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all hover:-translate-y-1 active:scale-95">
              Contact Us
            </button>
          </div>
          
          <div className="mt-16 flex items-center gap-8">
            <div className="flex -space-x-5">
              {[1, 2, 3, 4].map((i) => (
                <motion.img 
                  key={i}
                  whileHover={{ y: -5, zIndex: 10 }}
                  src={`https://i.pravatar.cc/150?u=${i + 10}`} 
                  className="w-14 h-14 rounded-2xl border-4 border-white dark:border-[#121212] object-cover shadow-lg"
                  alt="User"
                />
              ))}
              <div className="w-14 h-14 rounded-2xl border-4 border-white dark:border-[#121212] bg-brand-yellow flex items-center justify-center text-black font-black text-xs shadow-lg">
                +21k
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Community</p>
              <p className="font-black text-lg dark:text-white">Active Students</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative max-w-md mx-auto lg:max-w-lg"
        >
          {/* Main Image Container */}
          <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-[12px] border-white dark:border-white/5 group">
            <img 
              src={heroImg}
              className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
              alt="Student"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60" />
          </div>

          {/* Animated Dashed Circle Path */}
          <motion.svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 400 500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.circle
              cx="200"
              cy="250"
              r="180"
              fill="none"
              stroke="#facc15"
              strokeWidth="2"
              strokeDasharray="8 8"
              initial={{ pathLength: 0, rotate: 0 }}
              animate={{ pathLength: 1, rotate: 360 }}
              transition={{ 
                pathLength: { duration: 2, ease: "easeInOut" },
                rotate: { duration: 20, repeat: Infinity, ease: "linear" }
              }}
            />
          </motion.svg>

          {/* Floating Book Icon - Top Left */}
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [-5, 5, -5]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-8 -left-8 z-20"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/50 border-4 border-white dark:border-slate-800">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
          </motion.div>

          {/* Floating Graduation Cap - Top Right */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -top-6 -right-12 z-20"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-yellow-500/50 border-4 border-white dark:border-slate-800">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
          </motion.div>

          {/* Floating Trophy - Bottom Left */}
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-6 -left-10 z-20"
          >
            <div className="w-18 h-18 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-amber-500/50 border-4 border-white dark:border-slate-800 p-3">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 00-1.5 1.5v.5h-3v-.5a1.5 1.5 0 00-1.5-1.5H10a1 1 0 01-1-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5a1.5 1.5 0 00-3 0V4a1 1 0 01-1 1H7a1 1 0 00-1 1v3a1 1 0 001 1h.5a1.5 1.5 0 011.5 1.5v.5h3v-.5a1.5 1.5 0 011.5-1.5H14a1 1 0 001-1V6a1 1 0 00-1-1h-3a1 1 0 01-1-1v-.5zM8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm7.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            </div>
          </motion.div>

          {/* Floating Atom/Science Icon - Right Side */}
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.15, 1]
            }}
            transition={{ 
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-1/4 -right-16 z-20"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-cyan-500/50 border-4 border-white dark:border-slate-800">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="1" fill="currentColor"/>
                <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
                <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-60 12 12)"/>
                <ellipse cx="12" cy="12" rx="10" ry="4"/>
              </svg>
            </div>
          </motion.div>

          {/* Floating Lightbulb - Left Side */}
          <motion.div
            animate={{ 
              y: [0, -12, 0],
              x: [0, 5, 0]
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute top-1/3 -left-12 z-20"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-purple-500/50 border-4 border-white dark:border-slate-800">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
              </svg>
            </div>
          </motion.div>

          {/* Floating Calculator - Bottom Right */}
          <motion.div
            animate={{ 
              y: [0, 18, 0],
              rotate: [0, -8, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-1/4 -right-10 z-20"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-green-500/50 border-4 border-white dark:border-slate-800">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" />
              </svg>
            </div>
          </motion.div>

          {/* Animated Dots/Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-brand-blue rounded-full"
              style={{
                top: `${20 + i * 15}%`,
                left: i % 2 === 0 ? '-5%' : '105%',
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Text Badges with Animation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute top-1/2 -left-20 glass-dark px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-2 shadow-xl"
          >
            <span className="w-2 h-2 bg-brand-blue rounded-full animate-pulse" />
            Education made easy
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-1/3 -right-24 glass-dark px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-2 shadow-xl"
          >
            <span className="w-2 h-2 bg-brand-yellow rounded-full animate-pulse" />
            Unlocking potentials
          </motion.div>
          
          {/* Decorative Orbs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-blue/30 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-yellow/20 blur-[120px] rounded-full animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
