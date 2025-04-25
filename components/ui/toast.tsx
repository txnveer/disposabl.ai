"use client"

import * as React from "react"
import { forwardRef } from "react"

import { cn } from "@/lib/utils"

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(React.Fragment, null, children)
}

const ToastViewport = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-[368px]",
          className,
        )}
        {...props}
      />
    )
  },
)
ToastViewport.displayName = "ToastViewport"

const Toast = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "group relative flex w-full items-center overflow-hidden rounded-md border border-border bg-card px-4 py-2 [&[data-state=open]]:animate-in [&[data-state=closed]]:animate-out [&[data-state=closed]]:fade-out-80 [&[data-state=closed]]:zoom-out-95 [&:has([data-radix-toast-title])]:pr-8",
        className,
      )}
      {...props}
    />
  )
})
Toast.displayName = "Toast"

const ToastTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return <h3 ref={ref} className={cn("text-sm font-semibold [&:has+div]:mb-1", className)} {...props} />
  },
)
ToastTitle.displayName = "ToastTitle"

const ToastDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("text-sm opacity-70", className)} {...props} />
  },
)
ToastDescription.displayName = "ToastDescription"

const ToastClose = forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "absolute right-1 top-1 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:shadow-none focus:outline-none",
          className,
        )}
        {...props}
      />
    )
  },
)
ToastClose.displayName = "ToastClose"

const ToastAction = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "inline-flex h-8 items-center rounded-md bg-secondary px-3 text-sm font-medium transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
          className,
        )}
        {...props}
      />
    )
  },
)
ToastAction.displayName = "ToastAction"

type ToastActionElement = React.ReactElement<React.AnchorHTMLAttributes<HTMLAnchorElement>, typeof ToastAction>

type ToastProps = React.HTMLAttributes<HTMLDivElement>

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  type ToastActionElement,
  type ToastProps,
}
