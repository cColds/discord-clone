import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import SessionProvider from "./providers/SessionProvider";
import ServerNav from "@/components/nav/ServerNav";
import SvgMasks from "@/components/svgs/SvgMasks";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";
import { SocketProvider } from "./providers/SocketProvider";
import { UserProvider } from "./providers/UserProvider";
import { getUser } from "@/lib/db/getUser";

const ggSans = localFont({
  src: [
    {
      path: "../public/fonts/gg-sans.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/gg-sans-semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/gg-sans-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/gg-sans-extrabold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
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

  const user = await getUser(data?.user.id);

  return (
    <html lang="en">
      <body className={ggSans.className}>
        <SvgMasks />
        <UserProvider userProp={user}>
          <SocketProvider userId={data?.user.id}>
            <SessionProvider>
              <div className="flex h-full w-full scroller">
                {data && <ServerNav />}
                <main className="w-full overflow-hidden">{children}</main>
              </div>
            </SessionProvider>
          </SocketProvider>
        </UserProvider>
      </body>
    </html>
  );
}
