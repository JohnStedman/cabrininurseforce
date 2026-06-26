import { useState, useEffect, useCallback } from 'react';
import { getShifts } from '../data/shiftStore';

export function useSupabase() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState({
    shiftCount: 0,
    staffCount: 0,
    wardCount: 0,
    hasShifts: false,
    hasStaff: false,
    hasWards: false,
  });

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    setIsConfigured(!!url && !!key);

    const shifts = getShifts();
    setDbStatus({
      shiftCount: shifts.length,
      staffCount: 0,
      wardCount: 0,
      hasShifts: shifts.length > 0,
      hasStaff: false,
      hasWards: false,
    });
  }, []);

  const initializeDatabase = useCallback(async () => {
    setIsLoading(true);
    // Simulate initialization
    await new Promise(r => setTimeout(r, 1500));
    setIsInitialized(true);
    setIsLoading(false);
  }, []);

  const refreshStatus = useCallback(() => {
    const shifts = getShifts();
    setDbStatus(prev => ({ ...prev, shiftCount: shifts.length, hasShifts: shifts.length > 0 }));
  }, []);

  return { isConfigured, isInitialized, isLoading, dbStatus, initializeDatabase, refreshStatus };
}
