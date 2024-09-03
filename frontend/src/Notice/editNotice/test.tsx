import React, { useState, useEffect, useContext, ChangeEvent } from "react";
import Bold from "../../assets/bold.svg";
import Italics from "../../assets/italics.svg";
import Arrow from "../../assets/thickArrowForward.svg";
import { handleEditNotice } from "./services/edit";
import ViewModal from "../../header/ViewModal";
import CustomButton from "../../customBtn";

interface EditAdvertProps {
  selectedAccount: string;
  selectedNotice: string;
  onClose: () => void;
  datum: {
    _id: string;
    title: string;
    notice: string;
  };
}

const EditBlog: React.FC<EditAdvertProps> = ({
  selectedAccount,
  selectedNotice,
  onClose,
  datum,
}) => {
  const [mailTitle, setMailTitle] = useState(datum?.title || "");
  const [mailContent, setMailContent] = useState(datum?.notice || "");
  const [boldEnabled, setBoldEnabled] = useState(false);
  const [italicEnabled, setItalicEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData({
      title: mailTitle,
      notice: mailContent,
      noticeType: selectedNotice,
      accountType: selectedAccount,
    });
  }, [datum, mailTitle, mailContent, selectedNotice, selectedAccount]);

  const [formData, setFormData] = useState({
    title: mailTitle,
    notice: mailContent,
    noticeType: selectedNotice,
    accountType: selectedAccount,
    // description: selectedNotice,
    // image: selectedImage
  });

  useEffect(() => {
    if (datum) {
      setMailTitle(datum.title || '');
      setMailContent(datum.notice || '');
    }
  }, [datum]);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMailTitle(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      title: value,
    }));
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMailContent(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      notice: value,
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
    await handleEditNotice(datum, formData, setIsLoading, onClose);
  };
  
  return (
    <>
      <ViewModal isVisible={true} onClose={onClose} text="Account Type">
        <div className="w-full h-full bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-[95%] md:w-[100%] lg:w-[100%] h-[55%] md:h-[65%] lg:h-[90%] relative">
            <h2 className='my-2'>Compose Blog</h2>
            <input
              type="text"
              placeholder="Title of the mail"
              value={mailTitle}
              onChange={handleTitleChange}
              className="w-[100%] my-6 font-semibold rounded-md h-12"
            />
            <textarea
            placeholder="Type your mail here..."
            value={mailContent}
           onChange={handleContentChange}
           className="w-[100%] h-[70%] rounded-md relative p-2 border border-gray-300"
            />
            <div className="flex absolute bottom-[14%] left-6">
              <img
                src={Bold}
                alt=""
                className={`mr-4 ${boldEnabled ? 'w-6 shadow-lg' : ''}`}
                onClick={handleBoldToggle}
              />
              <img src={Italics} alt="" className="" onClick={handleItalicToggle} />
            </div>
            <div className="absolute bottom-0 right-0 flex items-center justify-center m-4 bg-primary rounded-md px-6">
              <CustomButton type="button"
               text={isLoading ? "Sending..." : "Send Mail"}
               width="110px"
                hover='#076059' 
                onClick={handleFormSubmit}
                 />
              <img src={Arrow} alt="" className="h-[15px]" />
            </div>
          </div>
        </div>
      </ViewModal></>
  );
}

export default EditBlog;
