import React, { useContext, useEffect, useState } from "react";
import { creative_logo } from "../../../utilities/Utils";
import { useLocation } from "react-router-dom";
import { Context } from "../../../context/Context";
import ApiAuth from "../../../api/ApiAuth";
import signature from "../../../assets/images/directorSignature.jpeg";
import Domain from "../domian/Domian";

const ResultSample = () => {
  const location = useLocation();
  const { access, selectedTerm, userDetails, selectedYear } =
    useContext(Context);
  const [studentRecord, setStudentRecord] = useState<any>(null);
  const [classDetails, setClassDetails] = useState<any>(null);
  const session = location?.state?.session;
  const classId = location?.state?.classId;
  const [subjectScores, setSubjectScores] = useState<any[]>([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!location?.state?.session || location?.state?.session === null) {
      return;
    }
    if (!location?.state?.classId || location?.state?.classId === null) {
      return;
    }
    handleGetRecords();
    checkResultApproval();
    getClassDetails();
  }, []);

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

  const checkResultApproval = async () => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.get(
        `/approval-result?classId=${classId}&year=${session}&schoolTerm=${selectedTerm}`,
        {
          headers: {
            Authorization: "Bearer " + access?.userToken,
          },
        }
      );
      setIsLoading(false);
      console.log(response.data.data);
      if (response.data.data.length === 0) {
        setIsAvailable(false);
      } else if (
        response.data.data.length === "undefined" ||
        response.data.data.length === "null"
      ) {
        setIsAvailable(false);
      } else {
        setIsAvailable(true);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleGetRecords = async () => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.get(
        `/record?studentId=${access?.userId}&schoolTerm=${selectedTerm}&classId=${classId}&year=${session}`,
        {
          headers: {
            Authorization: `Bearer ${access?.userToken}`,
          },
        }
      );
      console.log(response.data);
      setSubjectScores(response.data.data);
      setStudentRecord(response.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full flex flex-col items-center m-2 md:m-8 font-poppins">
      <div className="w-full mx-auto md:w-[60vw] flex justify-between mb-4 print:hidden">
        <button
          onClick={handleBack}
          type="button"
          className="px-[20px] py-[10px] border-[.5px] border-primary text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
        >
          Back
        </button>
        {isAvailable == true ? (
          <button
            onClick={handlePrint}
            type="button"
            className="px-[20px] py-[10px] border-[.5px] border-primary text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
          >
            Print / Save as PDF
          </button>
        ) : (
          ""
        )}
      </div>
      {isAvailable == true ? (
        <div className="border border-black w-full md:w-[60vw] p-2 md:p-12 scale-container">
          <header>
            <div className="w-full flex">
              {" "}
              <div className="nav-logo w-8 h-8 rounded-full">
                <img
                  src={creative_logo}
                  id="nav-logo"
                  color="white"
                  className="w-full h-full block"
                />
              </div>
            </div>
            <div className="text-center">
              <h2 className="font-medium md:font-bold">
                ANAMBRA STATE SCHOOL SYSTEM
              </h2>
              <h1 className="md:text-2xl text-primary font-medium md:font-bold m-1">
                CREATIVE KIDDIES ACADEMY
              </h1>
              <h5 className="mb-2">(Government Approved)</h5>
              <h6 className="text-lg mb-2">
                <span className="font-bold text-primary mt-4">Motto:</span>{" "}
                Creating a formidable future, One child at a time!
              </h6>
            </div>
            <div className="grid grid-cols-3 gap-1 my-1">
              <div>
                <h4 className="md:text-lg font-medium md:font-bold text-hover">
                  Mkpolo Branch
                </h4>
                <p className="text-[8px] md:text-[10px] text-left">
                  Creative Kiddies Close,
                </p>
                <p className="text-[8px] md:text-[10px] text-left">
                  Christ the king Estate Mkpolo,
                </p>
                <p className="text-[8px] md:text-[10px] text-left">
                  Off Nelly's Hotel Oba New Road,
                </p>
                <p className="text-[8px] md:text-[10px] text-left">
                  Oba, Anambra State.
                </p>
              </div>
              <div>
                <h4 className="md:text-lg font-medium md:font-bold text-hover">
                  New World Branch
                </h4>
                <p className="text-[8px] md:text-[10px] text-left">
                  2 Creative Kiddies Close,
                </p>
                <p className="text-[8px] md:text-[10px] text-left">
                  New World Estate,
                </p>
                <p className="text-[8px] md:text-[10px] text-left">
                  Off Chikson fuel station Oba express road,
                </p>
                <p className="text-[8px] md:text-[10px] text-left">
                  Oba, Anambra State.
                </p>
              </div>
              <div>
                <h4 className="md:text-lg font-medium md:font-bold text-hover">
                  Awada Branch
                </h4>
                <p className="text-[8px] md:text-[10px] text-left">
                  7B Upper Amanofor street Ugwuagba,
                </p>
                <p className="text-[8px] md:text-[10px] text-left">
                  Off NEPA road Obosi,
                </p>
                <p className="text-[8px] md:text-[10px] text-left">
                  Obosi, Anambra State.
                </p>
              </div>
            </div>
          </header>
          <h1 className="bg-hover text-white md:text-xl text-center my-1 p-1 mt-[20px]">
            RESULT FOR {classDetails?.[0]?.name}
          </h1>
          <div className="flex flex-col h-20 p-2.5">
            <p className="flex w-full text-lg pb-1">
              Name:
              <span className="flex-1 ml-1 pl-5 border-b md:font-bold text-hover border-dotted border-black">
                {userDetails?.[0]?.name}
              </span>
            </p>
            <div className="flex flex-wrap">
              <span className="flex-1 flex pb-1">
                Class:
                <span className="flex-1 ml-1 border-b border-dotted border-black text-hover font-bold pl-5">
                  {classDetails?.[0]?.name}
                </span>
              </span>
            </div>
            <div className="flex flex-wrap">
              <span className="flex-[0.55] flex">
                Term:
                <span className="flex-1 border-b border-dotted border-black text-hover font-bold pl-5">
                  {capitalizeFirstLetter(selectedTerm)} term
                </span>
              </span>
              <span className="flex-[0.45] flex">
                Year:
                <span className="flex-1 border-b border-dotted border-black text-hover font-bold pl-5">
                  {session}
                </span>
              </span>
            </div>
          </div>
          {(studentRecord?.remarks?.pyschomotorDomain ||
            studentRecord?.remarks?.affectiveDomain) && (
            <Domain remark={studentRecord?.remarks} />
          )}
          <h1 className="text-hover md:text-xl text-center font-extrabold mt-[40px]">
            THE FOLLOWING ARE THE DETAILS OF YOUR RESULT.
          </h1>
          <div className="overflow-x-auto">
            <table className="w-full my-1.5 p-1.5 border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1 text-left">
                    SUBJECTS
                  </th>
                  <th className="border shrink-0 border-gray-300 px-2 py-1">
                    FIRST TEST
                  </th>{" "}
                  <th className="border shrink-0 border-gray-300 px-2 py-1">
                    PROJECT
                  </th>{" "}
                  <th className="border shrink-0 border-gray-300 px-2 py-1">
                    MID-TEST
                  </th>
                  <th className="border shrink-0 border-gray-300 px-2 py-1">
                    EXAM
                  </th>
                  <th className="border shrink-0 border-gray-300 px-2 py-1">
                    TOTAL
                  </th>
                  <th className="border shrink-0 border-gray-300 px-2 py-1">
                    GRADE
                  </th>
                  <th className="border shrink-0 border-gray-300 px-2 py-1">
                    RESULT
                  </th>
                </tr>
              </thead>
              <tbody>
                {subjectScores.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-2 py-1">
                      {item?.subjectId?.name}
                    </td>
                    <td className="border shrink-0 border-gray-300 px-2 py-1 text-center">
                      {item?.resumptionTest}
                    </td>
                    <td className="border shrink-0 border-gray-300 px-2 py-1 text-center">
                      {item?.project}
                    </td>
                    <td className="border shrink-0 border-gray-300 px-2 py-1 text-center">
                      {item?.midTermTest}
                    </td>
                    <td className="border shrink-0 border-gray-300 px-2 py-1 text-center">
                      {item?.examScore}
                    </td>
                    <td className="border shrink-0 border-gray-300 px-2 py-1 text-center">
                      {item?.totalScore}
                    </td>
                    <td className="border shrink-0 border-gray-300 px-2 py-1 text-center">
                      {item?.grade}
                    </td>
                    <td className="border shrink-0 border-gray-300 px-2 py-1 text-center">
                      {item?.customGrade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <footer className="mt-[30px] relative">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-primary font-semibold">
              <div className="flex">
                Total Score:
                <span className="flex-1 ml-1 border-b border-black pl-4 font-bold text-hover">
                  {studentRecord?.totalScore}
                </span>
              </div>
              <div className="flex">
                Average Score:
                <span className="flex-1 ml-1 border-b border-black pl-4 font-bold text-hover">
                  {studentRecord?.averageTotalScore?.toFixed(1)}
                </span>
              </div>
              <div className="flex">
                Average Grade:
                <span className="flex-1 ml-1 border-b border-black pl-4 font-bold text-hover">
                  {studentRecord?.averageGrade}
                </span>
              </div>
              {/* <div className="flex">
                Position:
                <span className="flex-1 ml-1 border-b border-black pl-4 font-bold text-hover">
                  {studentRecord?.remarks?.position}
                  {(() => {
                    const position = studentRecord?.remarks?.position;
                    if (position) {
                      const lastDigit = position % 10;
                      const suffix =
                        position % 100 === 11 ||
                        position % 100 === 12 ||
                        position % 100 === 13
                          ? "th"
                          : lastDigit === 1
                          ? "st"
                          : lastDigit === 2
                          ? "nd"
                          : lastDigit === 3
                          ? "rd"
                          : "th";
                      return suffix;
                    }
                    return "";
                  })()}
                </span>
              </div> */}
            </div>
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-primary font-semibold mt-2">
           
            </div> */}
            <div className="flex font-semibold py-0.5 mt-2 text-primary">
              Comment:
              <span className="flex-1 ml-1 border-b border-black pl-4 font-bold text-hover">
                {studentRecord?.remarks?.comments}
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-y-[50px] font-semibold py-0.5 mt-5 text-primary">
              <div className="flex-[0.6] flex">
                Resumption Date:
                <span className="flex-1 ml-1 border-b border-black pl-4 font-bold text-hover">
                  {new Date(
                    studentRecord?.remarks?.resumptionDate
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex-[0.4] flex pb-[45px] md:pb-0">
                Principal:
                <span className="flex-1 ml-1 border-b border-black pl-4 font-bold text-hover overflow-hidden"></span>
              </div>
            </div>
            <div className="absolute z-50 bg-transparent right-[4px] bottom-[25px] md:right-[2px] md:bottom-[-30px] w-[230px] md:w-[180px] h-[90px] md:h-[80px] rounded-full overflow-hidden">
              <img src={signature} alt="" className="w-full h-full " />
            </div>
          </footer>
        </div>
      ) : (
        <p className="text-2xl mt-[12rem] text-primary">
          {" "}
          Result not ready yet...{" "}
        </p>
      )}
    </div>
  );
};

export default ResultSample;
