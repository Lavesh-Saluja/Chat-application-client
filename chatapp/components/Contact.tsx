import Image from "next/image";
import React from 'react';

interface ContactProps {
    name: string;
    img: any;
    number: string;
    onClick: Function;
    hasUnreadMessages: boolean;
    selected: boolean;
}

const Contact: React.FC<ContactProps> = ({ name, img, number, onClick, hasUnreadMessages,selected }) => {
    
    return (
        <div className={`h-16 border-b-2 border-gray-200 p-3 flex justify-start items-center ${selected ? 'bg-gray-200' : ''}`} onClick={() => { onClick(number) }}>
             
            <div className="flex justify-center items-center">
                <Image className="w-12 rounded-full h-12" alt="Profile Pic" src={img} width={100} height={100} />
            </div>
            <div className="w-[100%] flex justify-start items-center ml-10">
                <div>{name==""?number:name}</div>
            </div>
            {hasUnreadMessages?
                <div className="  w-2 h-2 rounded-full bg-blue-500"></div>
                :
                <></>
             }
                
            
        </div>
    );
}

export default Contact;


