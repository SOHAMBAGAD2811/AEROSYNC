import type { Metadata } from 'next'
import './globals.css'
import QueryProvider from '@/components/providers/QueryProvider'

export const metadata: Metadata = {
  title: 'AeroSync | Air Power Predictive Maintenance & Fleet Availability',
  description:
    'Operational Decision Support & Condition-Based Maintenance Optimization Platform for Military Aviation MRO (Indian Air Force). C-MAPSS RUL Ladders, CP-SAT Scheduling, and Digital Twin.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=IBM+Plex+Mono:ital,wght@0,100..700;1,100..700&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
