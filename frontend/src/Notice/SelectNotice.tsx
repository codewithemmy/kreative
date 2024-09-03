import React, { useState } from 'react';
import message from "../assets/message.svg";
import blog from "../assets/blog.svg";
import sms from "../assets/sms.svg";

import SelectAccount from './SelectAccount';
import ViewModal from '../header/ViewModal';
import NewUsersModal from '../components/NewUsersModal';

interface SelectNoticeProps {
  onClose: () => void;
}

function SelectNotice({ onClose }: SelectNoticeProps) {
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleNoticeSelect = (notice: string) => {
    setSelectedNotice(notice);
  };

  const handleContinue = () => {
    if (selectedNotice) {
      setShowForm(true);
    }
  };

  const handleCloseNotice = () => {
    setSelectedNotice(null);
    setShowForm(false);
  };

  return (
    <>
      <ViewModal isVisible={true} onClose={onClose} text="Notice Details">
        <NewUsersModal heading="Select the notice type you’ll like to create" text="Next" onContinueClick={handleContinue}>
          <div className="flex justify-center items-center w-full">
            <div className="flex flex-wrap justify-center gap-4 cursor-pointer w-full py-12">
              <div
                className={`flex flex-col justify-center bg-[#FAFAFA] p-4 rounded-lg items-center w-[90%] md:w-[45%] h-[200px] md:h-[200px] ${selectedNotice === 'emailSms' ? 'border-[#02554E3B] border-[2px]' : ''}`}
                onClick={() => handleNoticeSelect('emailSms')}
              >
                <img src={sms} alt="" />
                <span className="my-4 font-semibold text-[12px] text-[#6A6868]">Email</span>
              </div>

              <div
                className={`flex flex-col justify-center bg-[#FAFAFA] p-4 rounded-lg items-center w-[90%] md:w-[45%] h-[200px] md:h-[200px] ${selectedNotice === 'advert' ? 'border-[#02554E3B] border-[2px]' : ''}`}
                onClick={() => handleNoticeSelect('advert')}
              >
                <img src={message} alt="" />
                <span className="my-4 font-semibold text-[12px] text-[#6A6868]">Adverts</span>
              </div>

              <div
                className={`flex flex-col justify-center bg-[#FAFAFA] p-4 rounded-lg items-center w-[90%] md:w-[45%] h-[200px] md:h-[200px] ${selectedNotice === 'event' ? 'border-[#02554E3B] border-[2px]' : ''}`}
                onClick={() => handleNoticeSelect('event')}
              >
                <img src={blog} alt="" />
                <span className="my-4 font-semibold text-[12px] text-[#6A6868]">Events</span>
              </div>
              <div
                className={`flex flex-col justify-center bg-[#FAFAFA] p-4 rounded-lg items-center w-[90%] md:w-[45%] h-[200px] md:h-[200px] ${selectedNotice === 'announcement' ? 'border-[#02554E3B] border-[2px]' : ''}`}
                onClick={() => handleNoticeSelect('announcement')}
              >
                <img src={blog} alt="" />
                <span className="my-4 font-semibold text-[12px] text-[#6A6868]">Announcement</span>
              </div>
            </div>
          </div>
        </NewUsersModal>
      </ViewModal>

      {showForm ? (
        <>
          {selectedNotice && (
            <SelectAccount onClose={handleCloseNotice} selectedNotice={selectedNotice} />
          )}
        </>
      ) : null}
    </>
  );
}

export default SelectNotice;
