"use client";

import { Provider } from "react-redux";
import { store, persistor } from "../../redux/store";
import { PersistGate } from 'redux-persist/integration/react';
import Loader from "@/components/loader/Loader";
import { useEffect, useState } from "react";

// This component ensures we don't try to access localStorage during SSR
function SafePersistGate({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loader />;
  }

  return (
    <PersistGate loading={<Loader />} persistor={persistor}>
      {children}
    </PersistGate>
  );
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SafePersistGate>
        {children}
      </SafePersistGate>
    </Provider>
  );
}
