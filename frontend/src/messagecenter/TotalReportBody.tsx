// import React, { useState, useEffect } from "react";
// import ViewReport from "./ViewReport";
// import View from "../assets/viewmodal.png";
// import Avartar from "../assets/avartar.jpeg";
// import dayjs from "dayjs";
// import Spinner from "../utilities/Spinner";

// interface ReportItem {
//   id: string;
//   name: string;
//   email: string;
//   image: string;
// }

// interface ReportData {
//   reportId: string;
//   reporter: ReportItem[];
//   reportedUser: ReportItem[];
//   subject: string;
//   createdAt: string;
//   topic: string;
// }

// interface TotalReportBodyProps {
//   Report: ReportData[] | null;
//   isLoading: boolean;
//   searchTerm: string;
// }

// function TotalReportBody({
//   Report,
//   isLoading,
//   searchTerm,
// }: TotalReportBodyProps) {
//   const [filteredReport, setFilteredReport] = useState<ReportData[] | null>(
//     null
//   );

//   useEffect(() => {
//     if (!Report) return; // Skip if Report is null
//     if (searchTerm === "") {
//       setFilteredReport(null);
//     } else {
//       const searchTermLowerCase = searchTerm.toLowerCase();
//       const filtered = Report.filter((item) => {
//         const name = (item.reporter[0]?.name || "").toLowerCase();
//         return name.includes(searchTermLowerCase);
//       });

//       setFilteredReport(filtered.length > 0 ? filtered : null);
//     }

//   }, [Report, searchTerm]);

//   const [showModal, setShowModal] = useState<boolean>(false);
//   const [selectedData, setSelectedData] = useState<ReportData | null>(null);

//   const handleModalClose = () => {
//     setShowModal(false);
//     setSelectedData(null);
//   };

//   const handleViewImageClick = (item: ReportData) => {
//     setSelectedData(item);
//     setShowModal(true);
//   };

//   const truncateMessage = (message: string, maxLength: number) => {
//     if (message.length > maxLength) {
//       return message.substring(0, maxLength) + "...";
//     }
//     return message;
//   };

