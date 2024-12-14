'use client'
import WalletPage from "@/components/wallet/wallet";
import { fetch_agent_wallet } from "@/config/agent/walletservice";
import Wallet from "@/interfaces/wallet";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AgentWallet() {
  const agent = useSelector((state: RootState) => state.agent.agent);
  const [wallet, setWallet] = useState<Wallet|null>(null); 
  useEffect(()=>{
    const fetchData=async()=>{
        const response=await fetch_agent_wallet(agent?._id)
        if(response.success){
          setWallet(response.wallet)
        }
    }
    fetchData()
  },[agent?._id])
  return <WalletPage wallet={wallet}   />;
}
