import React, { useState } from "react";
import Upload from "../assets/uploadcsv.svg";
import Seacrh from "../assets/search.svg";
import { IoMdArrowBack } from "react-icons/io";
import ViewModal from "../header/ViewModal";
import CustomButton from "../utilities/CustomButton";
import ComposeEmailSMS from "./composeNotice/ComposeEvents";

interface SMSNoticeProps {
  onClose: () => void;
  selectedNotice: string;
}

interface RowData {
  id: number;
  name: string;
  phonenumber: string;
}

const SMSNotice: React.FC<SMSNoticeProps> = ({ onClose, selectedNotice }) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [smsNotice, setSmsNotice] = useState<RowData[]>([]);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [sendButtonEnabled, setSendButtonEnabled] = useState(false);

  const handleRowSelect = (rowId: number) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((id) => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
    setSendButtonEnabled(selectedRows.length > 0);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === smsNotice.length) {
      setSelectedRows([]);
    } else {
      const allRowIds = smsNotice.map((data) => data.id);
      setSelectedRows(allRowIds);
    }
    setSendButtonEnabled(selectedRows.length !== smsNotice.length);
  };

  const handleNextClick = () => {
    if (sendButtonEnabled) {
      setShowComposeModal(true);
    }
  };

  return (
    <ViewModal
      isVisible={true}
      onClose={onClose}
      text={`${selectedNotice} Details`}
    >
      <div className="flex items-center justify-center bg-opacity-50 p-2">
        <div className="bg-white p-4 rounded-lg w-[100%] h-full md:h-[65%] lg:h-[90%] relative z-auto">
          <div className="flex items-center mb-6">
            <div className="flex items-center cursor-pointer" onClick={onClose}>
              <IoMdArrowBack
                className="mr-2 cursor-pointer"
                style={{ color: "#076059" }}
              />
              <h5 className="text-primary mr-2">Go Back</h5>
            </div>
            <h2>SMS Notice</h2>
          </div>
          <div className="flex w-full">
            <div className="relative flex items-center w-[80%] md:w-[70%] lg:w-[80%] mr-2">
              <img
                src={Seacrh}
                alt="search"
                className="absolute w- h-5 text-gray-400 left-3 top-[20%] md:top-[30%]"
              />
              <input
                type="text"
                placeholder="Search List"
                className="py-2 pl-10 pr-14 w-full mb-4 md:mb-0 bg-[#F8F8F8] border border-gray-400 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="relative flex items-center w-[80%] mr-2">
              <select
                name="All Users"
                id=""
                className="text-[#535353] border-1 border-[#70707043] w-full rounded-md"
              >
                <option value="0" defaultValue={"0"}>
                  0
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
          </div>
          <div className="flex justify-center items-center bg-[#076059] w-[95%] h-[40px] rounded-[17px] hover:bg-[#008000] my-6 cursor-pointer">
            <img src={Upload} alt="" className="mr-2" />
            <button className="text-[white] text-[14px]">
              Upload CSV File
            </button>
          </div>

          <div className="h-full">
            <table className="table-auto w-full">
              <thead>
                <tr className="text-left h-[60px]">
                  <th className="text-[#6A6A6A] w-[20%]">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === smsNotice.length}
                      onChange={handleSelectAll}
                      className="mr-2 text-primary text-[0.89em]"
                    />
                    Select All
                  </th>
                  <th className="text-[#535353] text-[0.9rem] w-[20%]">Name</th>
                  <th className="text-[#535353] text-[0.9rem] w-[30%]">
                    Phone Number
                  </th>
                </tr>
              </thead>
            </table>

            <div className="overflow-y-auto h-[50%] md:h-[55%] lg:h-[60%]">
              <table className="table-auto w-full">
                <tbody>
                  {smsNotice?.map((row, index) => (
                    <tr
                      key={row.id}
                      className={`${
                        index % 2 === 0 ? "bg-[#E8E8E8]" : ""
                      } h-[60px]`}
                    >
                      <td className="w-[20%]">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row.id)}
                          onChange={() => handleRowSelect(row.id)}
                          style={{
                            backgroundColor: selectedRows.includes(row.id)
                              ? "#076059"
                              : "transparent",
                          }}
                        />
                      </td>
                      <td className="w-[20%]">{row.name}</td>
                      <td className="w-[30%]">{row.phonenumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <CustomButton onClick={handleNextClick} text="Next" />
            </div>
          </div>
        </div>
      </div>
      {/* {showComposeModal && (
        <ComposeEmailSMS
          onClose={(): void => setShowComposeModal(false)}
        />
      )} */}
    </ViewModal>
  );
};

export default SMSNotice;
