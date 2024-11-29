"use client";

import { useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext) {
    throw new Error('AuthContext not found');
  }

  const { user, loading, logout } = authContext;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, router, user]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
