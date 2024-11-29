"use client";

import { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';

const ProviderWrapper = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default ProviderWrapper;
