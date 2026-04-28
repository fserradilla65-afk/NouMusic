/// <reference types="vite/client" />

declare global {
  interface Window {
    noumusicDeeplink: (link: string) => void
  }
}

export {}
