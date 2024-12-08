import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Heaven finder",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
            <Toaster position="bottom-center" />
            <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
              {children}
            </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
