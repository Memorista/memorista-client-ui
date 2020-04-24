type EntryStatus = 'public' | 'pending' | 'hidden';

export interface NewEntry {
  text: string;
  author: string;
}

export interface Entry extends NewEntry {
  id: string;
  status: EntryStatus;
  creationTimestamp: number;
}
