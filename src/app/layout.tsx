import {ThemeProvider} from '@/components/theme-provider'
import {Toaster} from '@/components/ui/sonner'
import type {Metadata} from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Next.js Realtime Chat',
  description: 'Next.js Realtime Chat',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange>
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
