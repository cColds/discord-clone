import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import Providers from "./providers/Providers";
import ServerNav from "@/components/nav/ServerNav";

const ggSans = localFont({
  src: "../public/fonts/gg-sans.woff2",
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
      <body className={ggSans.className}>
        <Providers>
          <div className="flex h-full w-full">
            <ServerNav />
            <main className="w-full">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
