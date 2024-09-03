import React, { useContext, useEffect, useState } from "react";
import TeacherSidebar from "../../components/TeacherSidebar";
import Header from "../../../../header/Header";
import {
  FaBookDead,
  FaCheckCircle,
  FaPercentage,
  FaUsers,
} from "react-icons/fa";
import ApiAuth from "../../../../api/ApiAuth";
import { Context } from "../../../../context/Context";

interface Student {
  id: string;
  name: string;
  scores: { [subjectId: string]: number };
  grades: { [subjectId: string]: string }; 
  averageGrades: { [subjectId: string]: string }; 
}

interface ClassRecord {
  _id: string;
  studentId: Student[];
}

interface Subject {
  _id: string;
  name: string;
}

const ExamsPage: React.FC = () => {
  const { access, userDetails, selectedTerm } = useContext(Context);
  const [studentsRecord, setStudentsRecord] = useState<ClassRecord | null>(
    null
  );
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isPrintable, setIsPrintable] = useState(false);

  const handleToggle = () => {
    setIsPrintable(!isPrintable);
  };

  const getStudentRecords = async () => {
    try {
      const response = await ApiAuth.get(`/class?_id=${access?.classId}`, {
        headers: {
          Authorization: "Bearer " + access?.userToken,
        },
      });
      console.log(response.data);
      const myClass = response.data.data.find(
        (item: any) => item._id === userDetails?.[0]?.intendedClass
      );
      setStudentsRecord(myClass);
    } catch (error) {
      console.error("Error fetching student records:", error);
    }
  };

  const handleGetSubjects = async () => {
    if (!access?.classId || !access?.userToken) {
      console.error("Class ID or User Token is missing");
      return;
    }

    try {
      const response = await ApiAuth.get(`/subject?classId=${access?.classId}`, {
        headers: {
          Authorization: `Bearer ${access?.userToken}`,
        },
      });
      setSubjects(response.data.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    handleGetSubjects();
    getStudentRecords();
  }, [access?.classId, access?.userToken, selectedTerm]);

  const studentLastName = (fullName: string) => {
    const nameParts = fullName.split(" ");
    return nameParts[nameParts.length - 1];
  };

  const calculateAverageScore = (scores: number[]) => {
    if (scores.length === 0) return 0;
    const total = scores.reduce((acc, score) => acc + score, 0);
    return total / scores.length;
  };

  const cardData = [
    {
      icon: <FaUsers />,
      altText: "icon.png",
      text: "Total Students",
      amount: studentsRecord?.studentId.length || 0,
    },
    {
      icon: <FaCheckCircle />,
      altText: "icon.png",
      text: "Average Students",
      amount: studentsRecord?.studentId.length || 0,
    },
    {
      icon: <FaPercentage />,
      altText: "icon.png",
      text: "Total Passed",
      amount: 22,
    },
    {
      icon: <FaBookDead />,
      altText: "icon.png",
      text: "Total Failed",
      amount: 22,
    },
  ];

  return (
    <div className="w-full grid grid-cols-6 gap-4 p-4">
      <div className="col-span-1">
        <TeacherSidebar />
      </div>
      <div className="col-span-5">
        <Header />
        <div className="w-full flex items-center justify-between mb-[10px] mt-[20px]">
          <div className="font-[400] text-[20px] font-inter leading-[33.6px] text-[#101928]">
            Class Records
          </div>
        </div>

        <div className="flex justify-around items-center gap-[8px] flex-wrap mb-[30px]">
          {cardData?.map((card, index) => (
            <div
              key={index}
              className="flex justify-start gap-x-[16px] items-center w-[251px] h-[106px] rounded-[8px] border-[1px] border-[#DBDBDB] p-[24px]"
            >
              <div className=" w-[24px] h-[24px] text-primary">{card?.icon}</div>
              <div>
                <div className="text-[#101928]">{card?.text}</div>
                <div className="text-[#101928] text-[24px] font-semibold">
                  {card?.amount}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="table-container w-full overflow-x-auto flex flex-col shrink-0 mt-2">
          {/* <table className="shrink-0 w-full border border-[#535353]">
            <thead className="w-full border-b border-[#535353]">
              <tr className="text-left w-full text-[#535353] text-[12px] border-b border-[#535353] p-1">
                <th className="w-[90px] lg:w-[100px] border-r border-[#535353]">
                  Subjects
                </th>
                {studentsRecord?.studentId.map((student) => (
                  <th
                    key={student.id}
                    className="w-[180px] lg:w-[180px] border-r border-[#535353] relative"
                  >
                    <div className="flex flex-col items-center">
                      <div>{studentLastName(student.name)}</div>
                      <div className="flex justify-between w-full border-t border-[#535353] mt-1 relative">
                        <span className="w-[50%] text-center">Score</span>
                        <span className="w-[50%] text-center relative">
                          Grade
                        </span>
                      </div>
                    </div>
                  </th>
                ))}
                <th className="w-[90px] lg:w-[100px] border-r border-[#535353] text-center">
                  Average Total Score
                </th>
                <th className="w-[90px] lg:w-[100px] border-r border-[#535353] text-center">
                  Average Grade
                </th>
                <th className="w-[90px] lg:w-[100px] border-r border-[#535353] text-center">
                  Top Score
                </th>
                <th className="w-[90px] lg:w-[100px]">Percentage Fail</th>
              </tr>
            </thead>
            <tbody className="w-full">
              {subjects.map((subject) => (
                <tr
                  key={subject._id}
                  className="text-left w-full text-[#535353] text-[12px] border-b border-[#535353] p-2"
                >
                  <td className="w-[90px] lg:w-[100px] border-r border-[#535353]">
                    {subject.name}
                  </td>
                  {studentsRecord?.studentId.map((student) => (
                    <td
                      key={student.id}
                      className="w-[180px] lg:w-[180px] border-r border-[#535353] relative"
                    >
                      <div className="flex justify-between w-full relative">
                        <span className="w-[50%] text-center">-</span>
                        <span className="w-[50%] text-center">-</span>
                      </div>
                    </td>
                  ))}
                  <td className="w-[90px] lg:w-[100px] border-r border-[#535353] text-center">
                    {studentsRecord[0]?.averageGrades[subject._id] || "-"}
                  </td>
                  <td className="w-[90px] lg:w-[100px] border-r border-[#535353] text-center">
                    {Math.max(
                      ...studentsRecord.map(
                        (student) => student.scores[subject._id] || 0
                      )
                    )}
                  </td>
                  <td className="w-[90px] lg:w-[100px] border-r border-[#535353] text-center">
                    {/* Percentage Fail calculation logic here */}-
                  {/* </td> */}
                {/* </tr> */}
              {/* ))} */}
            {/* </tbody> */}
          {/* </table> */} 
        </div>
        <div className="mt-4 flex items-center">
          <div className="mr-2">Make result printable</div>
          <div
            onClick={handleToggle}
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
        </div>
      </div>
    </div>
  );
};

export default ExamsPage;
