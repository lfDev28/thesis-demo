import React, { useState, useContext, createContext, useEffect } from 'react';
import { useToast, EToastTypes } from './ToastContext';
import axios from 'axios';

type TMcuConnection = {
  children: React.ReactNode;
};

type TContextElements = {
  mcu: string;
  handleSetMcuPort: (port: string) => void;
  checkMcuPort: () => boolean;
};

const McuContext = createContext<TContextElements>({
  mcu: '',
  handleSetMcuPort: () => {
    return;
  },
  checkMcuPort: () => {
    return false;
  },
});

export function useMcu(): TContextElements {
  return useContext(McuContext);
}

export default function McuConnectionProvider({ children }: TMcuConnection) {
  const { showTypedToast } = useToast();
  const [mcuPort, setMcuPort] = React.useState('');

  useEffect(() => {
    // TODO: Add integration to check database if not found in local storage.
    const storedPort = localStorage.getItem('mcuPort');

    if (storedPort) {
      setMcuPort(storedPort);
      axios.defaults.headers.common['mcuPort'] = storedPort || '';
    }
  }, []);

  const handleSetMcuPort = (port: string) => {
    setMcuPort(port);

    localStorage.setItem('mcuPort', port);
    axios.defaults.headers.common['smuPort'] = port;

    if (port) {
      showTypedToast(EToastTypes.SUCCESS, `Mcu connected to ${port}`);
    } else {
      showTypedToast(EToastTypes.SUCCESS, `Mcu address removed`);
    }
  };

  const checkMcuPort = () => {
    if (!mcuPort) {
      showTypedToast(
        EToastTypes.ERROR,
        `Mcu address not set, return to dashboard to set address`
      );
      return false;
    }
    return true;
  };

  return (
    <McuContext.Provider
      value={{ mcu: mcuPort, handleSetMcuPort, checkMcuPort }}
    >
      {children}
    </McuContext.Provider>
  );
}
