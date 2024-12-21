"use client";

import { RootState } from "@/store/store";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

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
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const user = useSelector((state: RootState) => state.user.user);
  const admin = useSelector((state: RootState) => state.admin.admin);
  const agent = useSelector((state: RootState) => state.agent.agent);
  const loggedUser = user || admin || agent;

  const getRole = React.useCallback((): string | null => {
    if (user) return "user";
    if (admin) return "admin";
    if (agent) return "agent";
    return null;
  }, [user, admin, agent]);

  useEffect(() => {
    if (loggedUser ) {
      const role = getRole();
      const newSocket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
        query: {
          transports: ["websocket"],
          userId: loggedUser._id,
          role,
        },
      });
      socketRef.current = newSocket;
      newSocket.on("get-online-users", (users) => {
        console.log("users online sare ", users);
        setOnlineUsers(users);
      });

      return () => {
        newSocket.off("get-online-users");
        newSocket.disconnect();
      };
    }
  }, [getRole, loggedUser]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
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
