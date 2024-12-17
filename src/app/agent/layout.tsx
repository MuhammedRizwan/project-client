import AgentNavbar from "@/components/agent/AgentNavbar";
import ProtectedRouter from "@/components/agent/ProtectedRouter";

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
      
        <AgentNavbar />
        {children}
      </ProtectedRouter>
    </>
  );
}
