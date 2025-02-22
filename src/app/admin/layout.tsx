import AdminNavbar from "@/components/admin/AdminNavbar";
import ProtectedRouter from "@/components/admin/ProtectedRouter";
import AdminWrapper from "@/components/wrapper/adminwrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Heaven finder",
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
        <AdminWrapper>
          <AdminNavbar />
          {children}
        </AdminWrapper>
      </ProtectedRouter>
    </>
  );
}
