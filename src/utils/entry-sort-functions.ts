import { Entry } from '../models/entry';

export const byCreationTimestamp = (entry1: Entry, entry2: Entry) =>
  entry2.creationTimestamp - entry1.creationTimestamp;
