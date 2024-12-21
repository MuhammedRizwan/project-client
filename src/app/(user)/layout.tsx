import Header from "@/components/user/Navbar";
import ProtectedRouter from "@/components/user/protuctedRouter";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Heaven finder user",
  description: "Generated by create next app",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ProtectedRouter>
        <Header />
        {children}
        {/* <Footer /> */}
      </ProtectedRouter>
    </>
  );
}
