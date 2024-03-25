"use client"
import Image from "next/image";
import Contact from "../components/Contact";
import img from "../public/laveshPP.jpg"
import { useState, useEffect, SetStateAction, useRef } from "react";
import addChat,{ fetchChatsByNumber,addContact } from "@/db/db.function";
import { Message,chatTable,contactsTable } from "@/db/db.model"
import { useLiveQuery } from "dexie-react-hooks";
import AddContactPopup from '@/components/AddContact';
import MessageCard from '@/components/MessageCard';
import Cookies from 'js-cookie';

interface Chat extends Message {}
export default function Home() {


  const [activeNumber, setActiveNumber] = useState("");
    const handleContactClick = (number: string) => {
    setActiveNumber(number);
  };
  const [myPhone, setMyPhone] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  async function getChats(number: string) {
    const chats = await fetchChatsByNumber(number);
    console.log(chats);
  }
  async function formatMessages (data: string) {
    console.log("message")
    try {
      const objData = (JSON.parse(data));
      const msgId = objData.id;
      const sender = objData.sender;
      const receiver = objData.receiver;
      const msg = objData.message;
      const time = objData.timestamp;
      await addChat(msgId, msg, sender, receiver, time);
      console.log("chats:", chats);
    } catch (e:any) {
      console.log(e);
    }
   

  }
  const sendMessage=async()=>{
    const authToken = getCookie('token');
    console.log(authToken);
        const response=await fetch('http://localhost:8000/api/sendMessage',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`${authToken}`,
            },
            body:JSON.stringify({
                message,
                receiver:activeNumber
            })
        });
        console.log(response);
    }   
    //   function getCookie(name:string) {
    //     console.log("Cookie",document.cookie);
    //     const cookies = document.cookie.split(';');
    //     for (let i = 0; i < cookies.length; i++) {
    //         const cookie = cookies[i].trim();
    //         // Check if this cookie starts with the name we are looking for
    //         if (cookie.startsWith(name + '=')) {
    //             // Extract and return the cookie value
    //             return cookie.substring(name.length + 1);
    //         }
    //     }
    //     // Return null if the cookie is not found
    //     return null;
  // }
   function getCookie(name:string) {
    return Cookies.get(name);
}
    const [showAddContactPopup, setShowAddContactPopup] = useState(false);

  const handleAddContactButtonClick = () => {
    setShowAddContactPopup(true);
  };

const handleClosePopup = () => {
    setShowAddContactPopup(false);
};
  
  

 const contacts = useLiveQuery(() => contactsTable.toArray());
   const handleAddContact = async (number: string, name: string) => {
    try {
      await addContact(number, name);
    } catch (error) {
      console.error("Error adding contact:", error);
    }
     handleClosePopup();
  };
   

  

const chats =useLiveQuery<Chat[]>(
    () => 
      chatTable.where('sender')
      .equals(activeNumber)
      .or('receiver')
        .equals(activeNumber).toArray(),[activeNumber]
  );
  useEffect(() => {

    const authToken = getCookie('token');
    console.log("token=", authToken);
    console.log("activeNumber=", activeNumber);
    getChats(activeNumber);

    try {
      // setMyPhone(localStorage.getItem('MyPhone').toString())
      const ws: WebSocket = new WebSocket(`ws://127.0.0.1:8000?authorization=${authToken}`, "echo-protocol");
    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };
    ws.onmessage = (event) => {
      // Handle incoming messages
      console.log("Received:", event.data);
       formatMessages(event.data);
    };
    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };
    return () => {
      ws.close();
     };
   } catch (e:any) {
     console.log(e);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNumber]);
  return (
    <div className="bg-slate-300 h-[100vh]">
         <button onClick={handleAddContactButtonClick} className="absolute top-5 right-5 py-2 px-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600" >
        Add Contact
      </button>
      <div className="grid grid-cols-3 p-16 h-[100%] border-1 ">
        <div className="col-span-1 bg-white  border-r-1 overflow-scroll scrollbar-container">
          {contacts!==undefined?
            contacts.map((num) => {
              return <>
               <Contact name={num.name} img={img} number={num.number} onClick={ handleContactClick} />
              </>
            }) :
           
            <button onClick={handleAddContactButtonClick} className="py-2 px-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
              Add new Contact
            </button>
          
          }
         
        </div>
        
        <div className="col-span-2 bg-neutral-300 h-[100%]" >
          <div className="flex flex-col justify-between  h-[90vh]  ">
            <div className=" h-[100%] flex flex-col  p-3 text-xl  " id="ChatContainer">
              
              <div className=" h-[100%] overflow-scroll w-[100%] scrollbar-container  px-9 flex flex-col-reverse">
               
                
               
                  {(chats!==undefined && chats.length!=0)?
                chats.map((obj) => {
                  return (<>
                    {/* <MessageCard message={obj} isMyMessage={localStorage.getItem("MyPhone").toString()===obj.sender}></MessageCard> */}
                  </>)
                }
                )
                 :
                <h1>Welcome to Chats</h1>
              }
                </div>
            
              
             
          </div>
         <div id="Textbox" className="flex justify-center items-center h-16 bg-green-500">
  <input
    type="text"
    className="w-[80%] h-10 border-black border-2 rounded-md"
    onChange={(e) => setMessage(e.target.value)}
  />
  <button
    onClick={sendMessage}
    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
  >
    Send
  </button>
</div>
          </div>
         
      </div>
      </div>
      {
        showAddContactPopup ?
          <AddContactPopup onClose={handleClosePopup} onAddContact={handleAddContact} />
          :
          <></>
        }
        
    </div>
  );
}
