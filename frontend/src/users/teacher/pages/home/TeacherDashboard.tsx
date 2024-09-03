import React, { useContext, useEffect, useState } from "react";
import TeacherSidebar from "../../components/TeacherSidebar";
import Header from "../../../../header/Header";
import avatar from "../../../../assets/images/profile.png";
import { errorNotifier } from "../../../../utilities/Toast";
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
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import EventNotice from "../../../parents/components/EventNotice";
import TeacherChartSection from "../../components/charts/TeacherChartSection";

interface Student {
  name: string;
  score: string;
}
interface Notification {
  _id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  date: string;
  time: string;
}

const TeacherDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [totalStudent, setTotalStudent] = useState<number>(0);
  const [notice, setNotice] = useState<Notification[]>([]);
  const [topPerformingStudent, setTopPerformingStudent] = useState<Student[]>(
    []
  );
  const { userDetails, setClassId, classId, access } = useContext(Context);

  useEffect(() => {
    console.log(classId);

    setTimeout(() => {
      if (userDetails) {
        setClassId(userDetails?.intendedClass);
        console.log(userDetails?.intendedClass);
      }
    }, 1000);
  }, []);

  const handleGetNotice = async () => {
    try {
      const response = await ApiAuth.get(`/notice?noticeType=announcement`, {
        headers: {
          Authorization: `Bearer ${access?.userToken}`,
        },
      });

      setNotice(response?.data?.notice || []);
      console.log(response?.data?.notice || []);
    } catch (error) {
      console.log(error);
      errorNotifier("Failed to get Notification");
    }
  };
  useEffect(() => {
    // Fetching the  total number of students when the component mounts
    handleGetNotice();
    getTotalStudents();
  }, []);

  const getTotalStudents = async () => {
    try {
      const response = await ApiAuth.get(
        `/endpoint?branchId=${userDetails?.[0]?.branchId}&classId=${userDetails?.[0]?.intendedClass}`
        // {
        //   headers: {
        //     Authorization: "Bearer " + access?.userToken,
        //   },
        // }
      );
      setTotalStudent(response.data.totalStudents);
    } catch (error) {
      console.error("Error fetching total students:", error);
    }
  };
  // Top performing students(Will map the getTopperfomingstudents later in the code to display)
  const getTopPerformingStudents = async () => {
    try {
      const response = await ApiAuth.get(
        `/endpoint?branchId=${userDetails?.[0]?.branchId}&classId=${userDetails?.[0]?.intendedClass}`
      );
      const students: Student[] = response.data;
      const sortedStudents = students.sort((a, b) => {
        if (typeof a.score === "number" && typeof b.score === "number") {
          return b.score - a.score;
        }
        return 0; //This will handle the casees where score is not a number
      });
      setTopPerformingStudent(sortedStudents);
      // {
      //   headers: {
      //     Authorization: "Bearer " + access?.userToken,
      //   },
      // }
    } catch (error) {
      console.error("error in getting top studdents", error);
    }
  };
  const cardData = [
    {
      icon: <FaUsers />,
      altText: "icon.png",
      text: "Total Students",
      // amount: "0",
      amount: totalStudent,
    },
    {
      icon: <FaCheckCircle />,
      altText: "icon.png",
      text: "Today Presentees",
      amount: "26",
    },
    {
      icon: <FaAward />,
      altText: "icon.png",
      text: "Today Absentees",
      amount: "75%",
    },
    {
      icon: <FaPercent />,
      altText: "icon.png",
      text: "Attendance Rate",
      amount: "92%",
    },
  ];

  return (
    <div className="w-full grid  grid-cols-1 md:grid-cols-6 gap-4 p-4">
      <div className="col-span-1">
        <TeacherSidebar />
      </div>
      <div className="col-span-1 md:col-span-5">
        <Header />
        <div className="w-full flex justify-start items-center my-4">
          <div className="flex gap-x-3">
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
          <div>
            <div className="flex justify-around items-center gap-[8px] flex-wrap mb-[30px]">
              {cardData?.map((card, index) => (
                <div
                  key={index}
                  className="flex justify-start gap-x-[16px] items-center w-full md:w-[251px] h-[106px] rounded-[8px] border-[1px] border-[#DBDBDB] p-[24px]"
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
            <TeacherChartSection />
            <EventNotice />
            <div className="mb-8">
              <h1 className="font-semibold text-lg pb-4">Announcements</h1>
              <div className="grid grid-cols-2 gap-4">
                {notice.map((notices) => (
                  <div
                    key={notices?._id}
                    className="bg-white shadow-xl rounded-lg p-4"
                  >
                    <h2>{notices?.title}</h2>
                    <p>{notices?.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full">
              <div className="w-full flex items-center justify-between mb-[30px]">
                <div className="font-[500] text-[28px] font-inter leading-[33.6px] text-[#101928]">
                  Tasks To Do
                </div>
                <button className="flex justify-between items-center w-[140px] h-[56px] rounded-md bg-[#EB5017] text-[#FFFFFF] p-[16px] text-[16px] font-[600] ">
                  <div className=" text-white ">
                    <FaPlus />
                  </div>
                  <div>New Task</div>
                </button>
              </div>
              <div className="flex justify-between items-center w-full h-[91px] border-[.5px] border-[#DBDBDB] rounded-sm p-4 ">
                <div className="">
                  <div className="text-[20px] font-medium">
                    Maths Class with Primary 4B
                  </div>
                  <div className="text-[16px]">09:00AM</div>
                </div>
                <button className=" w-[102px] h-[36px] rounded-md bg-[#FFFFFF] text-[#CC400C] text-[14px] font-[600] border-[1.5px] border-[#CC400C] ">
                  Start Task
                </button>
              </div>
              <div className="flex justify-between items-center w-full h-[91px] border-[.5px] border-[#DBDBDB] rounded-sm p-4 ">
                <div className="">
                  <div className="text-[20px] font-medium">
                    Staff Room Meeting
                  </div>
                  <div className="text-[16px]">10:30AM</div>
                </div>
                <button className=" w-[102px] h-[36px] rounded-md bg-[#FFFFFF] text-[#CC400C] text-[14px] font-[600] border-[1.5px] border-[#CC400C] ">
                  Start Task
                </button>
              </div>
              <div className="flex justify-between items-center w-full h-[91px] border-[.5px] border-[#DBDBDB] rounded-sm p-4 ">
                <div className="">
                  <div className="text-[20px] font-medium">Short Break</div>
                  <div className="text-[16px]">11:30AM</div>
                </div>
                <button className=" w-[102px] h-[36px] rounded-md bg-[#FFFFFF] text-[#CC400C] text-[14px] font-[600] border-[1.5px] border-[#CC400C] ">
                  Start Task
                </button>
              </div>
              <div className="flex justify-between items-center w-full h-[91px] border-[.5px] border-[#DBDBDB] rounded-sm p-4 ">
                <div className="">
                  <div className="text-[20px] font-medium">
                    Prepare Questions for Science Test
                  </div>
                  <div className="text-[16px]">01:30PM</div>
                </div>
                <button className=" w-[102px] h-[36px] rounded-md bg-[#FFFFFF] text-[#CC400C] text-[14px] font-[600] border-[1.5px] border-[#CC400C] ">
                  Start Task
                </button>
              </div>
              <div className="flex justify-between items-center w-full h-[91px] border-[.5px] border-[#DBDBDB] rounded-sm p-4 ">
                <div className="">
                  <div className="text-[20px] font-medium">
                    Announcement to Students
                  </div>
                  <div className="text-[16px]">03:30PM</div>
                </div>
                <button className=" w-[102px] h-[36px] rounded-md bg-[#FFFFFF] text-[#CC400C] text-[14px] font-[600] border-[1.5px] border-[#CC400C] ">
                  Start Task
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "quickActions" && (
          <div className="flex flex-wrap justify-around items-center gap-[10px]">
            <div className="flex flex-col items-center justify-center gap-y-3 w-[250px] h-[154px] ">
              <div className="w-[28px] h-[28px] text-primary">
                <FaUsers />
              </div>
              <div className="text-[16px]">Students List</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-y-3 w-[250px] h-[154px] ">
              <div className="w-[28px] h-[28px] text-primary">
                <FaBookOpen />
              </div>
              <div className="text-[16px]">Assignments</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-y-3 w-[250px] h-[154px] ">
              <div className="w-[28px] h-[28px] text-primary">
                <FaBell />
              </div>
              <div className="text-[16px]">Notices</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-y-3 w-[250px] h-[154px] ">
              <div className="w-[28px] h-[28px] text-primary">
                <FaCalculator />
              </div>
              <div className="text-[16px]">My Class</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-y-3 w-[250px] h-[154px] ">
              <div className="w-[28px] h-[28px] text-primary">
                <FaCalendar />
              </div>
              <div className="text-[16px]">Time Table</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-y-3 w-[250px] h-[154px] ">
              <div className="w-[28px] h-[28px] text-primary">
                <FaPercent />
              </div>
              <div className="text-[16px]">Attendance</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-y-3 w-[250px] h-[154px] ">
              <div className="w-[28px] h-[28px] text-primary">
                <FaBookmark />
              </div>
              <div className="text-[16px]">Exams</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-y-3 w-[250px] h-[154px] ">
              <div className="w-[28px] h-[28px] text-primary">
                <FaUser />
              </div>
              <div className="text-[16px]">Profile</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
