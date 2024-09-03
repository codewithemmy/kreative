import { useState, useEffect, useContext } from "react";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import Sidebar from "../../components/Sidebar";
import AdminHeader from "../../../../header/AdminHeader";
import { FaUser } from "react-icons/fa";
import Pagination from "../../../../utilities/Pagination";
import SelectNotice from "../../../../Notice/SelectNotice";
import NoticeList from "../../../../Notice/NoticeList";

const Notices: React.FC = () => {
  const [notice, setNotice] = useState([]);
  const { adminAccess, userDetails } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const userData = filteredUsers.length > 0 ? filteredUsers : notice;
  const currentUsers = userData?.slice(indexOfFirstUser, indexOfLastUser);

  const handleGetNotice = async () => {
    try {
      const response = await ApiAuth.get(
        // `/admin/notice?sort=desc`,
        `/notice`,
        {
          headers: {
            Authorization: "Bearer " + adminAccess?.userToken,
          },
        }
      );
      setIsLoading(false);
      setNotice(response?.data?.notice);
    } catch (error) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    handleGetNotice();
    setFilteredUsers(notice);
  }, []);

  useEffect(() => {
    setFilteredUsers(notice);
  }, [notice]);

  const paginate = (pageNumber: any) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(filteredUsers.length / usersPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const handleOpen = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <div className="md:flex min-h-full bg-[#F8F8F8] lg:px-4 lg:relative">
      <Sidebar />
      <div className="w-screen lg:w-[85%] lg:absolute lg:right-0 mt-24 lg:mt-0">
        <AdminHeader />
        <div className="p-6" style={{ zIndex: 800 }}>
          <h1 className="font-semibold text-xl md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl flex flex-grow pb-4">
            Notices
          </h1>
          <div className="my-6 flex flex-col md:flex-row justify-between">
            <div className="w-[100%] md:w-[30%] lg:w-[28%] bg-white px-3 md:px-8 py-2 md:py-4 shadow-md rounded-md flex flex-col items-center gap-3 my-4 md:my-0 h-[160px]">
              <div className="flex items-center justify-center  w-full h-[60px]">
                <FaUser className="mr-10" />
                <p className="text-xs text-[#535353]">Total notices</p>
              </div>
              <h2 className="text-[30px] font-bold">{notice?.length || 0}</h2>
            </div>

            <div className="w-[100%] md:w-[30%] lg:w-[28%] bg-white px-2 py-4 h-[160px] shadow-md rounded-md flex flex-col items-center justify-center gap-3 my-4 md:my-0">
              <div className="flex items-center justify-center w-full h-[60px] p-4">
                <p className="text-[14px] text-center font-bold">
                  Create A New notice
                </p>
              </div>
              <div className="flex gap-4 w-full items-center justify-center">
                <button
                  className="bg-primary hover:bg-hover text-white p-2 text-[12px] rounded-[10px] w-[80%]"
                  onClick={handleOpen}
                >
                  Create notice
                </button>
              </div>
            </div>
          </div>
          <h4 className="my-8 font-bold text-[18px] text-[#383838]">
            Notice List
          </h4>
          <NoticeList data={currentUsers} isLoading={isLoading} />
          <Pagination
            currentPage={currentPage}
            noPerPage={usersPerPage}
            total={filteredUsers.length}
            paginate={paginate}
            pageName={"Notices"}
          />
          {openModal && <SelectNotice onClose={handleClose} />}
        </div>
      </div>
    </div>
  );
};

export default Notices;
