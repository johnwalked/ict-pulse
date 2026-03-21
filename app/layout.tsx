import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ICT Pulse - Institutional Trading Dashboard',
  description: 'AI-powered trading platform implementing ICT methodology by Michael Huddleston',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
