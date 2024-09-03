import React, { useState, useContext, useEffect } from "react";
import { Context, ContextValue } from "../context/Context";
import { BsQuestionLg } from "react-icons/bs";
import HelpCenterModal from "./HelpCenterModal";
import NotificationDetails from "./NotificationDetails";
import { MdNotificationsNone } from "react-icons/md";
import ApiAuth from "../api/ApiAuth";
import { successNotifier } from "../utilities/Toast";
import { FaEdit } from "react-icons/fa";
import avatar from "../assets/avartar.jpeg";

const AdminHeader: React.FC = () => {
  const {
    adminTab,
    loadAdminDetails,
    sent,
    setSent,
    adminAccess,
    adminDetails,
  }: ContextValue = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showNotificationModal, setShowNotificationModal] =
    useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<string>(
    adminDetails?.[0]?.image || avatar
  );

  const profilePicture = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    ApiAuth.patch(`/admin/${adminAccess?.userId}`, formData, {
      headers: {
        Authorization: `Bearer ${adminAccess?.userToken}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setIsLoading(false);
        loadAdminDetails();
        setSent(!sent);
        successNotifier("Image Uploaded Successfully!");
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error changing profile image:", error);
      });
  };

  useEffect(() => {
    loadAdminDetails();
    setProfilePic(adminDetails?.[0]?.image);
  }, [sent]);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleViewImageClick = () => {
    setShowModal(true);
  };

  const handleOpen = () => {
    setShowNotificationModal(true);
  };

  const handleClose = () => {
    setShowNotificationModal(false);
  };

  return (
    <nav className="w-full border mt-18 md:mt-18 lg:mt-0 flex flex-col md:flex-row gap-3 md:justify-between py-2 px-5 md:items-center">
      {adminTab ? (
        <h2 className="text-lg md:text-xl lg:text-2xl text-black p-2 md:p-8">
          {adminTab === "home" &&
            adminDetails?.[0]?.fullName &&
            "Welcome, " + adminDetails[0].fullName.split(" ")[0]}
        </h2>
      ) : (
        ""
      )}
      <div className="dash-header-left flex items-center gap-5 lg:gap-3 lg:space-x-6 p-2">
        <span
          className="bg-white rounded-full shadow-lg text-primary p-3 text-xs md:text-[16.5px] lg:text-2xl font-bold cursor-pointer"
          onClick={() => handleViewImageClick()}
        >
          {" "}
          <BsQuestionLg />{" "}
        </span>
        <span
          className="bg-white rounded-full shadow-md text-primary font-extrabold cursor-pointer"
          onClick={() => handleOpen()}
        >
          <MdNotificationsNone />
        </span>
        <label htmlFor="profile-pic" className="relative">
          <input
            onChange={profilePicture}
            className="hidden"
            type="file"
            accept="image/*"
            id="profile-pic"
          />
          <div className="overflow-hidden profile-pic flex justify-center items-center h-8 w-8 md:w-10 md:h-10 rounded-full bg-gray-400">
            <img className="w-full h-full" src={profilePic} alt="" />
            <FaEdit className="absolute bottom-0 right-0 text-white cursor-pointer bg-black rounded-full p-1" />
          </div>
        </label>
        <div>
          <p className="text-xs">{adminDetails?.[0]?.fullName}</p>
          {isLoading && (
            <p className="text-xs md:text-sm text-orange-700">
              updating <span className="text-primary">...</span>
            </p>
          )}
        </div>
      </div>
      {showModal && <HelpCenterModal onCloseModal={handleModalClose} />}
      {showNotificationModal && (
        <NotificationDetails onCloseModal={handleClose} />
      )}
    </nav>
  );
};

export default AdminHeader;
