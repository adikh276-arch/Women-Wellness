"use client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function exitApp() {
  // React Native WebView
  if (typeof window !== "undefined") {
    if ((window as any).ReactNativeWebView) {
      (window as any).ReactNativeWebView.postMessage(JSON.stringify({ action: 'exit' }));
    }
    // iframe inside client-web
    else if (window.parent !== window) {
      window.parent.postMessage({ action: 'exit' }, 'https://web.mantracare.com');
    }
    // standalone browser
    else {
      window.location.href = 'https://web.mantracare.com';
    }
  }
}
