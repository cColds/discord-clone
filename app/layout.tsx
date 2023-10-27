import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const ggsans = localFont({
  src: "../public/fonts/ggsans.woff2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Discord Clone",
  description: "Built with next",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={ggsans.className}>{children}</body>
    </html>
  );
}
