import React, { useState } from "react";
import CancelReport from "../assets/cancel.svg";
import Gallery from "../assets/gallery.svg";
import Bold from "../assets/bold.svg";
import Italics from "../assets/italics.svg";
import Arrow from "../assets/thickArrowForward.svg";
import CustomButton from "../customBtn";

interface FormData {
  title: string;
  mailMessage: string;
}

interface Props {
  userId: string;
  onClose: () => void;
}

function ReplyComponent({ userId, onClose }: Props) {
  const [mailTitle, setMailTitle] = useState<string>("");
  const [mailContent, setMailContent] = useState<string>("");
  const [boldEnabled, setBoldEnabled] = useState<boolean>(false);
  const [italicEnabled, setItalicEnabled] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    mailMessage: "",
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMailTitle(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      title: value,
    }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    const value = e.currentTarget.textContent || "";
    setFormData((prevFormData) => ({
      ...prevFormData,
      mailMessage: value,
    }));
  };

  const handleBoldToggle = () => {
    setBoldEnabled(!boldEnabled);
  };

  const handleItalicToggle = () => {
    setItalicEnabled(!italicEnabled);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleMailSend = () => {
    setMailTitle("");
    setMailContent("");
    setBoldEnabled(false);
    setItalicEnabled(false);
    setSelectedImage(null);

    onClose();
    console.log(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-[95%] md:w-[80%] lg:w-[40%] h-[55%] md:h-[65%] lg:h-[80%] relative">
        <div className="flex justify-between">
          <h2 className="text-2xl">Reply Issue</h2>
          <img
            src={CancelReport}
            alt=""
            onClick={onClose}
            className="cursor-pointer"
          />
        </div>
        <input
          type="text"
          placeholder="Title of the mail"
          value={mailTitle}
          onChange={handleTitleChange}
          className="w-[100%] my-6 font-semibold rounded-md h-12"
        />
        <div
          contentEditable={true}
          placeholder="Type your mail here..."
          onInput={handleContentChange}
          style={{
            fontWeight: boldEnabled ? "bold" : "normal",
            fontStyle: italicEnabled ? "italic" : "normal",
          }}
          className="w-[100%] h-[70%] rounded-md relative p-2 border border-gray-300"
        >
          {mailContent}

          {selectedImage && (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Uploaded Image"
              className="max-h-[50%] w-[50%]"
            />
          )}
        </div>

        <div className="flex absolute bottom-[14%] left-6">
          <img
            src={Bold}
            alt=""
            className={`mr-4 ${boldEnabled ? "w-6 shadow-lg" : ""}`}
            onClick={handleBoldToggle}
          />
          <img src={Italics} alt="" onClick={handleItalicToggle} />

          <div className="mx-4">
            <label htmlFor="imageUpload">
              <img
                src={Gallery}
                alt="Upload Image"
                className="cursor-pointer"
              />
            </label>
            <input
              id="imageUpload"
              type="file"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="absolute bottom-0 right-0 flex items-center justify-center m-4 bg-primary rounded-md px-6">
          <CustomButton
            type="button"
            text="Send Mail"
            width="110px"
            bgColor="#6C1EEB"
            hover= "#3944BC"
            onClick={handleMailSend}
          />
          <img src={Arrow} alt="" className="h-[15px]" />
        </div>
      </div>
    </div>
  );
}

export default ReplyComponent;
