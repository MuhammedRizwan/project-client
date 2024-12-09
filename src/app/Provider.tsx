"use client";
import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
import { NextUIProvider } from "@nextui-org/react";
import { PersistGate } from "redux-persist/integration/react";
import { SocketProvider } from "@/components/context/socketContext";


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NextUIProvider>
          <SocketProvider>{children}</SocketProvider>
        </NextUIProvider>
      </PersistGate>
    </Provider>
  );
}
