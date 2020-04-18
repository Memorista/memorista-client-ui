export interface NewEntry {
  text: string;
  author: string;
  timestamp: number;
}

export interface Entry extends NewEntry {
  id: string;
}
