import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notice, Complaint, Visitor, ComplaintStatus } from '../types';

// ================================================================
// Horizon Society Connect — Mock API Service (Repository Pattern)
// Simulates a real API with 1-second network latency using setTimeout
// ================================================================

/** Wraps a value in a Promise with simulated network delay */
const simulate = <T>(value: T, delay = 1000): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(value), delay));

// ----------------------------------------------------------------
// Storage Keys
// ----------------------------------------------------------------
const KEYS = {
  NOTICES: '@horizon:notices',
  COMPLAINTS: '@horizon:complaints',
  VISITORS: '@horizon:visitors',
} as const;

// ----------------------------------------------------------------
// Seed data — seeded on first load
// ----------------------------------------------------------------
const SEED_NOTICES: Notice[] = [
  {
    id: 'ntc_001',
    title: 'Annual Maintenance Day',
    content:
      'Scheduled plumbing maintenance across all units on September 15th, 9 AM–1 PM. Please ensure water access is available.',
    date: '2026-09-10T08:00:00Z',
    category: 'MAINTENANCE',
    priority: 'HIGH',
  },
  {
    id: 'ntc_002',
    title: 'Community BBQ — Weekend Fun',
    content:
      'Join us at the rooftop terrace on September 14th for our monthly community BBQ. Families welcome!',
    date: '2026-09-09T10:00:00Z',
    category: 'EVENT',
    priority: 'LOW',
  },
  {
    id: 'ntc_003',
    title: 'Parking Policy Update',
    content:
      'Effective October 1st, all visitor vehicles must be registered at the gate. Unregistered vehicles will be towed.',
    date: '2026-09-08T14:00:00Z',
    category: 'GENERAL',
    priority: 'HIGH',
  },
];

const SEED_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp_001',
    userId: 'usr_res_001',
    title: 'Lift Out of Order',
    description: 'The main lobby lift has been malfunctioning since Tuesday.',
    status: 'PENDING',
    createdAt: '2026-09-08T09:00:00Z',
  },
  {
    id: 'cmp_002',
    userId: 'usr_admin_001',
    title: 'Common Area Lighting',
    description: 'Corridor lights on the 3rd floor need replacement.',
    status: 'RESOLVED',
    createdAt: '2026-09-07T11:00:00Z',
  },
];

const SEED_VISITORS: Visitor[] = [];

// ----------------------------------------------------------------
// Helpers — AsyncStorage read / write with seed fallback
// ----------------------------------------------------------------
async function readFromStorage<T>(key: string, seed: T[]): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  if (raw) return JSON.parse(raw) as T[];
  await AsyncStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

async function writeToStorage<T>(key: string, data: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

// ================================================================
// API Service — Public Interface
// ================================================================

// ---- Notices ----
export const fetchNotices = (): Promise<Notice[]> =>
  readFromStorage<Notice>(KEYS.NOTICES, SEED_NOTICES).then(data =>
    simulate(data)
  );

export const createNotice = async (
  payload: Omit<Notice, 'id' | 'date'>
): Promise<Notice> => {
  const notices = await readFromStorage<Notice>(KEYS.NOTICES, SEED_NOTICES);
  const newNotice: Notice = {
    ...payload,
    id: `ntc_${Date.now()}`,
    date: new Date().toISOString(),
  };
  notices.unshift(newNotice);
  await writeToStorage(KEYS.NOTICES, notices);
  return simulate(newNotice);
};

// ---- Complaints ----
export const fetchComplaints = (): Promise<Complaint[]> =>
  readFromStorage<Complaint>(KEYS.COMPLAINTS, SEED_COMPLAINTS).then(data =>
    simulate(data)
  );

export const fetchComplaintsByUser = async (userId: string): Promise<Complaint[]> => {
  const all = await readFromStorage<Complaint>(KEYS.COMPLAINTS, SEED_COMPLAINTS);
  const filtered = all.filter(c => c.userId === userId);
  return simulate(filtered);
};

export const createComplaint = async (
  payload: Omit<Complaint, 'id' | 'createdAt' | 'status'>
): Promise<Complaint> => {
  const complaints = await readFromStorage<Complaint>(
    KEYS.COMPLAINTS,
    SEED_COMPLAINTS
  );
  const newComplaint: Complaint = {
    ...payload,
    id: `cmp_${Date.now()}`,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
  complaints.unshift(newComplaint);
  await writeToStorage(KEYS.COMPLAINTS, complaints);
  return simulate(newComplaint);
};

export const updateComplaintStatus = async (
  complaintId: string,
  status: ComplaintStatus
): Promise<Complaint> => {
  const complaints = await readFromStorage<Complaint>(
    KEYS.COMPLAINTS,
    SEED_COMPLAINTS
  );
  const index = complaints.findIndex(c => c.id === complaintId);
  if (index === -1) {
    throw new Error('Complaint not found');
  }
  complaints[index] = { ...complaints[index], status };
  await writeToStorage(KEYS.COMPLAINTS, complaints);
  return simulate(complaints[index]);
};

export const deleteComplaint = async (complaintId: string): Promise<void> => {
  const complaints = await readFromStorage<Complaint>(
    KEYS.COMPLAINTS,
    SEED_COMPLAINTS
  );
  const filtered = complaints.filter(c => c.id !== complaintId);
  await writeToStorage(KEYS.COMPLAINTS, filtered);
  return simulate(undefined);
};

// ---- Visitors ----
export const fetchVisitors = (userId: string): Promise<Visitor[]> =>
  readFromStorage<Visitor>(KEYS.VISITORS, SEED_VISITORS).then(data =>
    simulate(data.filter(v => (v as any).userId === userId))
  );

export const createVisitor = async (
  userId: string,
  name: string,
  expectedDate: string
): Promise<Visitor> => {
  const visitors = (await AsyncStorage.getItem(KEYS.VISITORS))
    ? JSON.parse((await AsyncStorage.getItem(KEYS.VISITORS))!)
    : [];
  const newVisitor: Visitor & { userId: string } = {
    id: `vis_${Date.now()}`,
    userId,
    name,
    expectedDate,
    code: String(Math.floor(1000 + Math.random() * 9000)), // 4-digit
    status: 'EXPECTED',
  };
  visitors.unshift(newVisitor);
  await writeToStorage(KEYS.VISITORS, visitors);
  return simulate(newVisitor);
};
