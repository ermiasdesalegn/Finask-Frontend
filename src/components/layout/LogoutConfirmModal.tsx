import { LogOut } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";

type LogoutConfirmModalProps = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export default function LogoutConfirmModal({
  open,
  loading = false,
  onClose,
  onConfirm,
}: LogoutConfirmModalProps) {
  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Cancel logout"
            disabled={loading}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirm-title"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/40">
              <LogOut size={22} className="text-rose-600 dark:text-rose-400" />
            </div>
            <h2
              id="logout-confirm-title"
              className="mb-2 text-xl font-black text-slate-900 dark:text-white"
            >
              Log out?
            </h2>
            <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
              You will need to sign in again to access your favorites, account,
              and personalized recommendations.
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={loading}
                onClick={onClose}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => void onConfirm()}
                className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
              >
                {loading ? "Logging out…" : "Log out"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return modal;
  return createPortal(modal, document.body);
}
