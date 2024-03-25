import Dexie from "dexie";

export interface Message {
  id: string;
  message: string;
  sender: string;
  receiver: string;
  timestamp: number; // Changed to number as timestamp is typically a number
}

export interface Contact {
  number: string; // Changed to string to match other fields
  name: string;
}

const db = new Dexie("chatDatabase");

db.version(4.1).stores({
  chats: 'id, message, sender, receiver, timestamp',
  contacts: ' number, name',
});

export const chatTable = db.table('chats');
export const contactsTable = db.table('contacts');

export default db;
