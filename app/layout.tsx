import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cairo, Manrope } from 'next/font/google'
import './globals.css'

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })

export const metadata: Metadata = {
  title: 'كل يوم أحسن | منتجات ذكية لحياة أسهل',
  description: 'متجر كويتي للمنتجات الذكية المختارة بعناية — Kul Yawm Ahsan.',
  generator: 'v0.app',
  icons: { icon: '/logo.png', apple: '/logo.png' },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0f0f0f',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className="dark bg-background">
      <body className={`${cairo.variable} ${manrope.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
