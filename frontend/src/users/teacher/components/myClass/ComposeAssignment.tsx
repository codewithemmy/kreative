import React, { useState, useContext, ChangeEvent } from "react";
import Bold from "../../../../assets/bold.svg";
import Italics from "../../../../assets/italics.svg";
import Arrow from "../../assets/thickArrowForward.svg";
import { Context } from "../../../../context/Context";
import { handleCamposeNotice } from "../../../../Notice/composeNotice/services/composeNotice";
import ViewModal from "../../../../header/ViewModal";
import CustomButton from "../../../../utilities/CustomButton";

interface ComposeAssignmentProps {
  selectedNotice: string;
  onClose: () => void;
}

const ComposeAssignment: React.FC<ComposeAssignmentProps> = ({
  selectedNotice,
  onClose,
}) => {
  const [boldEnabled, setBoldEnabled] = useState(false);
  const [italicEnabled, setItalicEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { access } = useContext(Context);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    dueDate: "",
    classId: access?.classId,
    noticeType: selectedNotice,
  });

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      title: value,
    }));
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      content: value,
    }));
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      dueDate: value,
    }));
  };

  const handleBoldToggle = () => {
    setBoldEnabled(!boldEnabled);
  };

  const handleItalicToggle = () => {
    setItalicEnabled(!italicEnabled);
  };

  const handleFormSubmit = async () => {
    setIsLoading(true);
    await handleCamposeNotice(formData, access, setIsLoading, onClose);
  };

  return (
    <ViewModal isVisible={true} onClose={onClose} text="Account Type">
      <div className="w-full h-full bg-opacity-50">
        <div className="bg-white p-4 rounded-lg w-[95%] md:w-[100%] lg:w-[100%] h-[55%] md:h-[65%] lg:h-[90%] relative">
          <h2 className="my-2">Create Assignment</h2>
          <input
            type="text"
            placeholder="Subject"
            onChange={handleTitleChange}
            className="w-[100%] my-6 pl-3 font-semibold rounded-md h-12"
          />
          <textarea
            placeholder="Type content here......"
            onChange={handleContentChange}
            className="w-[100%] h-[70%] rounded-md relative p-2 border border-gray-300"
          />
          <div className="flex absolute bottom-[7%] md:bottom-[12%] left-6">
            <img
              src={Bold}
              alt=""
              className={`mr-4 ${boldEnabled ? "w-6 shadow-lg" : ""}`}
              onClick={handleBoldToggle}
            />
            <img
              src={Italics}
              alt=""
              className=""
              onClick={handleItalicToggle}
            />
          </div>

          <input
            type="date"
            placeholder="Enter due date"
            onChange={handleDateChange}
            className="w-[100%] pl-3 my-6 font-semibold rounded-md h-12"
          />

          <div className="flex items-center justify-end  my-2 md:my-4">
            <CustomButton
              text={isLoading ? "Creating..." : "Create"}
              onClick={handleFormSubmit}
            />
          </div>
        </div>
      </div>
    </ViewModal>
  );
};

export default ComposeAssignment;
