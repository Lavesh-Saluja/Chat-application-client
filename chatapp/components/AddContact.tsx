import { useState, useRef, useEffect } from "react";

interface AddContactPopupProps {
  onClose: () => void; // Change the type to accept no arguments
  onAddContact: (number: string, name: string) => void;
}

const AddContactPopup: React.FC<AddContactPopupProps> = ({ onClose, onAddContact }) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);

  const handleAddContact = () => {
    onAddContact(number, name);
  };

  const handleClosePopup = () => {
    onClose();
  };

  

  return (
    <div ref={popupRef} className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Add Contact</h2>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Number</label>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div className="flex justify-end">
          <button onClick={handleClosePopup} className="mr-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md focus:outline-none">
            Cancel
          </button>
          <button onClick={handleAddContact} className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md focus:outline-none">
            Add Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddContactPopup;
