import React from "react";

interface CardProps {
  icon: string;
  altText: string;
  text: string;
  amount: string;
}

const Card: React.FC<CardProps> = ({ icon, altText, text, amount }) => {
  return (
    <div className="flex justify-start gap-x-[16px] items-center w-[251px] h-[106px] rounded-[8px] border-[1px] border-[#DBDBDB] p-[24px]">
      <div className="w-[24px] h-[24px]">
        <img src={icon} alt={altText} className="w-full h-full" />
      </div>
      <div>
        <div className="text-[#101928]">{text}</div>
        <div className="text-[#101928] text-[24px] font-semibold">{amount}</div>
      </div>
    </div>
  );
};

export default Card;
