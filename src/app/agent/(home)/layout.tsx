import Agentsidebar from "@/components/agent/agentSidebar";
import AgentWrapper from "@/components/wrapper/agentwrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Heaven Finder User",
  description: "Generated by create next app",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AgentWrapper>
      <div className="flex bg-gray-100">
        <Agentsidebar />
        <div className="fleX p-3 w-full">{children}</div>
      </div>
    </AgentWrapper>
  );
}
