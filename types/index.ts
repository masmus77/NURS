
export enum ProgramStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export interface ProgramItem {
  id: string;
  title: string;
  category: 'Administrasi' | 'Kaderisasi' | 'Digitalisasi' | 'Sosial';
  status: ProgramStatus;
  description: string;
  pic: string; // Person in charge
  deadline: string;
}

export type ArchiveFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  category: 'Administrasi' | 'Surat' | 'Kegiatan' | 'Keuangan';
  data: string; // base64
  createdAt: number;
}

export type Kader = {
  id: string;
  name: string;
  position: string;
  expertise: string;
  interests: string;
  phone: string;
  availability: string;
}

export type RenjaItem = {
  month: string;
  program: string;
  indicator: string;
}

export type RenjaPlan = {
  id: string;
  year: number;
  plan: RenjaItem[];
}

export type ImpactData = {
  id: string; // YYYY-MM
  month: string;
  year: number;
  activities: number;
  attendees: number;
  activeKader: number;
  socialFund: number;
  programProgress: number; // percentage
}

export type Report = {
    id: string; // YYYY-MM
    month: string;
    year: number;
    activityName: string;
    photos: string[]; // base64
    attendees: number;
    involvedKader: number;
    notes: string;
}
