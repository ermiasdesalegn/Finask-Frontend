import { ArrowRight, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Sparkles, Twitter, Youtube } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import finaskLogo from "../../assets/finask-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const linkClass =
    "text-slate-400 hover:text-white transition-colors inline-flex items-center group";
  const lineSpan = (
    <span className="w-0 group-hover:w-2 h-0.5 bg-brand-blue transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
  );

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Ambient glow blobs — mirrors Hero */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-brand-yellow/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-blue/5 rounded-full blur-[100px]" />
      </div>

      {/* Animated top border */}
      <div className="relative h-px w-full overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-blue to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative z-10 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-brand-blue rounded-full text-sm font-bold mb-4 border border-blue-500/20"
            >
              <span className="w-2 h-2 bg-brand-blue rounded-full animate-pulse" />
              <Sparkles size={14} />
              Your academic journey starts here
            </motion.div>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-white leading-tight">
              Ready to find your <span className="text-brand-blue">perfect</span> university?
            </h2>
            <p className="text-slate-400 mt-2 max-w-md">
              Join 21,000+ Ethiopian students already navigating smarter with Finask.
            </p>
          </div>

          {/* Newsletter strip */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue/60 focus:bg-white/10 transition-all w-full sm:w-72"
            />
            <button className="px-6 py-3.5 bg-brand-blue text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap">
              Get Started <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Footer Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12"
        >
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-6">
              <img src={finaskLogo} alt="Finask Logo" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-slate-400 mb-6 leading-relaxed max-w-sm text-sm">
              Empowering Ethiopian students with AI-driven insights to navigate their academic future with confidence. Your trusted guide to higher education.
            </p>

            {/* Stats row */}
            <div className="flex gap-6 mb-6">
              {[
                { value: "21k+", label: "Students" },
                { value: "50+", label: "Universities" },
                { value: "500+", label: "Programs" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-black text-white text-lg leading-none">{stat.value}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: <Facebook size={16} />, href: "https://facebook.com", label: "Facebook" },
                { icon: <Twitter size={16} />, href: "https://twitter.com", label: "Twitter" },
                { icon: <Instagram size={16} />, href: "https://instagram.com", label: "Instagram" },
                { icon: <Linkedin size={16} />, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: <Youtube size={16} />, href: "https://youtube.com", label: "YouTube" },
              ].map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  whileHover={{ y: -4, scale: 1.1 }}
                  className="w-10 h-10 bg-white/5 hover:bg-brand-blue border border-white/10 hover:border-brand-blue rounded-xl flex items-center justify-center transition-colors duration-300 hover:shadow-lg hover:shadow-brand-blue/40"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h4 className="font-black text-sm uppercase tracking-widest mb-6 text-white/60">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: "Universities", to: "/universities" },
                { label: "Programs", to: "/programs" },
                { label: "Scholarships", to: "#" },
                { label: "Admissions", to: "#" },
                { label: "Rankings", to: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className={linkClass}>
                    {lineSpan}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h4 className="font-black text-sm uppercase tracking-widest mb-6 text-white/60">Resources</h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", to: "/about" },
                { label: "Blog", to: "#" },
                { label: "Career Guide", to: "#" },
                { label: "FAQs", to: "#" },
                { label: "Help Center", to: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className={linkClass}>
                    {lineSpan}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h4 className="font-black text-sm uppercase tracking-widest mb-6 text-white/60">Legal</h4>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Disclaimer"].map((item) => (
                <li key={item}>
                  <a href="#" className={linkClass}>
                    {lineSpan}
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h4 className="font-black text-sm uppercase tracking-widest mb-6 text-white/60">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400">
                <div className="w-8 h-8 bg-brand-blue/10 border border-brand-blue/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={14} className="text-brand-blue" />
                </div>
                <span className="text-sm leading-relaxed">Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <div className="w-8 h-8 bg-brand-blue/10 border border-brand-blue/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={14} className="text-brand-blue" />
                </div>
                <a href="mailto:info@finask.com" className="text-sm hover:text-white transition-colors">
                  info@finask.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <div className="w-8 h-8 bg-brand-blue/10 border border-brand-blue/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={14} className="text-brand-blue" />
                </div>
                <a href="tel:+251911234567" className="text-sm hover:text-white transition-colors">
                  +251 911 234 567
                </a>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="relative pt-8">
          {/* Gradient divider */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              © {currentYear} Finask. All rights reserved. Built with{" "}
              <span className="text-brand-yellow">♥</span> for Ethiopian students.
            </p>
            <div className="flex items-center gap-6 text-sm">
              {["Sitemap", "Accessibility", "Status"].map((item) => (
                <a key={item} href="#" className="text-slate-500 hover:text-white transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
