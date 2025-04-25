"use client"

import { useToast } from "@/hooks/use-toast"
import { Toast, ToastProvider as ShadcnToastProvider, ToastViewport } from "@/components/ui/toast"

export function ToastProvider() {
  const { toasts, dismiss } = useToast()

  return (
    <ShadcnToastProvider>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onDismiss={dismiss}
        />
      ))}
      <ToastViewport />
    </ShadcnToastProvider>
  )
}
