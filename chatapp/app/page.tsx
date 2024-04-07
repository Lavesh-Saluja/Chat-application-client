"use client"
import Image from "next/image";
import Contact from "../components/Contact";
import img from "../public/PP.jpg"
import { useState, useEffect, SetStateAction, useRef } from "react";
import addChat,{ fetchChatsByNumber,addContact,updateContactName,updateContactUnreadMessage } from "@/db/db.function";
import { Message,chatTable,contactsTable,Contact as contactType } from "@/db/db.model"
import { useLiveQuery } from "dexie-react-hooks";
import AddContactPopup from '@/components/AddContact';
import MessageCard from '@/components/MessageCard';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();


  const [activeNumber, setActiveNumber] = useState<string>('');
    const handleContactClick = (number: string) => {
      setActiveNumber(number);
       updateContactUnreadMessage(number, false);
  };
  const [myPhone, setMyPhone] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  async function getChats(number: string) {
    const chats = await fetchChatsByNumber(number);
    console.log(chats);
  }
  async function formatMessages (data: string) {
    console.log("message",data)
    try {
      const objData = (JSON.parse(data));
      console.log(objData,"=====");
      const msgId = objData.id;
      const sender = objData.sender+"";
      const receiver = objData.receiver;
      const sen = await contactsTable.get({number:sender});
      if (!sen && sender != myPhone) {
        console.log("Success");
        await handleAddContact(sender,sender);
      }
      
      const msg = objData.message;
      const time = objData.timestamp;
      await addChat(msgId, msg, sender, receiver, time);
      if (sender != activeNumber && sender!=myPhone) {
        await updateContactUnreadMessage(sender,true)
      }
      console.log("chats:", chats);
    } catch (e:any) {
      console.log(e);
    }
   

  }
  const sendMessage=async()=>{
    const authToken = getCookie();
    console.log(authToken);
        const response=await fetch('https://chatapp.smpco.tech/api/sendMessage',{
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
    if (response.ok) {
      const msg = JSON.stringify(await response.json());
      await formatMessages(msg);
    }
    setMessage("");
    }   

    function getCookie() {
    return  localStorage.getItem("MyToken");
    }
  function getPhoneNumber() {
    return localStorage.getItem('MyPhone');
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
       const sen = await contactsTable.get({ number });
       if (!sen) {
         await addContact(number,name,false);
       }
       else {
         //update
         await updateContactName(number,name);
       }
      
    } catch (error) {
      console.error("Error adding contact:", error);
    }
     handleClosePopup();
  };
   

  

const chats =useLiveQuery(
    () => 
      chatTable.where('sender')
      .equals(activeNumber)
      .or('receiver')
        .equals(activeNumber).reverse().sortBy('timestamp'),[activeNumber]
);
  const checklogin = async () => {
    const authToken = getCookie();
    if (authToken == null) {
      router.push("/login");
    }
        console.log("token=", authToken);

  try{  const res = await fetch("https://chatapp.smpco.tech/login", {
      method:'GET',
      headers:{
                'Content-Type':'application/json',
                'Authorization':`${authToken}`
            }
  })
    if (!res.ok) {
      router.push("/login");
    }
  } catch (e:any) { 
    console.error(e);
  }
    
    
    try {
      await getOfflineMessages();
      const phoneNumber = getPhoneNumber();
      setMyPhone(phoneNumber==null ? "" : phoneNumber)
      const ws: WebSocket = new WebSocket(`wss://chatapp.smpco.tech?authorization=${authToken}`, "echo-protocol");
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
  }
  async function getOfflineMessages() {
     const authToken = getCookie();
    try {
      const res = await fetch("https://chatapp.smpco.tech/api/getQueuedMessages", {
         method:'GET',
      headers:{
                'Content-Type':'application/json',
                'Authorization':`${authToken}`
            }
      });
      if (res.ok) {

        const offLineMessages = ((await res.json()));
        offLineMessages.message.map((obj:any)=>{
          console.log(JSON.stringify((JSON.parse(obj)).message));
          formatMessages(JSON.stringify((JSON.parse(obj)).message))
          });
        
      }
    } catch (e) {
      console.error(e);
    }
  }
  useEffect(() => {
    checklogin();
    console.log("activeNumber=", activeNumber);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNumber]);
  return (
    <div className="bg-slate-300 h-[100vh]">
         <button onClick={handleAddContactButtonClick} className="absolute top-5 right-5 py-2 px-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600" >
        Add Contact
      </button>
      <div className="grid grid-cols-3 p-16 border-1 ">
        <div className="col-span-1 bg-white  border-r-1 overflow-scroll scrollbar-container h-[80vh]">
          {contacts!==undefined?
            contacts.map((num) => {
              return <>
                <Contact key={num.number} name={num.name} img={img} number={num.number} onClick={handleContactClick} hasUnreadMessages={num.unreadMessages} selected={ num.number === activeNumber} />
              </>
            }) :
           
            <button onClick={handleAddContactButtonClick} className="py-2 px-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
              Add new Contact
            </button>
          
          }
         
        </div>
        
        <div className="col-span-2 bg-neutral-300 " >
          {
            !(activeNumber == "") ?
                <div className="flex flex-col justify-between  h-[73.5vh]  ">
            <div className=" h-[100%] flex flex-col  p-3 text-xl  " id="ChatContainer">
              
              <div className=" h-[100%] overflow-scroll w-[100%] scrollbar-container  px-9 flex flex-col-reverse">
               
                
               
                  {(chats!==undefined && chats.length!=0)?
                      chats.map((obj) => {
                  if(myPhone!=activeNumber)
                  return (<>
                    <MessageCard message={obj} isMyMessage={myPhone==obj.sender}></MessageCard>
                  </>)
                  else
                  {
                    if(obj.sender==activeNumber && obj.receiver==activeNumber) 
                    return (<>
                      <MessageCard message={obj} isMyMessage={myPhone==obj.sender}></MessageCard>
                    </>)
                    }
                    
                }
                )
                 :
                <h1>Welcome to Chats!!!!! START CHATING</h1>
              }
                </div>
            
              
             
          </div>
    
              </div> :
              <h1 className="text-center mt-96 text-2xl">Welcome to Chats!!!!! START CHATING</h1>
          }
          {
            !(activeNumber=="")?
            <div id="Textbox" className="flex justify-center items-center h-[60px] bg-green-500">
  <input
    type="text"
                    className="w-[80%] h-10 border-black border-2 rounded-md"
                    value={message}
    onChange={(e) => setMessage(e.target.value)}
  />
  <button
    onClick={sendMessage}
    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
  >
    Send
  </button>
              </div> :
              <></>
        }
              
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
