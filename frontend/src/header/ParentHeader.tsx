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

type TermOption = "first" | "second" | "third";
// type YearOption =
//   | "2021"
//   | "2022"
//   | "2023"
//   | "2024"
//   | "2025"
//   | "2026"
//   | "2027"
//   | "2028"
//   | "2029"
//   | "2030"
//   | "2031"
//   | "2032";

const ParentHeader: React.FC = () => {
  const {
    teacherTab,
    loadUserDetails,
    sent,
    setSent,
    access,
    userDetails,
    selectedTerm,
    setSelectedTerm,
  }: // selectedYear,
  // setSelectedYear,
  ContextValue = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showNotificationModal, setShowNotificationModal] =
    useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<string>(
    userDetails?.[0]?.profileImage || avatar
  );

  const profilePicture = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    ApiAuth.patch(`/student/update/${access?.userId}`, formData, {
      headers: {
        Authorization: `Bearer ${access?.userToken}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setIsLoading(false);
        loadUserDetails();
        setSent(!sent);
        successNotifier("Image Uploaded Successfully!");
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error changing profile image:", error);
      });
  };

  useEffect(() => {
    loadUserDetails();
    setTimeout(() => {
      setProfilePic(userDetails?.[0]?.profileImage);
    }, 1000);
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

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTerm(e.target.value as TermOption);
  };

  // const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedYear(e.target.value as YearOption);
  // };

  return (
    <nav className="w-full border mt-18 md:mt-18 lg:mt-0 flex flex-col md:flex-row gap-3 md:justify-between md:items-center py-2 px-2 lg:px-5">
      <div className="flex items-center justify-start gap-x-3">
        {teacherTab ? (
          <h2 className="text-lg md:text-xl lg:text-2xl text-primary font-medium shadow-inherit py-3 px-5">
            {teacherTab === "home" &&
              userDetails?.[0]?.name &&
              "Welcome Back, " + userDetails?.[0].name.split(" ")[0] + "!"}
          </h2>
        ) : (
          ""
        )}
        <select
          id="termSelect"
          className="text-primary border rounded-md p-1 border-primary hover:text-hover outline-primary text-xs md:text-sm"
          value={selectedTerm}
          onChange={handleTermChange}
        >
          <option value="first">First Term</option>
          <option value="second">Second Term</option>
          <option value="third">Third Term</option>
        </select>
        {/* <select
          id="yearSelect"
          className="text-primary border rounded-md p-1 border-primary hover:text-hover outline-primary text-xs md:text-sm"
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
          <option value="2028">2028</option>
          <option value="2029">2029</option>
          <option value="2030">2030</option>
          <option value="2031">2031</option>
          <option value="2032">2032</option>
        </select> */}
      </div>
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
          <p className="text-xs">{userDetails?.[0]?.name}</p>
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

export default ParentHeader;
