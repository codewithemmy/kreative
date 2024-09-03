import React from 'react';
import { RiLoader4Line } from 'react-icons/ri';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <RiLoader4Line className="animate-spin mr-2 h-10 w-10 my-6" color='#6C1EEB' />

    </div>
  );
};

export default Spinner;
