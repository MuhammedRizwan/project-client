"use client";
import { Provider } from "react-redux";
import { store, persistor } from "../Redux-store/store";
import { NextUIProvider } from "@nextui-org/react";
import { PersistGate } from "redux-persist/integration/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NextUIProvider>{children}</NextUIProvider>
      </PersistGate>
    </Provider>
  );
}
