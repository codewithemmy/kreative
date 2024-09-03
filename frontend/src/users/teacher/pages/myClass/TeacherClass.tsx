import React, { useContext, useEffect, useState } from "react";
import TeacherSidebar from "../../components/TeacherSidebar";
import Header from "../../../../header/Header";
import { FaEdit, FaPlus } from "react-icons/fa";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import placeholder from "../../../../assets/placeholder.png";
import imager from "../../../../assets/useroverview.png";
import { useNavigate } from "react-router-dom";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import Spinner from "../../../../utilities/Spinner";
import SelectTeacherNotice from "../../components/myClass/SelectTeacherNotice";
import TimeTableForm from "../../components/myClass/TimeTableForm";
import EditTimeTableForm from "../../components/myClass/EditTimeTableForm";
import CustomModal from "../../../../utilities/CustomModal";

interface ApprovalData {
  classId: string | undefined;
  year: string;
  schoolTerm: string;
}
export interface Period {
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  type: string;
  _id: string;
}

interface TimeTableData {
  classId: string;
  createdAt: string;
  period: Period[];
  updatedAt: string;
  __v: number;
  _id: string;
}

const TeacherClass: React.FC = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classDetails, setClassDetails] = useState<any | null>(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { access, selectedTerm, selectedYear, sent } = useContext(Context);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [timeTable, setTimeTable] = useState<TimeTableData[]>([]);
  const [isPrintable, setIsPrintable] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedTimeTableDay, setSelectedTimeTableDay] = useState<string>("");

  const getClassDetails = async () => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.get(`/class?_id=${access?.classId}`, {
        headers: {
          Authorization: "Bearer " + access?.userToken,
        },
      });
      setIsLoading(false);
      setClassDetails(response.data.data);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleGetTimeTable = async () => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.get(
        `/time-table?classId=${access?.classId}`,
        {
          headers: {
            Authorization: `Bearer ${access?.userToken}`,
          },
        }
      );
      console.log(response.data);
      setTimeTable(response.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleUpdateResultStatus = async () => {
    const data: ApprovalData = {
      classId: access?.classId,
      schoolTerm: selectedTerm,
      year: selectedYear,
    };
    setIsModalOpen(false);
    setIsApproving(true);
    try {
      const response = await ApiAuth.post(`/approval-result`, data, {
        headers: {
          Authorization: "Bearer " + access?.userToken,
        },
      });
      successNotifier("Class result now available!");
      setIsApproving(false);
      setIsPrintable(true);
    } catch (error: any) {
      setIsApproving(false);
      errorNotifier("Result Already made available!");
    }
  };

  const handleGetSubjects = async () => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.get(
        `/subject?classId=${access?.classId}`,
        {
          headers: {
            Authorization: "Bearer " + access?.userToken,
          },
        }
      );
      setIsLoading(false);
      setSubjects(response?.data.data);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // handleGetRecords();
    handleGetTimeTable();
    handleGetSubjects();
    getClassDetails();
  }, []);

  useEffect(() => {
    // handleGetRecords();
    handleGetTimeTable();
    handleGetSubjects();
    getClassDetails();
  }, [sent]);

  const navigateToClassStudents = () => {
    navigate(`/teacher/students`, {});
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenApproval = () => {
    setIsModalOpen(true);
  };

  const handleCloseApproval = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleSelectTimeTableDay = (recordId: string) => {
    setSelectedTimeTableDay(recordId === selectedTimeTableDay ? "" : recordId);
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots: string[] = Array.from(
    new Set(
      timeTable.flatMap((item) =>
        item.period.map((period) => `${period.startTime}-${period.endTime}`)
      )
    )
  ).sort();

  const getPeriodsByDayAndTime = (
    day: string,
    timeSlot: string
  ): Period | null => {
    const period = timeTable
      .flatMap((item) => item.period)
      .find(
        (p) =>
          p.day.toLowerCase() === day.toLowerCase() &&
          `${p.startTime}-${p.endTime}` === timeSlot
      );
    return period || null;
  };

  return (
    <div className="md:flex min-h-full bg-[#F8F8F8] lg:px-4 lg:relative">
      <TeacherSidebar />
      <div className="w-screen lg:w-[85%] lg:absolute lg:right-0 mt-24 lg:mt-0 px-4">
        <Header />
        {isLoading ? (
          <div className="w-full flex justify-center items-center h-[400px]">
            <Spinner />
          </div>
        ) : (
          <>
            <section className="w-full px-2 md:px-8 pb-12">
              <div className="flex flex-wrap gap-3 justify-between items-center p-2 md:p-8 lg:p-12 mt-3">
                <h1 className="text-primary font-semibold text-xl md:text-2xl flex">
                  {classDetails?.[0]?.name}
                </h1>
                <div className="flex items-center">
                  <div className="mr-2">Make result printable</div>
                  {isApproving ? (
                    <Spinner />
                  ) : (
                    <div
                      onClick={() => handleOpenApproval()}
                      className={`w-[40px] h-5 rounded-full border-2 cursor-pointer px-1 flex items-center ${
                        isPrintable
                          ? "bg-primary border-primary justify-end"
                          : "bg-white border-gray-400 justify-start"
                      }`}
                    >
                      {isPrintable ? (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      ) : (
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full md:w-[90%] lg:w-[80%] bg-white rounded-xl shadow-lg box-border p-2 mx-auto md:p-8">
                <div className="w-full mx-auto md:w-[80%] lg:w-[60%] h-[300px] md:h-[400px] rounded-lg mb-8 overflow-hidden">
                  <img
                    className="w-full h-full"
                    src={classDetails?.[0]?.image || placeholder}
                    alt={classDetails?.[0]?.name}
                  />
                </div>

                <div className="flex gap-4 justify-between items-center py-3 w-full md:w-[80%] mx-auto lg:w-[50%]">
                  <h1 className="text-gray-500 font-semibold text-lg md:text-xl lg:text-2xl">
                    {classDetails?.[0]?.name}
                  </h1>
                  <span className="md:text-lg text-primary">
                    {classDetails?.[0]?.tag}
                  </span>
                </div>

                <div className="mt-4 text-sm font-light text-hover text-justify">
                  {classDetails?.[0]?.address}
                </div>

                <div className="flex flex-col items-center mt-4">
                  <button
                    onClick={() => navigateToClassStudents()}
                    className="flex flex-row items-center"
                  >
                    <div className="flex">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={imager}
                        alt=""
                      />
                      <img
                        className="w-8 h-8 rounded-full"
                        src={imager}
                        alt=""
                      />
                      <img
                        className="w-8 h-8 rounded-full"
                        src={imager}
                        alt=""
                      />
                      <img
                        className="w-8 h-8 rounded-full"
                        src={imager}
                        alt=""
                      />
                      <h3 className="text-lg pl-8">
                        {classDetails?.[0]?.studentId?.length} Students
                      </h3>
                    </div>
                  </button>

                  {classDetails?.[0]?.teacherId?.length > 0 && (
                    <button className="flex flex-row items-center">
                      <div className="text-left mt-4">
                        {classDetails?.[0]?.teacherId?.[1]
                          ? "Teachers:"
                          : "Teacher:"}{" "}
                        {classDetails?.[0]?.teacherId?.[0]?.name}
                        {classDetails?.[0]?.teacherId?.[1] ? "," : ""}{" "}
                        {classDetails?.[0]?.teacherId?.[1]?.name}
                        {classDetails?.[0]?.teacherId?.[2] ? "," : ""}{" "}
                        {classDetails?.[0]?.teacherId?.[2]?.name}
                        {classDetails?.[0]?.teacherId?.[3] ? "," : ""}{" "}
                        {classDetails?.[0]?.teacherId?.[3]?.name}
                        {classDetails?.[0]?.teacherId?.[4] ? "," : ""}{" "}
                        {classDetails?.[0]?.teacherId?.[4]?.name}
                      </div>{" "}
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-8 md:px-16">
                <div className="flex flex-wrap gap-4">
                  {subjects?.map((subject) => (
                    <div key={subject?._id} className="relative">
                      <button className="border border-primary rounded-md py-1 px-2 text-primary">
                        {subject?.name}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            {/* <div className="w-full flex items-center justify-end mb-[10px] mt-[20px] p-1">
           
            </div> */}
            {timeTable.length > 0 ? (
              <div>
                <div className="flex justify-between items-center w-full border-[.5px] border-[#DBDBDB] rounded-sm p-1">
                  <div className="">
                    <div className="text-[14px] md:text-[18px]">Timetable</div>
                  </div>
                  {/* <button
                    onClick={handleOpenEditModal}
                    className="flex justify-between items-center w-[132px] h-[35px] rounded-md bg-[#FFFFFF] text-[#CC400C] text-[12px] font-[400] border-[1.5px] p-[12px] border-[#CC400C] "
                  >
                    <div className="text-[#CC400C] ">
                      <FaEdit />
                    </div>{" "}
                    <div>Edit Timetable</div>
                  </button> */}
                  <button
                    onClick={handleOpenModal}
                    className="flex justify-between items-center w-[131px] h-[40px] rounded-md bg-[#EB5017] text-[#FFFFFF] p-[12px] text-[13px] font-[400] "
                  >
                    <div className="text-white ">
                      <FaPlus />
                    </div>
                    <div>Add Timetable</div>
                  </button>
                </div>
                <div className="table-container w-full overflow-x-auto flex flex-col shrink-0 p-1">
                  <table className="shrink-0 w-full pt-4 border border-[#535353] mt-3">
                    <thead className="w-full shrink-0 border border-[#535353]">
                      <tr className="flex items-center justify-center text-left gap-x-4 w-full text-[#535353] text-[12px] shrink-0 pl-1">
                        <th className="w-[90px] lg:w-[97px] shrink-0">Day</th>
                        {timeSlots.map((timeSlot, index) => (
                          <th
                            key={index}
                            className="w-[90px] lg:w-[97px] shrink-0 py-3"
                          >
                            {timeSlot}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="w-full shrink-0">
                      {daysOfWeek.map((day) => (
                        <tr
                          key={day}   onClick={() =>
                            handleSelectTimeTableDay(day)
                          }
                          className="flex items-center justify-center text-left gap-x-4 w-full text-[#535353] shrink-0 font-thin text-[12px] pl-1"
                        >
                          <td className="w-[90px] lg:w-[97px] shrink-0">
                            {day}
                          </td>
                          {timeSlots.map((timeSlot) => (
                            <td
                              key={timeSlot}
                              className="w-[90px] lg:w-[97px] shrink-0 py-3"
                            >
                              {getPeriodsByDayAndTime(day, timeSlot)?.subject ||
                                "No period"}
                            </td>
                          ))}
                          <td className="w-[90px] lg:w-[97px] shrink-0">
                            <button
                              onClick={handleOpenEditModal}
                              className="text-primary bg-[#FEF6F3] rounded-md"
                              disabled={!selectedTimeTableDay}
                            >
                              <FaEdit />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="w-full text-center text-primary font-semibold">
                No Time Table Yet
              </div>
            )}

            <button
              className="flex justify-between items-center h-[50px] rounded-md bg-[#EB5017] text-[#FFFFFF] p-[16px] my-[30px] text-[13px] font-[400] "
              onClick={handleOpen}
            >
              Post Assignment/Notice
            </button>
          </>
        )}
      </div>
      {showEditModal && (
        <EditTimeTableForm
          id={timeTable?.[0]?._id}
          subjects={subjects}
          onClose={handleCloseEditModal}
          timeTableDay={selectedTimeTableDay}
        />
      )}
      {open && <SelectTeacherNotice onClose={handleClose} />}
      {showModal && (
        <TimeTableForm subjects={subjects} onClose={handleCloseModal} />
      )}

      {isModalOpen && (
        <CustomModal
          id={access?.userId}
          action={"make"}
          type={"record available to parents"}
          onConfirm={() => handleUpdateResultStatus()}
          onCancel={handleCloseApproval}
        />
      )}
    </div>
  );
};

export default TeacherClass;
