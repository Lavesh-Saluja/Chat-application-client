import { Message } from "@/db/db.model"; // Assuming Message type is imported from db.model

interface ChatMessageProps {
  message: Message;
  isMyMessage: boolean | null;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isMyMessage }) => {
  return (
    <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs mx-2 my-1 p-2 rounded-lg ${isMyMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
        <p>{message.message}</p>
        <span className="text-xs text-gray-500">{isMyMessage ? 'You' : message.sender}</span>
        <span className="text-xs text-gray-500">&nbsp; &ndash; {message.timestamp}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
