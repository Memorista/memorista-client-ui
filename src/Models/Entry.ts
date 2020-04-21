type EntryStatus = 'public' | 'pending' | 'hidden';

export interface NewEntry {
  text: string;
  author: string;
  creationTimestamp: number;
}

export interface Entry extends NewEntry {
  id: string;
  status: EntryStatus;
}
