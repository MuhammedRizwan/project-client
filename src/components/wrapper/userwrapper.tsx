'use client';
import { ReactNode } from "react";
import useUserLoggedIn from "@/hooks/useUserLoggedIn"; 

export default function UserWrapper({ children }: { children: ReactNode }) {
  useUserLoggedIn(); 

  return <>{children}</>; 
}