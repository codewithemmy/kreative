import React, { useState } from "react";
import CustomButton from "../../utilities/CustomButton";
import EditAssignment from "../editNotice/EditAssignment";

interface AssignmentDetailsProps {
  data: {
    _id: string;
    title: string;
    notice: string;
    noticeType: string;
    accountType: string;
    createdAt: string;
  };
}

const AssignmentDetails: React.FC<AssignmentDetailsProps> = ({ data }) => {
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => {
    setOpenModal(true);
  };
  const handleClose: () => void = () => {
    setOpenModal(false);
  };

  return (
    <div className="w-full">
      <div className="p-10">
        <div className="flex flex-col">
          {/* <img src="" alt="" /> */}
          <h4 className=" font-bold text-[18px] my-4">{data?.noticeType}</h4>
          <p
            className="text-[#4E4C4C] text-[12px] pb-6"
            style={{ lineHeight: "2" }}
          >
            {data?.notice}
          </p>
          <div className="flex justify-end">
            <CustomButton text={"Edit assignment notice"} onClick={handleOpen} />
          </div>
        </div>
      </div>
      {openModal && <EditAssignment />}
    </div>
  );
};

export default AssignmentDetails;
