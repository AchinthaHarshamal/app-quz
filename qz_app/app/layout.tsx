import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyQ",
  description: "MyQ is personal app for Education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
