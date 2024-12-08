"use client";

import { RootState } from "@/store/store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

const URL = "http://localhost:5000";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
    const [socket,setSocket]=useState<Socket|null>(null)
  const user = useSelector((state: RootState) => state.user.user);
  const admin = useSelector((state: RootState) => state.admin.admin);
  const agent = useSelector((state: RootState) => state.agent.agent);
  const loggedUser=user || admin||agent

  useEffect(() => {
    if (!socket && typeof window !== "undefined" ) {
      const newSocket=io(URL, {
        transports: ["websocket"],
        query: {
            userId: loggedUser?._id
          }
      });
      setSocket(newSocket)
    }
    return () => {
      socket?.disconnect();
    };
  }, [loggedUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
