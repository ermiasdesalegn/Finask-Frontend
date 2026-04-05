import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getCompareQueue,
  getCompareQueueAfterNavigation,
  MAX_COMPARE_UNIVERSITIES,
  setCompareQueue as persistCompareQueue,
} from "../lib/compareQueue";

export type CompareAddResult = "ok" | "duplicate" | "max";

type CompareContextValue = {
  ids: string[];
  add: (id: string) => CompareAddResult;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  clear: () => void;
  contains: (id: string) => boolean;
};

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => getCompareQueueAfterNavigation());

  const sync = useCallback((next: string[]) => {
    persistCompareQueue(next);
    setIds(next);
  }, []);

  const add = useCallback(
    (id: string): CompareAddResult => {
      const cur = getCompareQueue();
      if (!id) return "duplicate";
      if (cur.includes(id)) return "duplicate";
      if (cur.length >= MAX_COMPARE_UNIVERSITIES) return "max";
      sync([...cur, id]);
      return "ok";
    },
    [sync]
  );

  const remove = useCallback(
    (id: string) => {
      sync(getCompareQueue().filter((x) => x !== id));
    },
    [sync]
  );

  const toggle = useCallback(
    (id: string) => {
      const cur = getCompareQueue();
      if (cur.includes(id)) {
        sync(cur.filter((x) => x !== id));
        return;
      }
      if (cur.length >= MAX_COMPARE_UNIVERSITIES) return;
      sync([...cur, id]);
    },
    [sync]
  );

  const clear = useCallback(() => {
    sync([]);
  }, [sync]);

  const contains = useCallback((id: string) => ids.includes(id), [ids]);

  const value = useMemo(
    () => ({ ids, add, remove, toggle, clear, contains }),
    [ids, add, remove, toggle, clear, contains]
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompare must be used within CompareProvider");
  }
  return ctx;
}
