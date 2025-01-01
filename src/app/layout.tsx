import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Provider";
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
              {children}
        </Providers>
      </body>
    </html>
  );
}
