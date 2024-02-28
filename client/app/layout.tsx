import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import SessionProvider from "./providers/SessionProvider";
import ServerNav from "@/components/nav/ServerNav";
import SvgMasks from "@/components/svgs/SvgMasks";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";
import { SocketProvider } from "./providers/SocketProvider";

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
        <SocketProvider userId={data?.user.id}>
          <SessionProvider>
            <div className="flex h-full w-full">
              {data && <ServerNav />}
              <main className="w-full overflow-hidden">{children}</main>
            </div>
          </SessionProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
