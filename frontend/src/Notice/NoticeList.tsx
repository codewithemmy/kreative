import React, { useState, useContext, useEffect } from "react";
import View from "../assets/viewmodal.png";
import dayjs from "dayjs";
import Edit from "../assets/edit.svg";
import Delete from "../assets/delete.svg";
import { Context } from "../context/Context";
import ApiAuth from "../api/ApiAuth";
import { errorNotifier, successNotifier } from "../utilities/Toast";
import EditEmail from "./editNotice/EditEmail";
import EditAnnouncement from "./editNotice/EditAnnouncement";
import EditNews from "./editNotice/EditNewsletter";
import EditAssignment from "./editNotice/EditAssignment";
import Spinner from "../utilities/Spinner";
import NoticeDetails from "./NoticeDetails";
import CustomModal from "../utilities/CustomModal";

interface NoticeListProps {
  data: {
    _id: string;
    title: string;
    content: string;
    notice: string;
    noticeType: string;
    accountType: string;
    createdAt: string;
  }[];
  isLoading: boolean;
}

function NoticeList({ data, isLoading }: NoticeListProps) {
  const [selectedNoticeId, setSelectedNoticeId] = useState<{
    _id: string;
    title: string;
    content: string;
    notice: string;
    noticeType: string;
    accountType: string;
    createdAt: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { adminAccess } = useContext(Context);
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = async (noticeId: string) => {
    try {
      await ApiAuth.delete(`/admin/notice/${noticeId}`, {
        headers: {
          Authorization: "Bearer " + adminAccess?.userToken,
        },
      });
      successNotifier("User deleted successfully");
    } catch (error) {
      errorNotifier("Error deleting notice");
    } finally {
      setShowModal(false);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const handleDetailsClose = () => {
    setShowDetailsModal(false);
  };

  const handleOpenEdit = () => {
    setShowEdit(true);
  };

  const handleCloseEdit = (): void => {
    setShowEdit(false);
  };

  const truncateMessage = (message: string, maxLength: number) => {
    if (message?.length > maxLength) {
      return message.substring(0, maxLength) + "...";
    }
    return message;
  };

  const renderEditComponent = () => {
    if (selectedNoticeId) {
      const noticeType = selectedNoticeId.noticeType;

      switch (noticeType) {
        case "emailSms":
          return (
            <EditEmail onClose={handleCloseEdit} selectedAccount={noticeType} />
          );
        case "announcement":
          return (
            <EditAnnouncement
              onClose={handleCloseEdit}
              selectedAccount={noticeType}
            />
          );
        case "newsLetter":
          return (
            <EditNews onClose={handleCloseEdit} selectedAccount={noticeType} />
          );
        case "assignment":
          return (
            <EditAssignment
              onClose={handleCloseEdit}
              selectedAccount={noticeType}
            />
          );
        default:
          return null;
      }
    }
    return null;
  };

  return (
    <div className="px-2">
      <table className="table-auto w-full pt-4">
        <thead>
          <tr className="text-left">
            <th className="w-[30%] text-[14px]">Announcements</th>
            <th className="w-[20%] text-[14px] text-center">Notice Type</th>
            <th
              className={`w-[20%] text-[14px] text-center ${
                window.innerWidth <= 640 ? "hidden sm:table-cell" : ""
              }`}
            >
              Account Type
            </th>
            <th
              className={`w-[15%] text-[14px]  ${
                window.innerWidth <= 640 ? "hidden sm:table-cell" : ""
              }`}
            >
              Date Created
            </th>
            <th className="w-[15%] text-[14px] text-center">Action</th>
          </tr>
        </thead>
        <>
          {isLoading ? (
            <tbody>
              <tr className="">
                <td colSpan={7} className="text-center">
                  <Spinner />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {data?.map((datum, index) => (
                <tr
                  key={datum?._id}
                  className={`text-[12px] h-[70px] ${
                    index !== data.length - 1
                      ? "border-b bg-[#F9FBFB]"
                      : "bg-white"
                  }`}
                >
                  <td className="w-[30%] ">
                    <div className="px-2">
                      <h2 className="text-[#4E4C4C] w-[80%] md:w-[90%] lg:w-full">
                        {truncateMessage(datum.title, 60)}
                      </h2>
                      <h2 className="text-[#4E4C4C] w-[80%] md:w-[90%] lg:w-full">
                        {truncateMessage(datum.content, 60)}
                      </h2>
                    </div>
                  </td>

                  <td className="w-[20%] text-[#4E4C4C] text-center">
                    {datum?.noticeType}
                  </td>
                  <td
                    className={`w-[20%] text-[#4E4C4C] text-center ${
                      window.innerWidth <= 640 ? "hidden sm:table-cell" : ""
                    }`}
                  >
                    {datum?.accountType}
                  </td>
                  <td
                    className={`w-[15%] text-[#4E4C4C] ${
                      window.innerWidth <= 640 ? "hidden sm:table-cell" : ""
                    }`}
                  >
                    {dayjs(datum?.createdAt).format("DD MMM YYYY")}
                  </td>
                  <td className="w-[15%] text-center">
                    <div className="flex justify-center items-center">
                      <button
                        className="bg-transparent border-none mr-2 md:mr-3 cursor-pointer"
                        onClick={() => {
                          setShowDetailsModal(true);
                          setSelectedNoticeId(datum);
                        }}
                      >
                        <img
                          src={View}
                          alt=""
                          className="w-4 md:w-5 h-4 md:h-5"
                        />
                      </button>
                      <img
                        src={Edit}
                        alt=""
                        className="cursor-pointer mr-2 w-4 md:w-5 h-4 md:h-5"
                        onClick={() => {
                          setSelectedNoticeId(datum);
                          handleOpenEdit();
                        }}
                      />
                      <img
                        src={Delete}
                        alt=""
                        className="cursor-pointer w-4 md:w-5 h-4 md:h-5"
                        onClick={() => {
                          setSelectedNoticeId(datum);
                          setShowModal(true);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </>
      </table>
      {showModal && selectedNoticeId && (
        <CustomModal
          onConfirm={handleDelete}
          onCancel={handleModalCancel}
          datum={selectedNoticeId}
          action={"delete"}
          type={"notice"}
        />
      )}
      {showDetailsModal && selectedNoticeId && (
        <NoticeDetails
          onCloseModal={handleDetailsClose}
          datum={selectedNoticeId}
        />
      )}
      {showEdit && renderEditComponent()}
    </div>
  );
}

export default NoticeList;
