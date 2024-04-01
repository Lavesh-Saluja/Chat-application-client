import { chatTable,contactsTable } from "./db.model";
async function addChat(id: string, message: string, sender: string, receiver: string, timestamp: number) {
    try{const res = await chatTable.add({ id, message, sender, receiver, timestamp });
        console.log("New chat:", res);
    } catch (e:any) {
        console.log("error", e);
    }
}
export async function fetchChatsByNumber(number: string) {
    const chats = await chatTable.where('sender').equals(number).or('receiver').equals(number).toArray();
    return chats;
}
export async function addContact(number: string,name:string,unreadMessages:boolean) {
    try{const contacts = await contactsTable.add({ number,name, unreadMessages});
        console.log(contacts);
    } catch (e: any) {
        console.log("error", e);
    }
}
export async function updateContactName(number: string, newName: string) {
    try {
        // Check if the contact with the given number exists
        const existingContact = await contactsTable.get({ number });

        // If the contact exists, update its name
        if (existingContact) {
            await contactsTable.update(number, { name: newName });
            console.log(`Contact with number ${number} updated successfully.`);
        } else {
            console.log(`Contact with number ${number} not found.`);
        }
    } catch (e: any) {
        console.error("Error updating contact:", e);
    }
}
export async function updateContactUnreadMessage(number: string, unreadMessage: boolean) {
    try {
        // Check if the contact with the given number exists
        const existingContact = await contactsTable.get({ number });

        // If the contact exists, update its name
        if (existingContact) {
            await contactsTable.update(number, { unreadMessages: unreadMessage });
            console.log(`Contact with number ${number} updated successfully.`);
        } else {
            console.log(`Contact with number ${number} not found.`);
        }
    } catch (e: any) {
        console.error("Error updating contact:", e);
    }
}
export async function getName(number: string) {
    const res = await contactsTable.get({ number });
    console.log(res);
    if (res) {
        return res.name;
    }
}
export default addChat;
