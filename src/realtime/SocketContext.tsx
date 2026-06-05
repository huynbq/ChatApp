import { type ReactNode, useEffect, useMemo } from "react";
import { io, type Socket } from "socket.io-client";

import { API_ORIGIN } from "@/constants/api";

import { SocketContext } from "./socketContextValue";

export function SocketProvider({
  children,
  token,
}: {
  children: ReactNode;
  token: string | undefined;
}) {
  const socket = useMemo<Socket | null>(() => {
    if (!token) return null;

    return io(API_ORIGIN, {
      auth: { token },
      transports: ["websocket"],
    });
  }, [token]);

  useEffect(() => {
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
