import { mockShifts, type Shift } from './mockData';

const STORAGE_KEY = 'nurseforce_shifts';

function getStoredShifts(): Shift[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return [...mockShifts];
}

function saveShifts(shifts: Shift[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(shifts));
}

export function getShifts(): Shift[] {
  return getStoredShifts();
}

export function addShift(shift: Shift): Shift[] {
  const current = getStoredShifts();
  const updated = [...current, shift];
  saveShifts(updated);
  return updated;
}

export function updateShift(id: string, updates: Partial<Shift>): Shift[] {
  const current = getStoredShifts();
  const updated = current.map(s => s.id === id ? { ...s, ...updates } : s);
  saveShifts(updated);
  return updated;
}

export function deleteShift(id: string): Shift[] {
  const current = getStoredShifts();
  const updated = current.filter(s => s.id !== id);
  saveShifts(updated);
  return updated;
}

// Async variants for Supabase integration
export async function getShiftsAsync(): Promise<Shift[]> {
  return getShifts();
}

export async function addShiftAsync(shift: Shift): Promise<Shift[]> {
  return addShift(shift);
}
