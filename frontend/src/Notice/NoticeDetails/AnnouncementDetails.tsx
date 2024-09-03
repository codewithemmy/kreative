import React from 'react';
import CustomButton from '../../utilities/CustomButton';

interface AnnouncementDetailsProps {
  data: {
    _id: string;
    title: string;
    notice: string;
    noticeType: string;
    accountType: string;
    createdAt: string;
  };
}

const AnnouncementDetails: React.FC<AnnouncementDetailsProps> = ({ data }) => {
  return (
    <div className='p-10'>
      <div className='flex flex-col'>
        <h4 className='font-bold text-[18px] my-4'>{data?.noticeType}</h4>
        <p className='text-[#4E4C4C] text-[12px] pb-6'>{data?.notice}</p>
        <div className='flex justify-end'>
          <CustomButton text={"Edit announcement notice"} />
        </div>
      </div>
    </div>
  );
}

export default AnnouncementDetails;
