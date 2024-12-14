"use client";
import WalletPage from "@/components/wallet/wallet";
import { fetch_admin_wallet } from "@/config/admin/walletservice";
import Wallet from "@/interfaces/wallet";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AdminWallet() {
  const admin = useSelector((state: RootState) => state.admin.admin);
  console.log(admin);
  const [wallet, setWallet] = useState<Wallet|null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch_admin_wallet(admin?._id);
      if (response.success) {
        setWallet(response.wallet);
      }
    };
    fetchData();
  },[admin?._id]);
  return <WalletPage wallet={wallet}  />;
}
