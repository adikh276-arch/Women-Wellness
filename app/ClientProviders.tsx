"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Suspense } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslation, I18nextProvider } from "react-i18next"
import i18n from "@/i18n/config"
import { useEffect, useState } from "react"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"

const LanguageManager = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { i18n } = useTranslation()

  useEffect(() => {
    if (!pathname || !searchParams) return
    const langInUrl = searchParams.get("lang")
    
    if (langInUrl && langInUrl !== i18n.language) {
      i18n.changeLanguage(langInUrl)
    } else if (i18n.language && langInUrl !== i18n.language) {
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.set("lang", i18n.language)
      router.replace(`${pathname}?${newParams.toString()}`)
    }
  }, [i18n.language, pathname, searchParams, router, i18n])

  return null
}

const NavigationSync = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  // 1. Support deep-linking via ?route=... or ?path=...
  useEffect(() => {
    if (!searchParams) return
    const targetRoute = searchParams.get("route") || searchParams.get("path")
    if (targetRoute && targetRoute !== pathname && targetRoute.startsWith("/")) {
      router.replace(targetRoute)
    }
  }, [searchParams, pathname, router])

  // 2. Post route change events to parent window (iframe) and mobile WebView
  useEffect(() => {
    if (typeof window === "undefined" || !pathname) return

    const messagePayload = {
      action: "routeChange",
      pathname,
      fullPath: `/women_wellness_selfcare${pathname}`,
      url: window.location.href,
    }

    // React Native WebView
    if ((window as any).ReactNativeWebView) {
      (window as any).ReactNativeWebView.postMessage(JSON.stringify(messagePayload))
    }
    // Parent iframe (client-web)
    else if (window.parent && window.parent !== window) {
      window.parent.postMessage(messagePayload, "*")
    }
  }, [pathname])

  return null
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Suspense fallback={null}>
            <LanguageManager />
            <NavigationSync />
          </Suspense>
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </I18nextProvider>
  )
}