//   return (
//     <div className="py-2 rounded-b-md bg-white px-6">
//       <table className="table-auto w-full">
//         <thead>
//           <tr className="text-left h-[60px]">
//             <th className="text-[#505050] text-[12px] md:text-[14px]">
//               Reporter
//             </th>
//             <th
//               className={`text-[#505050] text-[12px] md:text-[14px] ${
//                 window.innerWidth <= 640 ? "hidden sm:table-cell" : ""
//               }`}
//             >
//               Report ID
//             </th>
//             <th
//               className={`text-[#505050] text-[12px] md:text-[14px] ${
//                 window.innerWidth <= 640 ? "hidden sm:table-cell" : ""
//               }`}
//             >
//               Reported User
//             </th>
//             <th className="text-[#505050] text-[12px] md:text-[14px]">
//               Subject
//             </th>
//             <th className="text-[#505050] text-[12px] md:text-[14px]">
//               Sent Date
//             </th>
//             <th className="text-end text-[#505050] text-[12px] md:text-[14px] pr-6">
//               Action
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {isLoading ? (
//             <tr>
//               <td colSpan={6} className="text-center">
//                 <Spinner />
//               </td>
//             </tr>
//           ) : (
//             <>
//               {filteredReport ? (
//                 filteredReport.map((item, index) => (
//                   <tr
//                     key={index}
//                     className={`${
//                       index % 2 === 0 ? "bg-[#F9FBFB]" : ""
//                     } h-[90px]`}
//                   >
//                     <td className="text-[12px] text-left">
//                       <div className="flex items-center">
//                         <div>
//                           <img
//                             src={item.reporter[0]?.image || Avartar}
//                             alt={item.reporter[0]?.name}
//                             className="rounded-[50%] shadow-sm mr-1 h-10 w-10"
//                           />
//                         </div>
//                         <div>
//                           <h2 className="font-bold text-[12px] text-start">
//                             {item.reporter[0]?.name}
//                           </h2>
//                           <div
//                             style={{ fontSize: "10px" }}
//                             className="text-[#4E4C4C"
//                           >
//                             {item.reporter[0]?.email}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td
//                       className={`w-[15%] text-[12px] text-[#222222] ${
//                         window.innerWidth <= 640 ? "hidden sm:table-cell" : ""
//                       }`}
//                     >
//                       {item.reportId}
//                     </td>
//                     <td
//                       className={`w-[15%] text-[12px] ${
//                         window.innerWidth <= 640 ? "hidden sm:table-cell" : ""
//                       }`}
//                     >
//                       {item.reportedUser[0]?.name}
//                     </td>
//                     <td className="w-[20%] text-[12px]">
//                       {truncateMessage(item.subject, 30)}
//                     </td>
//                     <td className="text-[12px] w-[20%] text-[#8A8A8A]">
//                       {dayjs(item.createdAt).format("DD MMM YYYY")}
//                     </td>
//                     <td className="w-[10%] pr-4 text-right">
//                       <button
//                         className="bg-transparent border-none cursor-pointer"
//                         onClick={() => handleViewImageClick(item)}
//                       >
//                         <img src={View} alt="" className="w-6 h-6" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={6} className="text-center">
//                     No data found
//                   </td>
//                 </tr>
//               )}
//             </>
//           )}
//         </tbody>
//       </table>
//       {showModal && selectedData && (
//         <ViewReport onCloseModal={handleModalClose} datum={selectedData} />
//       )}
//     </div>
//   );
// }

// export default TotalReportBody;
import React, { useState } from "react";
import ViewReport from "./ViewReport";
import View from "../assets/viewmodal.png";
import Avartar from "../assets/avartar.jpeg";
import dayjs from "dayjs";
import Spinner from "../utilities/Spinner";

interface Reporter {
  name: string;
  profileImage: string;
}

interface ReportData {
  reportId: string;
  reportedUser: string;
  reporterId: Reporter;
  name: string;
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

interface TotalReportBodyProps {
  Report: ReportData[] | null;
  isLoading: boolean;
}

function TotalReportBody({ Report, isLoading }: TotalReportBodyProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<ReportData | null>(null);

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedData(null);
  };

  const handleViewImageClick = (item: ReportData) => {
    setSelectedData(item);
    setShowModal(true);
  };

  const truncateMessage = (message: string, maxLength: number) => {
    if (message.length > maxLength) {
      return message.substring(0, maxLength) + "...";
    }
    return message;
  };

  return (
    <div className="py-2 rounded-b-md bg-white px-6">
      <table className="table-auto w-full">
        <thead>
          <tr className="text-left h-[60px]">
            <th className="text-[#505050] text-[12px] md:text-[14px]">
              Reporter
            </th>
            <th
              className={`text-[#505050] text-[12px] md:text-[14px] ${
                window.innerWidth <= 640 ? "hidden sm:table-cell" : ""
              }`}
            >
              Report ID
            </th>
            <th className="text-[#505050] text-[12px] md:text-[14px]">
              Reported User
            </th>
            <th className="text-[#505050] text-[12px] md:text-[14px]">
              Subject
            </th>
            <th className="text-[#505050] text-[12px] md:text-[14px]">
              Sent Date
            </th>
            <th className="text-end text-[#505050] text-[12px] md:text-[14px] pr-6">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="text-center">
                <Spinner />
              </td>
            </tr>
          ) : (
            <>
              {Report && Report.length > 0 ? (
                Report.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-[#F9FBFB]" : ""
                    } h-[90px]`}
                  >
                    <td className="text-[12px] text-left">
                      <div className="flex items-center gap-1">
                        <div>
                          <img
                            src={item.reporterId.profileImage || Avartar} // Access profileImage from reporterId
                            alt={item.reporterId.name} // Access name from reporterId
                            className="rounded-[50%] shadow-sm mr-1 h-10 w-10"
                          />
                        </div>
                        <div>
                          <h2 className="font-bold text-[12px] text-start">
                            {item.reporterId.name}{" "}
                            {/* Ensure this displays the name */}
                          </h2>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`w-[15%] text-[12px] text-[#222222] ${
                        window.innerWidth <= 640 ? "hidden sm:table-cell" : ""
                      }`}
                    >
                      {item.reportId}
                    </td>
                    <td
                      className={`w-[15%] text-[12px] text-[#222222] pr-6 ${
                        window.innerWidth <= 640 ? "hidden sm:table-cell" : ""
                      }`}
                    >
                      {item.reporterId.name}
                    </td>
                    <td className="w-[20%] text-[12px]">
                      {truncateMessage(item.subject, 30)}
                    </td>
                    <td className="text-[12px] w-[20%] text-[#8A8A8A]">
                      {dayjs(item.createdAt).format("DD MMM YYYY")}
                    </td>
                    <td className="w-[10%] pr-4 text-right">
                      <button
                        className="bg-transparent border-none cursor-pointer"
                        onClick={() => handleViewImageClick(item)}
                      >
                        <img src={View} alt="View" className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No Report Found.
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
      {/* {showModal && selectedData && (
        <ViewReport onCloseModal={handleModalClose} datum={selectedData} />
      )} */}
    </div>
  );
}

export default TotalReportBody;
