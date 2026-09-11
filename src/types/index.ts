// ============================================================
// Horizon Society Connect — Domain Models (TypeScript Interfaces)
// ============================================================

export type UserRole = 'ADMIN' | 'RESIDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  unitNumber: string;
}

// ---- Notice ----
export type NoticeCategory = 'MAINTENANCE' | 'EVENT' | 'GENERAL';
export type NoticePriority = 'HIGH' | 'LOW';

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string; // ISO-8601
  category: NoticeCategory;
  priority: NoticePriority;
}

// ---- Complaint ----
export type ComplaintStatus = 'PENDING' | 'RESOLVED';

export interface Complaint {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string; // ISO-8601
}

// ---- Visitor ----
export type VisitorStatus = 'EXPECTED' | 'ARRIVED';

export interface Visitor {
  id: string;
  name: string;
  expectedDate: string; // ISO-8601
  code: string;         // 4-digit numeric string
  status: VisitorStatus;
}

// ---- Auth Context Shape ----
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}
