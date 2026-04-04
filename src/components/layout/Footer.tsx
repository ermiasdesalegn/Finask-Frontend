import { ArrowRight, BookOpen, Building2, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import finaskLogo from "../../assets/finask-logo.png";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Discover", to: "/discover" },
  { label: "Universities", to: "/universities" },
  { label: "Programs", to: "/programs" },
  { label: "About", to: "/about" },
  { label: "Favorites", to: "/favorites" },
];

const SOCIAL_LINKS = [
  { label: "Telegram", href: "https://t.me/finask", icon: "✈" },
  { label: "Instagram", href: "https://instagram.com/finask", icon: "◎" },
  { label: "LinkedIn", href: "https://linkedin.com/company/finask", icon: "in" },
  { label: "YouTube", href: "https://youtube.com/@finask", icon: "▶" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-slate-200/60 bg-white/60 backdrop-blur-xl dark:border-white/5 dark:bg-zinc-950/80">
      {/* subtle ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-brand-blue/5 blur-[120px] dark:bg-brand-blue/10" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-brand-yellow/5 blur-[120px] dark:bg-brand-yellow/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-8">

        {/* Top row — brand + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center"
        >
          {/* Brand */}
          <div className="max-w-sm">
            <Link to="/" className="mb-5 inline-block">
              <img src={finaskLogo} alt="Finask" className="h-9 w-auto object-contain" />
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Ethiopia's first all-in-one university guide. Empowering students with AI-driven insights to navigate their academic future.
            </p>
            {/* Stats */}
            <div className="mt-6 flex gap-8">
              {[
                { value: "21k+", label: "Students" },
                { value: "50+", label: "Universities" },
                { value: "500+", label: "Programs" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-lg font-black text-slate-900 dark:text-white">{s.value}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/30 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/80 dark:shadow-none">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50 px-3 py-1 text-xs font-bold text-brand-blue dark:border-brand-blue/20 dark:bg-brand-blue/10">
              <Sparkles size={12} className="text-brand-yellow" />
              Start your journey
            </div>
            <h3 className="mb-1 text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Find your perfect university
            </h3>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              Join 21,000+ students already navigating smarter with Finask.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-blue/40 focus:bg-white dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:placeholder:text-slate-500"
              />
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-blue/20 transition-all hover:bg-blue-700 active:scale-95"
              >
                Go <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="mb-12 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-white/10" />

        {/* Links grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 grid grid-cols-2 gap-10 sm:grid-cols-4"
        >
          {/* Navigate */}
          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Navigate
            </p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-blue dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Explore
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "Top Ranked", to: "/universities?sort=rank" },
                { label: "Top Rated", to: "/universities?sort=rating" },
                { label: "Featured", to: "/universities?filter=featured" },
                { label: "By City", to: "/cities" },
                { label: "Rare Programs", to: "/programs?filter=rare" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-blue dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fields */}
          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Fields
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "Engineering", to: "/programs?field=engineeringarchitecture" },
                { label: "Medicine", to: "/programs?field=medicinehealth" },
                { label: "Business", to: "/programs?field=businesseconomics" },
                { label: "Technology", to: "/programs?field=technologyit" },
                { label: "Law", to: "/programs?field=socialscienceslaw" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-blue dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Contact
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                <MapPin size={13} className="shrink-0 text-brand-blue" />
                Addis Ababa, Ethiopia
              </li>
              <li>
                <a
                  href="mailto:info@finask.com"
                  className="flex items-center gap-2.5 text-sm text-slate-500 transition-colors hover:text-brand-blue dark:text-slate-400"
                >
                  <Mail size={13} className="shrink-0 text-brand-blue" />
                  info@finask.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+251911234567"
                  className="flex items-center gap-2.5 text-sm text-slate-500 transition-colors hover:text-brand-blue dark:text-slate-400"
                >
                  <Phone size={13} className="shrink-0 text-brand-blue" />
                  +251 911 234 567
                </a>
              </li>
            </ul>

            {/* Social */}
            <div className="mt-5 flex gap-2">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-xs font-bold text-slate-600 transition-all hover:border-brand-blue/40 hover:text-brand-blue dark:border-white/10 dark:bg-zinc-800 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200/60 pt-8 dark:border-white/5 sm:flex-row">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {year} Finask. Built with{" "}
            <span className="text-brand-yellow">♥</span> for Ethiopian students.
          </p>
          <div className="flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/60 px-4 py-1.5 backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/60">
            <Building2 size={11} className="text-brand-blue" />
            <BookOpen size={11} className="text-brand-yellow" />
            <span className="ml-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Ethiopia&apos;s University Guide
            </span>
          </div>
          <div className="flex gap-4 text-xs text-slate-400 dark:text-slate-500">
            {["Privacy", "Terms", "Sitemap"].map((item) => (
              <a key={item} href="#" className="transition-colors hover:text-brand-blue">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
