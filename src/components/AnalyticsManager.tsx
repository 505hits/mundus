"use client";

import Script from "next/script";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    dataLayer?: Array<unknown>;
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "mundus-analytics-consent";
const GTM_CONTAINER_ID = "GTM-NMT87VFV";
export type AnalyticsConsent = "granted" | "denied" | null;

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function subscribeAnalyticsConsent(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("mundus-analytics-consent", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("mundus-analytics-consent", callback);
    window.removeEventListener("storage", callback);
  };
}

export function useAnalyticsConsent() {
  return useSyncExternalStore(subscribeAnalyticsConsent, getAnalyticsConsent, () => null);
}

export function setAnalyticsConsent(value: Exclude<AnalyticsConsent, null>) {
  const previous = getAnalyticsConsent();
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    return;
  }
  if (previous === "granted" && value === "denied") {
    // Unloading GTM/Clarity reliably requires a fresh document after consent is withdrawn.
    window.location.reload();
    return;
  }
  window.dispatchEvent(new Event("mundus-analytics-consent"));
}

export function trackEvent(name: string, params: Record<string, string | number | boolean | undefined> = {}) {
  if (typeof window === "undefined" || getAnalyticsConsent() !== "granted") return;
  // GTM custom-event triggers listen to dataLayer objects, not gtag("event", ...).
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
  window.clarity?.("event", name);
}

export default function AnalyticsManager() {
  const pathname = usePathname();
  const consent = useAnalyticsConsent();
  // GTM is the single source of Google tag loading; don't load gtag/js alongside it.
  const gtmId = GTM_CONTAINER_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  const initialPageViewHandled = useRef(false);

  useEffect(() => {
    if (consent !== "granted") {
      initialPageViewHandled.current = false;
      return;
    }
    // GTM's initial container load is the first page view. Emit only client-side navigations.
    if (!initialPageViewHandled.current) {
      initialPageViewHandled.current = true;
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "page_view", page_path: pathname, page_location: window.location.href });
  }, [consent, gtmId, pathname]);

  if (consent !== "granted") return null;
  return <>
    <Script id="mundus-gtm-init" strategy="afterInteractive">{`
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
    `}</Script>
    <Script id="mundus-gtm" src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`} strategy="afterInteractive" />
    {clarityId && <Script id="mundus-clarity" strategy="afterInteractive">{`
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${clarityId}");
    `}</Script>}
  </>;
}
