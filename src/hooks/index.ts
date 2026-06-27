// ============================================================
// InterNexa — Custom React Hooks
// ============================================================

"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── useLocalStorage ────────────────────────────────────────
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
}

// ─── useTheme ───────────────────────────────────────────────
export function useTheme() {
  const [theme, setThemeState] = useState<"dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = window.document.documentElement;
    root.classList.add("dark");
    root.classList.remove("light");
    try {
      window.localStorage.setItem("internexa-theme", JSON.stringify("dark"));
    } catch(e) {}
  }, []);

  const setTheme = useCallback((newTheme: "dark") => {
    // Disabled as per user request to force dark mode globally
  }, []);

  const toggleTheme = useCallback(() => {
    // Disabled toggle as per user request to force dark mode globally
  }, []);

  return { theme: "dark", setTheme, toggleTheme, isDark: true, mounted };
}

// ─── useDebounce ────────────────────────────────────────────
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// ─── useMediaQuery ──────────────────────────────────────────
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

// ─── useIsMobile ────────────────────────────────────────────
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}

// ─── useScrollPosition ─────────────────────────────────────
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      setIsScrolled(position > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrollPosition, isScrolled };
}

// ─── useCountUp ─────────────────────────────────────────────
export function useCountUp(
  end: number,
  duration: number = 2000,
  start: number = 0,
  enabled: boolean = true
) {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;

      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      countRef.current = Math.floor(start + (end - start) * eased);
      setCount(countRef.current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      startTimeRef.current = null;
    };
  }, [end, duration, start, enabled]);

  return count;
}

// ─── useClickOutside ────────────────────────────────────────
export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// ─── useKeyPress ────────────────────────────────────────────
export function useKeyPress(targetKey: string, handler: () => void) {
  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        handler();
      }
    };

    window.addEventListener("keydown", downHandler);
    return () => window.removeEventListener("keydown", downHandler);
  }, [targetKey, handler]);
}

// ─── useAsync ───────────────────────────────────────────────
interface AsyncState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useAsync<T>(
  asyncFn: () => Promise<{ success: boolean; data?: T; error?: string }>,
  immediate: boolean = true
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    loading: immediate,
  });

  const execute = useCallback(async () => {
    setState({ data: null, error: null, loading: true });
    try {
      const result = await asyncFn();
      if (result.success) {
        setState({ data: result.data || null, error: null, loading: false });
      } else {
        setState({ data: null, error: result.error || "Unknown error", loading: false });
      }
    } catch (error) {
      setState({
        data: null,
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  }, [asyncFn]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, execute, refetch: execute };
}

// ─── useToast ───────────────────────────────────────────────
interface Toast {
  id: string;
  title: string;
  message?: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2);
      setToasts((prev) => [...prev, { ...toast, id }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.duration || 5000);

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

// ─── usePagination ──────────────────────────────────────────
export function usePagination(totalItems: number, itemsPerPage: number = 12) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    startIndex: (currentPage - 1) * itemsPerPage,
    endIndex: Math.min(currentPage * itemsPerPage, totalItems),
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}
