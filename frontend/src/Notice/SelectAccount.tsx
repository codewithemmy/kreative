import React, { useState } from "react";
import ComposeAnnouncement from "./composeNotice/ComposeAdverts";
import ComposeNews from "./composeNotice/ComposeNews";
import ViewModal from "../header/ViewModal";
import NewUsersModal from "../components/NewUsersModal";
import ComposeEvents from "./composeNotice/ComposeEvents";
import ComposeAdverts from "./composeNotice/ComposeAdverts";

interface SelectAccountProps {
  onClose: () => void;
  selectedNotice: string;
}

function SelectAccount({ onClose, selectedNotice }: SelectAccountProps) {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleAccountSelect = (account: string) => {
    setSelectedAccount(account);
  };

  const handleContinue = () => {
    if (selectedAccount) {
      setShowForm(true);
    }
  };

  const handleCloseCampaign = () => {
    setSelectedAccount(null);
    setShowForm(false);
  };

  return (
    <>
      <ViewModal isVisible={true} onClose={onClose} text="Account Type">
        <NewUsersModal
          heading="Select Audience"
          text="Next"
          onContinueClick={handleContinue}
        >
          <div className="flex justify-center items-center w-full">
            <div className="flex flex-wrap justify-center gap-4 cursor-pointer w-full py-12">
              <div
                className={`flex flex-col justify-center bg-[#FAFAFA] p-4 rounded-lg items-center w-[90%] md:w-[45%] h-[200px] md:h-[200px] ${
                  selectedAccount === "all"
                    ? "border-[#02554E3B] border-[2px]"
                    : ""
                }`}
                onClick={() => handleAccountSelect("all")}
              >
                <span className="my-4 font-semibold text-[12px] text-[#6A6868]">
                  All Users
                </span>
              </div>

              <div
                className={`flex flex-col justify-center bg-[#FAFAFA] p-4 rounded-lg items-center w-[90%] md:w-[45%] h-[200px] md:h-[200px] ${
                  selectedAccount === "admin"
                    ? "border-[#02554E3B] border-[2px]"
                    : ""
                }`}
                onClick={() => handleAccountSelect("admin")}
              >
                <span className="my-4 font-semibold text-[12px] text-[#6A6868]">
                  Admin
                </span>
              </div>

              <div
                className={`flex flex-col justify-center bg-[#FAFAFA] p-4 rounded-lg items-center w-[90%] md:w-[45%] h-[200px] md:h-[200px] ${
                  selectedAccount === "teacher"
                    ? "border-[#02554E3B] border-[2px]"
                    : ""
                }`}
                onClick={() => handleAccountSelect("teacher")}
              >
                <span className="my-4 font-semibold text-[12px] text-[#6A6868]">
                  Teacher
                </span>
              </div>
              <div
                className={`flex flex-col justify-center bg-[#FAFAFA] p-4 rounded-lg items-center w-[90%] md:w-[45%] h-[200px] md:h-[200px] ${
                  selectedAccount === "parent"
                    ? "border-[#02554E3B] border-[2px]"
                    : ""
                }`}
                onClick={() => handleAccountSelect("parent")}
              >
                <span className="my-4 font-semibold text-[12px] text-[#6A6868]">
                  Parent
                </span>
              </div>
            </div>
          </div>
        </NewUsersModal>
      </ViewModal>

      {showForm && (
        <>
          {selectedNotice === "emailSms" && (
            <ComposeNews
              onClose={handleCloseCampaign}
              selectedNotice={selectedNotice}
              selectedAccount={selectedAccount!}
            />
          )}
          {selectedNotice === "advert" && (
            <ComposeAdverts
              onClose={handleCloseCampaign}
              selectedNotice={selectedNotice}
              selectedAccount={selectedAccount!}
            />
          )}
          {selectedNotice === "event" && (
            <ComposeEvents
              onClose={handleCloseCampaign}
              selectedNotice={selectedNotice}
              selectedAccount={selectedAccount!}
            />
          )}
          {selectedNotice === "announcement" && (
            <ComposeAnnouncement
              onClose={handleCloseCampaign}
              selectedNotice={selectedNotice}
              selectedAccount={selectedAccount!}
            />
          )}
        </>
      )}
    </>
  );
}

export default SelectAccount;
