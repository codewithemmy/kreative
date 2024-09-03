import React, { useState, useEffect, useContext } from "react";
import User from "../../../../assets/user.png";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import Sidebar from "../../components/Sidebar";
import TotalReportBody from "../../../../messagecenter/TotalReportBody";
import Pagination from "../../../../utilities/Pagination";
import AdminHeader from "../../../../header/AdminHeader";
import Spinner from "../../../../utilities/Spinner";

// interface ReportItem {
//   id: string;
//   name: string;
//   email: string;
//   image: string;
// }
interface Reporter {
  name: string;
  profileImage: string;
}

interface Report {
  reportId: string;
  reportedUser: string;
  reporterId: Reporter;
  name: string;
  profileImage: string;
  subject: string;
  createdAt: string;
  image: string;
  message: string;
  updatedAt: string;
  response: {
    message: string;
    title: string;
  };
  _id: string;
}

const MessageCenter: React.FC = () => {
  const { adminAccess, userDetails } = useContext(Context);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [reports, setReports] = useState<Report[]>([]);
  const [usersPerPage] = useState<number>(5);
  // const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.get(
        // `/admin/report-analysis?sort=desc`, `
        `/report?reporterId=660047cf07b13d61a54900e3`,
        {
          headers: {
            Authorization: "Bearer " + adminAccess?.userToken,
          },
        }
      );
      setIsLoading(false);
      setReports(response?.data?.data);
      console.log(response?.data?.data);
    } catch (error) {
      setIsLoading(false);
    }
  };

  // const searchUsers = async (searchKeyword: string) => {
  //   const keyword = searchKeyword?.toLowerCase();
  //   setIsLoading(true);
  //   try {
  //     const response = await ApiAuth.get(
  //       `/admin/report-analysis?search=${keyword}&from=${fromDate}&to=${toDate}`,
  //       {
  //         headers: {
  //           Authorization: "Bearer " + adminAccess?.userToken,
  //         },
  //       }
  //     );
  //     const { data } = response;
  //     setFilteredReports(data?.data);
  //   } catch (error) {
  //     console.log(error);
  //     setIsLoading(false);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchReports();
  //   searchUsers(searchKeyword);
  // }, [adminAccess?.userToken, fromDate, toDate]);
  useEffect(() => {
    fetchReports();
  }, [adminAccess?.userToken]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = reports?.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(reports?.length / usersPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const noMatchFound = reports?.length === 0;

  const renderNoMatchFound = () => {
    return (
      <div className="text-center text-primary font-medium mt-4">
        No Report Found.
      </div>
    );
  };

  return (
    <>
      <div className="md:flex min-h-full bg-[#F8F8F8] lg:px-4 lg:relative">
        <Sidebar />
        <div className="w-screen lg:w-[85%] lg:absolute lg:right-0 mt-24 lg:mt-0">
          <AdminHeader />
          <div className="p-6" style={{ zIndex: 999 }}>
            <h1 className="font-semibold text-xl md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl flex flex-grow pb-4">
              Reports
            </h1>
            <div className="my-6 flex flex-col md:flex-row justify-between">
              <div className="w-[100%] md:w-[28%] bg-white px-8 py-4 shadow-md rounded-md flex flex-col items-center gap-3 my-4 md:my-0 h-[160px]">
                <div className="flex items-center justify-center  w-full h-[60px]">
                  <img src={User} alt="" className="mr-6" />
                  <p className="text-xs text-center text-[#535353]">
                    Total Reports Messages
                  </p>
                </div>
                <h2 className="text-[30px] font-bold">{reports?.length}</h2>
              </div>

              <div className="w-[100%] md:w-[28%] bg-white px-2 lg:px-8 py-4 shadow-md rounded-md flex flex-col justify-center items-center gap-3 my-4 md:my-0 h-[160px]">
                <div className="flex items-center justify-center w-full h-[60px]">
                  <img src={User} alt="" className="mr-6" />
                  <p className="text-xs text-[#535353]">Search Users</p>
                </div>
                <div className="flex items-center justify-center w-full">
                  <input
                    type="text"
                    placeholder="Type min of two letters"
                    value={searchKeyword}
                    onChange={(e) => {
                      setSearchKeyword(e.target.value);
                      // searchUsers(searchKeyword);
                    }}
                    className="p-2 border border-gray-300 w-[80%] md:w-[100%] lg:w-[90%] focus:outline-none focus:border-hover rounded-[30px] ::placeholder text-sm ::placeholder text-center"
                  />
                </div>
              </div>

              <div className="w-[100%] md:w-[28%] bg-white px-8 py-4 h-[160px] shadow-md rounded-md flex flex-col items-center gap-3 my-4 md:my-0 ">
                <div className="flex items-center justify-center w-full h-[60px] ">
                  <p className="text-sm lg:text-lg font-bold">Filter By Date</p>
                </div>
                <div className="flex flex-col lg:flex-row justify-around items-center gap-4 w-[100%] ">
                  <input
                    type="date"
                    placeholder="from"
                    value={fromDate}
                    onChange={(event) => setFromDate(event.target.value)}
                    className="w-[70%] md:w-[100%] lg:w-[50%] px-4 md:px-2 py-2 md:py-1 rounded-lg border border-gray-300 focus:outline-none focus:border-hover"
                  />
                  <input
                    type="date"
                    placeholder="to"
                    value={toDate}
                    onChange={(event) => setToDate(event.target.value)}
                    className="w-[70%] md:w-[100%] lg:w-[50%] px-4 md:px-2 py-2 md:py-1 rounded-lg border border-gray-300 focus:outline-none focus:border-hover"
                  />
                </div>
              </div>
            </div>
            <h4 className="my-6 font-semibold text-[18px]">Reports List</h4>
            {isLoading ? (
              <Spinner />
            ) : noMatchFound ? (
              renderNoMatchFound()
            ) : (
              <TotalReportBody
                // searchTerm={searchKeyword}
                Report={currentUsers}
                isLoading={isLoading}
              />
            )}
            <Pagination
              currentPage={currentPage}
              noPerPage={usersPerPage}
              total={reports.length ?? 0}
              paginate={paginate}
              pageName={"Reports"}
              noMatch={noMatchFound}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageCenter;
