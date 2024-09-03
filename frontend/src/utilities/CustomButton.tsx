import React from "react";

interface CustomButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children?: React.ReactNode;
  text: string;
  width?: string;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  className,
  children,
  text,
  width,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={`py-4 px-5 text-sm h-full border-primary border-2 bg-primary text-center text-white text-md font-semibold rounded-xl hover:bg-white hover:text-hover hover:border-hover focus:outline-none ${className}`}
      style={{ width: width }} 
      disabled={disabled} 
    >
      {children || text}
    </button>
  );
};

export default CustomButton;
