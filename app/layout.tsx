import { RootProvider } from 'fumadocs-ui/provider/next'
import './globals.css'

import type { ReactNode } from 'react'

export const metadata = {
  title: {
    default: 'AI Prompts for Coding',
    template: '%s – AI Prompts',
  },
  description:
    'A curated collection of reusable AI coding prompts optimized for opencode and Claude.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
