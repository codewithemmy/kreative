import React, { useState, useEffect } from 'react';
import { GrClose } from 'react-icons/gr';

interface ViewModalProps {
  isVisible: boolean;
  onClose: () => void;
  text: string;
  children: React.ReactNode;
}

const ViewModal: React.FC<ViewModalProps> = ({ isVisible, onClose, text, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(isVisible);
  const [slideClass, setSlideClass] = useState<string>('');

  useEffect(() => {
    setIsOpen(isVisible);
  }, [isVisible]);

  const handleClose = () => {
    onClose();
    setSlideClass('translate-x-full');
    setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end  backdrop-blur`}
        onClick={handleClose}
        style={{ zIndex: 1000 }}
      >
        <div
          className={`w-full overflow-y-scroll h-full md:w-[60%] lg:w-[40%] bg-white shadow-lg rounded-lg ${slideClass} transform transition-transform duration-700 ease-in-out`}
          style={{ zIndex: 1000 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex justify-between p-4 bg-white shadow-md'>
            <h2 className='text-md font-bold'>{text}</h2>
            <button className='p-2 rounded-full hover:bg-gray-200' onClick={handleClose}>
              <GrClose />
            </button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default ViewModal;
