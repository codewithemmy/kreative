import React, { ReactNode } from "react";
import arrowForward from "../assets/arrowForward.svg";
import CustomButton from "../customBtn";

interface NewUsersModalProps {
  heading: string;
  text: string;
  onContinueClick: () => void;
  children: ReactNode;
}

function NewUsersModal({
  heading,
  text,
  onContinueClick,
  children,
}: NewUsersModalProps) {
  return (
    <div className="flex items-center justify-center bg-opacity-50 border-t-2">
      <div className="bg-white p-6 w-full relative">
        <h2 className="text-[1] mb-4 text-[#535353]">{heading}</h2>

        <div className="flex items-center justify-center">{children}</div>

        <div className="w-full">
          <CustomButton
            type="button"
            text={text}
            width="100%"
            bgColor="#6C1EEB"
            hover= "#3944BC"
            onClick={onContinueClick}
          />
          <img src={arrowForward} alt="" className="h-[15px]" />
        </div>
      </div>
    </div>
  );
}

export default NewUsersModal;
