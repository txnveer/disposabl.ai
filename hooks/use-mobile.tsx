"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent
      const mobile = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i))
      setIsMobile(mobile)
    }

    // Check screen size
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640)
      setOrientation(window.innerHeight > window.innerWidth ? "portrait" : "landscape")
    }

    checkMobile()
    checkScreenSize()

    window.addEventListener("resize", checkScreenSize)
    window.addEventListener("orientationchange", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
      window.removeEventListener("orientationchange", checkScreenSize)
    }
  }, [])

  return { isMobile, isSmallScreen, orientation }
}
