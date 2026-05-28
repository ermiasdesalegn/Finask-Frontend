import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import LoginModal from "../components/layout/LoginModal";

export type LoginModalMode = "signin" | "signup";

type LoginModalContextValue = {
  openLogin: () => void;
  openSignUp: () => void;
  closeLogin: () => void;
};

const LoginModalContext = createContext<LoginModalContextValue | null>(null);

export function LoginModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<LoginModalMode>("signin");

  const openLogin = useCallback(() => {
    setInitialMode("signin");
    setOpen(true);
  }, []);

  const openSignUp = useCallback(() => {
    setInitialMode("signup");
    setOpen(true);
  }, []);

  const closeLogin = useCallback(() => setOpen(false), []);

  return (
    <LoginModalContext.Provider value={{ openLogin, openSignUp, closeLogin }}>
      {children}
      <LoginModal
        open={open}
        initialMode={initialMode}
        onClose={closeLogin}
      />
    </LoginModalContext.Provider>
  );
}

export function useLoginModal(): LoginModalContextValue {
  const ctx = useContext(LoginModalContext);
  if (!ctx) {
    return {
      openLogin: () => {},
      openSignUp: () => {},
      closeLogin: () => {},
    };
  }
  return ctx;
}
