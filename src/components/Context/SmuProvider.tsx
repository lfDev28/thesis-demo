import React, { useState, useContext, createContext, useEffect } from 'react';
import { useToast, EToastTypes } from './ToastContext';
import axios from 'axios';

type TSmuConnection = {
  children: React.ReactNode;
};

type TContextElements = {
  smu: string;
  handleSetSmuPort: (port: string) => void;
  checkSmuPort: () => boolean;
};

const SmuContext = createContext<TContextElements>({
  smu: '',
  handleSetSmuPort: () => {
    return;
  },
  checkSmuPort: () => {
    return false;
  },
});

export function useSmu(): TContextElements {
  return useContext(SmuContext);
}

export default function SmuConnectionProvider({ children }: TSmuConnection) {
  const { showTypedToast } = useToast();
  const [smuPort, setSmuPort] = React.useState('');

  useEffect(() => {
    // TODO: Add integration to check database if not found in local storage.
    const storedPort = localStorage.getItem('smuPort');

    if (storedPort) {
      setSmuPort(storedPort);
      axios.defaults.headers.common['smuPort'] = storedPort || '';
    }
  }, []);

  const handleSetSmuPort = (port: string) => {
    setSmuPort(port);

    localStorage.setItem('smuPort', port);
    axios.defaults.headers.common['smuPort'] = port;

    if (port) {
      showTypedToast(EToastTypes.SUCCESS, `SMU connected to ${port}`);
    } else {
      showTypedToast(EToastTypes.SUCCESS, `SMU address removed`);
    }
  };

  const checkSmuPort = () => {
    if (!smuPort) {
      showTypedToast(
        EToastTypes.ERROR,
        `SMU address not set, return to dashboard to set address`
      );
      return false;
    }
    return true;
  };

  return (
    <SmuContext.Provider
      value={{ smu: smuPort, handleSetSmuPort, checkSmuPort }}
    >
      {children}
    </SmuContext.Provider>
  );
}
