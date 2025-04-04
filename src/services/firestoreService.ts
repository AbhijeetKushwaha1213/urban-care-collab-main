
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Type for event data
export interface EventData {
  id?: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  status?: string;
  timeRemaining?: string;
  categories: string[];
  volunteersCount?: number;
  createdBy?: string;
  createdAt?: any;
}

// Type for issue data
export interface IssueData {
  id?: string;
  title: string;
  description: string;
  location: string;
  category: string;
  image?: string;
  date?: string;
  status?: string;
  commentsCount?: number;
  volunteersCount?: number;
  createdBy?: string;
  createdAt?: any;
}

// Events Collection
export const eventsCollection = collection(db, 'events');

// Issues Collection
export const issuesCollection = collection(db, 'issues');

// Get all events
export const getEvents = async () => {
  const eventsSnapshot = await getDocs(query(eventsCollection, orderBy('createdAt', 'desc')));
  return eventsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as EventData[];
};

// Get event by ID
export const getEventById = async (id: string) => {
  const eventDoc = await getDoc(doc(eventsCollection, id));
  if (eventDoc.exists()) {
    return { id: eventDoc.id, ...eventDoc.data() } as EventData;
  }
  return null;
};

// Create a new event
export const createEvent = async (eventData: EventData, userId: string) => {
  return await addDoc(eventsCollection, {
    ...eventData,
    createdBy: userId,
    status: 'Upcoming',
    volunteersCount: 0,
    createdAt: serverTimestamp()
  });
};

// Update an event
export const updateEvent = async (id: string, eventData: Partial<EventData>) => {
  const eventRef = doc(eventsCollection, id);
  await updateDoc(eventRef, eventData);
  return eventRef;
};

// Delete an event
export const deleteEvent = async (id: string) => {
  const eventRef = doc(eventsCollection, id);
  await deleteDoc(eventRef);
  return eventRef;
};

// Get all issues
export const getIssues = async () => {
  const issuesSnapshot = await getDocs(query(issuesCollection, orderBy('createdAt', 'desc')));
  return issuesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as IssueData[];
};

// Get issue by ID
export const getIssueById = async (id: string) => {
  const issueDoc = await getDoc(doc(issuesCollection, id));
  if (issueDoc.exists()) {
    return { id: issueDoc.id, ...issueDoc.data() } as IssueData;
  }
  return null;
};

// Create a new issue
export const createIssue = async (issueData: IssueData, userId: string) => {
  return await addDoc(issuesCollection, {
    ...issueData,
    createdBy: userId,
    status: 'reported',
    commentsCount: 0,
    volunteersCount: 0,
    createdAt: serverTimestamp()
  });
};

// Update an issue
export const updateIssue = async (id: string, issueData: Partial<IssueData>) => {
  const issueRef = doc(issuesCollection, id);
  await updateDoc(issueRef, issueData);
  return issueRef;
};

// Delete an issue
export const deleteIssue = async (id: string) => {
  const issueRef = doc(issuesCollection, id);
  await deleteDoc(issueRef);
  return issueRef;
};

// Get events created by a specific user
export const getUserEvents = async (userId: string) => {
  const eventsSnapshot = await getDocs(
    query(eventsCollection, where('createdBy', '==', userId), orderBy('createdAt', 'desc'))
  );
  return eventsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as EventData[];
};

// Get issues created by a specific user
export const getUserIssues = async (userId: string) => {
  const issuesSnapshot = await getDocs(
    query(issuesCollection, where('createdBy', '==', userId), orderBy('createdAt', 'desc'))
  );
  return issuesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as IssueData[];
};
