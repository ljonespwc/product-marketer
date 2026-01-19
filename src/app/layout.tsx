import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "PMM",
  description: "PMM Application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>{children}</body>
    </html>
  )
}
