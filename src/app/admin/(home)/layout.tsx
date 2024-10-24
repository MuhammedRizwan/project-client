import ProtectedRouter from "@/components/admin/ProtectedRouter";
import Sidebar from "@/components/admin/SideBar";
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
    <>
    <ProtectedRouter>
    <div className="flex min-h-screen bg-gray-100"> 
      <Sidebar Name="DASHBOARD" />
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
    </ProtectedRouter>
    </>
  );
}
