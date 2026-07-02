'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { makeStore, type AppStore } from '@/store';
import { bootstrapAuth } from '@/store/authSlice';
import ToastHost from '@/components/ui/ToastHost';

function AuthBootstrap({ children }: { children: ReactNode }) {
  const startedRef = useRef(false);
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (!startedRef.current && storeRef.current) {
      startedRef.current = true;
      storeRef.current.dispatch(bootstrapAuth());
    }
  }, []);

  return (
    <Provider store={storeRef.current}>
      {children}
      <ToastHost />
    </Provider>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  return <AuthBootstrap>{children}</AuthBootstrap>;
}
