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
        <Providers>
          <div className="flex h-full w-full">
            {data && <ServerNav />}
            <main className="w-full overflow-hidden">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
