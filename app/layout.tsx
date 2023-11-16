import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import Providers from "./providers/Providers";
import ServerNav from "@/components/nav/ServerNav";
import SvgMasks from "@/components/svgs/SvgMasks";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";

const ggSans = localFont({
  src: "../public/fonts/gg-sans.woff2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Discord Clone",
  description: "Built with next",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getServerSession(authConfig);

  return (
    <html lang="en">
      <body className={ggSans.className}>
        <SvgMasks />
        {data ? (
          <Providers>
            <div className="flex h-full w-full">
              <ServerNav />
              <main className="w-full">{children}</main>
            </div>
          </Providers>
        ) : (
          <div className="flex h-full w-full">
            <main className="w-full">{children}</main>
          </div>
        )}
      </body>
    </html>
  );
}
