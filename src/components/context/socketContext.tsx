"use client";

import { RootState } from "@/store/store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

const URL = "http://localhost:5000";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[] | undefined;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const user = useSelector((state: RootState) => state.user.user);
  const admin = useSelector((state: RootState) => state.admin.admin);
  const agent = useSelector((state: RootState) => state.agent.agent);
  const loggedUser = user || admin || agent;

  const getRole = () => {
    if (user) return "user";
    if (admin) return "admin";
    if (agent) return "agent";
    return null;
  };

  useEffect(() => {
    if (loggedUser && !socket) {
      const role = getRole();
      console.log(role)
      const newSocket = io(URL, {
        query: {
          transports: ["websocket"],
          userId: loggedUser._id,
          role
        },
      });
      setSocket(newSocket);
    } else {
      setSocket(null);
    }
    if (!socket) return;
    socket.on("get-online-users", (users) => {
      console.log("users online sare ", users);
      setOnlineUsers(users);
    });

    return () => {
      socket.off("get-online-users");
      socket.disconnect();
    };
  }, [loggedUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
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
