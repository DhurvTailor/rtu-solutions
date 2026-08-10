"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

type LoadingContextValue = { loading: boolean };

const LoadingContext = createContext<LoadingContextValue>({ loading: false });

export function useRouteLoading() {
  return useContext(LoadingContext);
}

export default function RouteLoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  // Naya pathname aate hi loader band kar do
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setLoading(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [pathname]);

  // Har internal <a> click par loader on kar do
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      if (href.startsWith("#")) return;
      if (anchor.target === "_blank") return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // new-tab shortcuts

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      // Sirf same-origin internal links par loader dikhao
      if (url.origin !== window.location.origin) return;
      if (url.pathname === pathname) return; // same page pe hi hai

      setLoading(true);

      // Safety fallback — agar kisi wajah se navigation fail/slow ho,
      // to loader hamesha ke liye atka na rahe
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setLoading(false), 4000);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ loading }}>
      {loading && <RouteLoaderOverlay />}
      {children}
    </LoadingContext.Provider>
  );
}

// ── Same design jo already tumhare app/loading.jsx mein hai ──
function RouteLoaderOverlay() {
  return (
    <>
      <style>{`
        .rtu-loader-wrap {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          background: #fff;
          z-index: 9999;
        }

        .loader {
          position: relative;
          width: 4em;
          height: 4em;
          font-size: 16px;
          transform: rotate(165deg);
        }

        .loader::before,
        .loader::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          display: block;
          width: 0.8em;
          height: 0.8em;
          border-radius: 0.4em;
          transform: translate(-50%, -50%);
        }

        .loader::before { animation: loaderBefore 2s infinite; }
        .loader::after  { animation: loaderAfter  2s infinite; }

        @keyframes loaderBefore {
          0% {
            width: 0.8em;
            box-shadow:
               1.6em  -0.8em hsla(337, 84%, 48%, 0.75),
              -1.6em   0.8em hsla(190, 61%, 65%, 0.75);
          }
          35% {
            width: 4em;
            box-shadow:
               0      -0.8em hsla(337, 84%, 48%, 0.75),
               0       0.8em hsla(190, 61%, 65%, 0.75);
          }
          70% {
            width: 0.8em;
            box-shadow:
              -1.6em  -0.8em hsla(337, 84%, 48%, 0.75),
               1.6em   0.8em hsla(190, 61%, 65%, 0.75);
          }
          100% {
            box-shadow:
               1.6em  -0.8em hsla(337, 84%, 48%, 0.75),
              -1.6em   0.8em hsla(190, 61%, 65%, 0.75);
          }
        }

        @keyframes loaderAfter {
          0% {
            height: 0.8em;
            box-shadow:
               0.8em   1.6em hsla(160, 50%, 48%, 0.75),
              -0.8em  -1.6em hsla( 41, 82%, 52%, 0.75);
          }
          35% {
            height: 4em;
            box-shadow:
               0.8em   0     hsla(160, 50%, 48%, 0.75),
              -0.8em   0     hsla( 41, 82%, 52%, 0.75);
          }
          70% {
            height: 0.8em;
            box-shadow:
               0.8em  -1.6em hsla(160, 50%, 48%, 0.75),
              -0.8em   1.6em hsla( 41, 82%, 52%, 0.75);
          }
          100% {
            box-shadow:
               0.8em   1.6em hsla(160, 50%, 48%, 0.75),
              -0.8em  -1.6em hsla( 41, 82%, 52%, 0.75);
          }
        }

        .rtu-brand {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #071A3D;
          animation: rtuFade 2s ease-in-out infinite alternate;
        }

        .rtu-brand span {
          color: #E8700A;
        }

        @keyframes rtuFade {
          from { opacity: 0.35; }
          to   { opacity: 1;    }
        }
      `}</style>

      <div className="rtu-loader-wrap">
        <div className="loader" />
        <p className="rtu-brand">RTU <span>Solutions</span></p>
      </div>
    </>
  );
}