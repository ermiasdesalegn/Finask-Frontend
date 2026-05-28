import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutConfirmModal from "../../components/layout/LogoutConfirmModal";
import { useAuth } from "../../context/AuthContext";

type UseLogoutConfirmOptions = {
  redirectTo?: string;
};

export function useLogoutConfirm(options?: UseLogoutConfirmOptions) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const redirectTo = options?.redirectTo ?? "/";

  const requestLogout = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    if (!loading) setOpen(false);
  }, [loading]);

  const handleConfirm = useCallback(async () => {
    setLoading(true);
    try {
      await logout();
      setOpen(false);
      navigate(redirectTo, { replace: true });
    } finally {
      setLoading(false);
    }
  }, [logout, navigate, redirectTo]);

  const LogoutConfirmDialog = (
    <LogoutConfirmModal
      open={open}
      loading={loading}
      onClose={handleClose}
      onConfirm={handleConfirm}
    />
  );

  return { requestLogout, LogoutConfirmDialog };
}

