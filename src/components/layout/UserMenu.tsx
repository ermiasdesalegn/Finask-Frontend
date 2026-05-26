import { ChevronDown, LogOut, Settings, UserCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  if (!user) return null;

  const initial =
    (user.firstName?.[0] ?? user.email?.[0] ?? "?").toUpperCase();
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email ||
    "Account";

  return (
    <div ref={rootRef} className="relative z-[110] hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "flex max-w-[200px] items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 py-1.5 pl-1.5 pr-3 shadow-sm transition-all hover:border-brand-blue/30 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/90",
          open && "border-brand-blue/40 ring-2 ring-brand-blue/15"
        )}
      >
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt=""
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-sky-400 text-sm font-black text-white">
            {initial}
          </span>
        )}
        <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
          {user.firstName || "Account"}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-slate-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            role="menu"
            className="absolute right-0 top-[calc(100%+10px)] z-[120] w-56 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/95"
          >
            <div className="border-b border-slate-100 px-3 py-2.5 dark:border-white/10">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                {displayName}
              </p>
              {user.email && (
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
              )}
            </div>
            <Link
              to="/me"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-blue dark:text-slate-200 dark:hover:bg-white/5"
            >
              <UserCircle size={18} className="text-slate-400" />
              My content
            </Link>
            <Link
              to="/settings"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-blue dark:text-slate-200 dark:hover:bg-white/5"
            >
              <Settings size={18} className="text-slate-400" />
              Settings
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                void logout();
                navigate("/");
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
            >
              <LogOut size={18} />
              Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
