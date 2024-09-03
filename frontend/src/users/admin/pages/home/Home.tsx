import React, { useContext, useEffect, useState } from "react";
import avatar from "../../../../assets/images/profile.png";
import {
  FaAward,
  FaBell,
  FaBookOpen,
  FaBookmark,
  FaCalculator,
  FaCalendar,
  FaCheckCircle,
  FaPercent,
  FaPlus,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import AdminHeader from "../../../../header/AdminHeader";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import Spinner from "../../../../utilities/Spinner";
import AdminChartSection from "../../components/adminchart/AdminChartSection";

const Home: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [studentList, setStudentList] = useState<any[]>([]);
  const [teachersList, setTeachersList] = useState<any[]>([]);
  const { adminAccess, sent, adminDetails, loadAdminDetails } =
    useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetTeachers = async () => {
    if (!adminDetails) {
      loadAdminDetails();
      return;
    }
    setIsLoading(true);
    try {
      const response =
        adminAccess?.accountType === "admin"
          ? await ApiAuth.get(`/user?branchId=${adminDetails?.[0]?.branchId}`, {
              headers: {
                Authorization: "Bearer " + adminAccess?.userToken,
              },
            })
          : await ApiAuth.get(`/user`, {
              headers: {
                Authorization: "Bearer " + adminAccess?.userToken,
              },
            });
      setIsLoading(false);
      setTeachersList(response?.data.data.data);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleGetStudents = async () => {
    if (!adminDetails) {
      loadAdminDetails();
      return;
    }
    setIsLoading(true);
    try {
      const response =
        adminAccess?.accountType === "admin"
          ? await ApiAuth.get(
              `/student?branchId=${adminDetails?.[0]?.branchId}`,
              {
                headers: {
                  Authorization: "Bearer " + adminAccess?.userToken,
                },
              }
            )
          : await ApiAuth.get(`/student`, {
              headers: {
                Authorization: "Bearer " + adminAccess?.userToken,
              },
            });
      setIsLoading(false);
      setStudentList(response?.data.data);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminDetails) {
      handleGetTeachers();
      handleGetStudents();
    }
  }, [adminDetails]);

  useEffect(() => {
    handleGetTeachers();
    handleGetStudents();
  }, []);

  useEffect(() => {
    handleGetTeachers();
    handleGetStudents();
  }, [sent]);

  const navigateToTeacher = () => {
    navigate(`/admin/teachers`);
  };

  const navigateToStudent = () => {
    navigate(`/admin/students`);
  };

  const cardData = [
    {
      icon: <FaUsers />,
      altText: "icon.png",
      text: "Total Students",
      amount: `${studentList?.length}`,
    },
    {
      icon: <FaCheckCircle />,
      altText: "icon.png",
      text: "Total Teachers",
      amount: !teachersList ? `0` : `${teachersList?.length}`,
    },
    {
      icon: <FaPercent />,
      altText: "icon.png",
      text: "Attendance Rate",
      amount: "92%",
    },
    {
      icon: <FaAward />,
      altText: "icon.png",
      text: "Overall Progress",
      amount: "75%",
    },
  ];

  return (
    <div className="md:flex min-h-full bg-[#F8F8F8] lg:px-4 lg:relative">
      <Sidebar />
      <div className="w-screen lg:w-[85%] lg:absolute lg:right-0 mt-24 lg:mt-0">
        <AdminHeader />
        <div className="w-full flex justify-start items-center my-4 pl-8">
          <div className="flex gap-x-5">
            <div
              onClick={() => setSelectedTab("overview")}
              className={`cursor-pointer text-[#101928] text-[16px] ${
                selectedTab === "overview" &&
                "font-bold border-b border-b-[#04326B] text-primary"
              }`}
            >
              Overview
            </div>
            <div
              onClick={() => setSelectedTab("quickActions")}
              className={`cursor-pointer text-[#101928] text-[16px] ${
                selectedTab === "quickActions" &&
                "font-bold border-b border-b-[#04326B] text-primary"
              }`}
            >
              Quick Actions
            </div>
          </div>
        </div>
        {selectedTab === "overview" && (
          <div className="p-2 md:p-6">
            <div className="flex flex-col md:flex-row justify-around items-center gap-[18px] flex-wrap mb-[20px] md:mb-[30px] mt-4">
              {cardData?.map((card, index) => (
                <div
                  key={index}
                  className="flex justify-start gap-x-[16px] items-center w-[95%] md:w-[240px] h-[106px] rounded-[8px] border-[1px] border-[#DBDBDB] p-[24px]"
                >
                  <div className=" w-[24px] h-[24px] text-primary ">
                    {card.icon}
                  </div>
                  <div>
                    <div className="text-[#101928]">{card.text}</div>
                    <div className="text-[#101928] text-[24px] font-medium">
                      {card.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-[10px] px-3 md:px-2 lg:px-1 shrink-0">
              <div className="w-full lg:w-[47%]">
                <div className="font-[500] text-[20px] md:text-[28px] font-inter leading-[33.6px] text-[#101928] mb-[30px]">
                  Teachers
                </div>
                <div>
                  {isLoading ? (
                    <Spinner />
                  ) : !teachersList || teachersList?.length === 0 ? (
                    <div className="mx-auto text-center my-5 w-full font-serif font-thin text-lg md:text-xl">
                      No teacher added yet
                    </div>
                  ) : (
                    teachersList?.slice(0, 2).map((teacher) => (
                      <div
                        key={teacher._id}
                        className="flex justify-between items-center w-full h-[84px] border-b-[.5px] border-b-[#DBDBDB] rounded-sm py-4 "
                      >
                        <div className="w-4/5 flex gap-x-[10px] shrink-0 items-center justify-start">
                          <div className="w-[50px] md:w-[64px] h-[50px] md:h-[64px] rounded-full overflow-hidden shrink-0">
                            <img
                              src={teacher.profileImage || avatar}
                              alt={teacher.name}
                              className="w-full h-full"
                            />
                          </div>
                          <div className="w-4/5">
                            <div className="w-full text-[15px] md:text-[18px] lg:text-[20px] font-medium">
                              {teacher.name}
                            </div>
                            <div className="w-full text-[10px] md:text-[12px] lg:text-[14px]">
                              {teacher.subject} Teacher
                            </div>
                          </div>
                        </div>
                        <div className="w-1/5 text-right lg:mr-2">
                          <div className="text-[12px] md:text-[14px] font-medium">
                            Attendance
                          </div>
                          <div className="text-[10px] md:text-[12px]">96%</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex justify-end items-center w-full my-3">
                  <button
                    onClick={navigateToTeacher}
                    className="border-b border-b-[#04326B] text-[#101928] text-[14px] md:text-[16px] hover:text-hover "
                  >
                    View All Teachers
                  </button>
                </div>
              </div>
              <div className="w-full lg:w-[47%]">
                <div className="font-[500] text-[20px] md:text-[28px] font-inter leading-[33.6px] text-[#101928] mb-[30px]">
                  Students
                </div>

                <div>
                  {isLoading ? (
                    <Spinner />
                  ) : !studentList || studentList?.length === 0 ? (
                    <div className="mx-auto text-center my-5 w-full font-serif font-thin text-lg md:text-xl">
                      No student added yet
                    </div>
                  ) : (
                    studentList?.slice(0, 2).map((student) => (
                      <div
                        key={student._id}
                        className="flex justify-between items-center w-full h-[84px] border-b-[.5px] border-b-[#DBDBDB] rounded-sm py-4 "
                      >
                        <div className="flex gap-x-[15px] shrink-0 items-center justify-start">
                          <div className="w-[50px] md:w-[64px] h-[50px] md:h-[64px] rounded-full overflow-hidden shrink-0">
                            <img
                              src={student.profileImage || avatar}
                              alt={student.name}
                              className="w-full h-full"
                            />
                          </div>
                          <div className="w-4/5">
                            <div className="w-full text-[15px] md:text-[18px] lg:text-[20px] font-medium">
                              {student?.name}
                            </div>
                            <div className="text-[12px] md:text-[14px] lg:text-[16px]">
                              {student?.parentName}
                            </div>
                          </div>
                        </div>
                        <div className="w-1/5 text-right">
                          <div className="text-[12px] md:text-[14px] font-medium">
                            Attendance
                          </div>
                          <div className="text-[10px] md:text-[12px]">96%</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex justify-end items-center w-full my-3">
                  <button
                    onClick={navigateToStudent}
                    className="border-b border-b-[#04326B] text-[#101928] text-[14px] md:text-[16px] hover:text-hover "
                  >
                    View All Students
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="w-full  ">
                <div className="w-full flex items-center justify-between mb-[30px] px-3 mt-6 md:mt-8">
                  <div className="font-[500] text-[20px] md:text-[28px] font-inter leading-[33.6px] text-[#101928]">
                    Tasks To Do
                  </div>
                  <button className="flex justify-between items-center w-[100px] md:w-[140px] h-[48px] md:h-[56px] rounded-md bg-[#EB5017] text-[#FFFFFF] p-[12px] md:p-[16px] text-[12px] md:text-[16px] font-[600] ">
                    <div className=" text-white ">
                      <FaPlus />
                    </div>
                    <div>New Task</div>
                  </button>
                </div>
                <div className="flex justify-between items-center w-full h-[91px] border-[.5px] border-[#DBDBDB] rounded-sm p-4 ">
                  <div className="">
                    <div className=" text-[15px] md:text-[18px] lg:text-[20px] font-medium">
                      Staff Meeting
                    </div>
                    <div className="text-[12px] md:text-[14px] lg:text-[16px]">
                      10:30AM
                    </div>
                  </div>
                  <button className=" w-[80px] shrink-0 h-[36px] rounded-md bg-[#FFFFFF] text-primary text-[12px] md:text-[14px] font-[600] border-[1.5px] border-primary ">
                    Start Task
                  </button>
                </div>
                <div className="flex justify-between items-center w-full h-[91px] border-[.5px] border-[#DBDBDB] rounded-sm p-4 ">
                  <div className="">
                    <div className=" text-[15px] md:text-[18px] lg:text-[20px] font-medium">
                      Short Break
                    </div>
                    <div className="text-[12px] md:text-[14px] lg:text-[16px]">
                      11:30AM
                    </div>
                  </div>
                  <button className=" w-[80px] shrink-0 h-[36px] rounded-md bg-[#FFFFFF] text-primary text-[12px] md:text-[14px] font-[600] border-[1.5px] border-primary ">
                    Start Task
                  </button>
                </div>

                <div className="flex justify-between items-center w-full h-[91px] border-[.5px] border-[#DBDBDB] rounded-sm p-4 ">
                  <div className="">
                    <div className=" text-[15px] md:text-[18px] lg:text-[20px] font-medium">
                      Announcement to Students
                    </div>
                    <div className="text-[12px] md:text-[14px] lg:text-[16px]">
                      03:30PM
                    </div>
                  </div>
                  <button className=" w-[80px] shrink-0 h-[36px] rounded-md bg-[#FFFFFF] text-primary text-[12px] md:text-[14px] font-[600] border-[1.5px] border-primary ">
                    Start Task
                  </button>
                </div>
              </div>
              <AdminChartSection />
            </div>
          </div>
        )}

        {selectedTab === "quickActions" && (
          <div className="flex flex-wrap justify-around items-center gap-[10px]">
            <Link
              to="/admin/students"
              className="flex flex-col items-center justify-center gap-y-3 w-[85%] h-[100px] md:w-[250px] md:h-[154px] rounded-[8px] border-[1px] border-[#DBDBDB]"
            >
              <div className="w-[28px] h-[28px] text-primary">
                <FaUsers />
              </div>
              <div className="text-[12px] md:text-[14px] lg:text-[16px]">
                Students List
              </div>
            </Link>
            <Link
              to="/admin/teachers"
              className="flex flex-col items-center justify-center gap-y-3 w-[85%] h-[100px] md:w-[250px] md:h-[154px] rounded-[8px] border-[1px] border-[#DBDBDB]"
            >
              <div className="w-[28px] h-[28px] text-primary">
                <FaCalendar />
              </div>
              <div className="text-[12px] md:text-[14px] lg:text-[16px]">
                Teachers List
              </div>
            </Link>
            <Link
              to="/admin/branches"
              className="flex flex-col items-center justify-center gap-y-3 w-[85%] h-[100px] md:w-[250px] md:h-[154px] rounded-[8px] border-[1px] border-[#DBDBDB]"
            >
              <div className="w-[28px] h-[28px] text-primary">
                <FaBookOpen />
              </div>
              <div className="text-[12px] md:text-[14px] lg:text-[16px]">
                Branches
              </div>
            </Link>
            <Link
              to="/admin/notices"
              className="flex flex-col items-center justify-center gap-y-3 w-[85%] h-[100px] md:w-[250px] md:h-[154px] rounded-[8px] border-[1px] border-[#DBDBDB]"
            >
              <div className="w-[28px] h-[28px] text-primary">
                <FaBell />
              </div>
              <div className="text-[12px] md:text-[14px] lg:text-[16px]">
                Notices
              </div>
            </Link>
            <Link
              to="/admin/classes"
              className="flex flex-col items-center justify-center gap-y-3 w-[85%] h-[100px] md:w-[250px] md:h-[154px] rounded-[8px] border-[1px] border-[#DBDBDB]"
            >
              <div className="w-[28px] h-[28px] text-primary">
                <FaCalculator />
              </div>
              <div className="text-[12px] md:text-[14px] lg:text-[16px]">
                Classes
              </div>
            </Link>
            <Link
              to=""
              className="flex flex-col items-center justify-center gap-y-3 w-[85%] h-[100px] md:w-[250px] md:h-[154px] rounded-[8px] border-[1px] border-[#DBDBDB]"
            >
              <div className="w-[28px] h-[28px] text-primary">
                <FaPercent />
              </div>
              <div className="text-[12px] md:text-[14px] lg:text-[16px]">
                Attendance
              </div>
            </Link>
            <Link
              to="/admin/exams-center"
              className="flex flex-col items-center justify-center gap-y-3 w-[85%] h-[100px] md:w-[250px] md:h-[154px] rounded-[8px] border-[1px] border-[#DBDBDB]"
            >
              <div className="w-[28px] h-[28px] text-primary">
                <FaBookmark />
              </div>
              <div className="text-[12px] md:text-[14px] lg:text-[16px]">
                Exams
              </div>
            </Link>
            <Link
              to="/admin/settings"
              className="flex flex-col items-center justify-center gap-y-3 w-[85%] h-[100px] md:w-[250px] md:h-[154px] rounded-[8px] border-[1px] border-[#DBDBDB]"
            >
              <div className="w-[28px] h-[28px] text-primary">
                <FaUser />
              </div>
              <div className="text-[12px] md:text-[14px] lg:text-[16px]">
                Profile
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
