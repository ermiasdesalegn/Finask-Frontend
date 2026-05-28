import { ArrowRight, BookOpen, Building2, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import finaskLogo from "../../assets/finask-logo.png";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Discover", to: "/discover" },
  { label: "Universities", to: "/universities" },
  { label: "Programs", to: "/programs" },
  { label: "Great Minds", to: "/celebrities" },
  { label: "About", to: "/about" },
  { label: "Favorites", to: "/favorites" },
];

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const SOCIAL_LINKS = [
  { label: "Telegram", href: "https://t.me/finask", Icon: TelegramIcon },
  { label: "Instagram", href: "https://instagram.com/finask", Icon: InstagramIcon },
  { label: "LinkedIn", href: "https://linkedin.com/company/finask", Icon: LinkedInIcon },
  { label: "YouTube", href: "https://youtube.com/@finask", Icon: YouTubeIcon },
];

const Footer = () => {
  const year = new Date().getFullYear();
  const { isAuthenticated, sessionStatus } = useAuth();
  const showGuestCta = sessionStatus === "ready" && !isAuthenticated;

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

          {showGuestCta && (
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
          )}
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
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-600 transition-all hover:border-brand-blue/40 hover:text-brand-blue dark:border-white/10 dark:bg-zinc-800 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  <s.Icon />
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
