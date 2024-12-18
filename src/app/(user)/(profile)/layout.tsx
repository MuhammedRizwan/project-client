import Sidebar from "@/components/profile/Sidebar";
import UserWrapper from "@/components/wrapper/userwrapper";

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
      <UserWrapper>
        <Sidebar>{children}</Sidebar>
      </UserWrapper>
    </>
  );
}
