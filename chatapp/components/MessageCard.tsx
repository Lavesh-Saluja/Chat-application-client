
import { Message } from "@/db/db.model"; // Assuming Message type is imported from db.model
import { getName as contactName } from "@/db/db.function";
import { useState,useEffect } from "react";
interface ChatMessageProps {
  message: Message;
  isMyMessage: boolean | null;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isMyMessage }) => {
  const [name, setName] = useState('');
    const [shortDate, setShortDate] = useState('');

  async function getName(number:string) {
    const s = (await contactName(number));
    setName(s);
  }
   function formatShortDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  useEffect(() => {
    getName(message.sender);
        setShortDate(formatShortDate(message.timestamp));
  },[message])
  return (
    <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs mx-2 my-1 p-2 rounded-lg ${isMyMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
        <p>{message.message}</p>
        <span className="text-xs text-gray-500">{isMyMessage ? 'You' : name}</span>
        <span className="text-xs text-gray-500">&nbsp; &ndash; {shortDate}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
