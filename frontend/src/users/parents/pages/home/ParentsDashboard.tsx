import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import { makeStyles } from "@material-ui/core/styles";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import ParentSidebar from "../../components/ParentSidebar";
import ChartSection from "../../components/ChartSection";
import "react-calendar/dist/Calendar.css";
import ParentHeader from "../../../../header/ParentHeader";
import ApiAuth from "../../../../api/ApiAuth";
import { Context } from "../../../../context/Context";
import EventNotice from "../../components/EventNotice";
import { errorNotifier } from "../../../../utilities/Toast";
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220,
    border: 1,
    borderRadius: 3,
    marginTop: 20,
    marginBottom: 20,
  },
}));
interface Notification {
  _id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  date: string;
  time: string;
}

interface Assignment {
  _id: string;
  title: string;
  content: string;
  dueDate: string;
}

function ParentsDashboard() {
  const [classList, setClassList] = useState<any[]>([]);
  const { access, userDetails, loadUserDetails } = useContext(Context);
  const [session, setSession] = useState("");
  const [classId, setClassId] = useState(access?.classId);
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Notification[]>([]);
  const [assignment, setAssignment] = useState<Assignment[]>([]);

  const handleGetClass = async () => {
    try {
      const response = await ApiAuth.get(
        `/class?branchId=${userDetails?.[0]?.branchId}`,
        {
          headers: {
            Authorization: "Bearer " + access?.userToken,
          },
        }
      );
      setClassList(response?.data.data);
    } catch (error) {
      errorNotifier("Failed to get class details");
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      await loadUserDetails();
      if (userDetails?.[0]?.branchId) {
        handleGetClass();
      }
    };
    
    fetchDetails();
  }, []);

  const handleGetNotice = async () => {
    try {
      const response = await ApiAuth.get(`/notice?noticeType=announcement`, {
        headers: {
          Authorization: `Bearer ${access?.userToken}`,
        },
      });

      setNotice(response?.data?.notice || []);
    } catch (error) {
      console.log(error);
      errorNotifier("Failed to get Notification");
    }
  };

  const handleGetAssignment = async () => {
    try {
      const response = await ApiAuth.get(`/notice?noticeType=assignment`, {
        headers: {
          Authorization: `Bearer ${access?.userToken}`,
        },
      });

      setAssignment(response?.data?.notice || []);
      console.log(response?.data?.notice || []);
    } catch (error) {
      console.log(error);
      errorNotifier("Failed to get Notification");
    }
  };
  useEffect(() => {
    if (userDetails?.[0]?.branchId) {
      handleGetClass();
    }
    handleGetNotice();
    handleGetAssignment();
  }, [userDetails]);

  const handlePrintResult = (session: string) => {
    if (session) {
      navigate(`/printresults`, {
        state: { session: session, classId: classId },
      });
    }
  };

  const selectedClass = classList?.find((clas) => clas._id === classId);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-6">
      <div className="lg:col-span-1 mt-[6rem] lg:mt-[3rem]">
        <ParentSidebar />
      </div>
      <div className="lg:col-span-5">
        <ParentHeader />
        <Wrapper>
          <section className="parents__dashboard__section px-4 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 py-8">
              <div className="col-span-2 rounded-xl shadow-xl p-6 bg-white">
                <ChartSection />
              </div>
              <div className="bg-white rounded-xl shadow-xl p-6 w-full flex items-center justify-center">
                <Calendar />
              </div>
            </div>
            <EventNotice />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div>
                <h1 className="font-semibold text-lg pb-4">Assignment</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignment.map((tasks) => {
                    const formattedDueDate = tasks.dueDate.split("T")[0];
                    return (
                      <div
                        className="bg-white shadow-xl rounded-lg p-4"
                        key={tasks._id}
                      >
                        <h2 className="font-bold">{tasks.title} </h2>
                        <p>{tasks.content}</p>
                        <p>
                          Due:
                          <span className="rounded-full text-red-400 p-1">
                            {formattedDueDate}
                          </span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h1 className="font-bold text-lg pb-4">Announcements</h1>
                <div className="grid grid-cols-2 gap-4">
                  {notice.map((notices) => (
                    <div
                      key={notices?._id}
                      className="bg-white shadow-xl rounded-lg p-4"
                    >
                      <h2 className="font-semibold">{notices?.title}</h2>
                      <p>{notices?.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-10">
              <div className="flex flex-col md:flex-row  md:items-start gap-4">
                <div className="flex flex-col">
                  <label htmlFor="sessionSelect">Select Year</label>
                  <select
                    id="sessionSelect"
                    className="border border-1 border-primary p-3 rounded-md text-primary"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                  >
                    <option value={2022}>2022</option>
                    <option value={2023}>2023</option>
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                    <option value={2028}>2028</option>
                    <option value={2029}>2029</option>
                    <option value={2030}>2030</option>
                    <option value={2031}>2031</option>
                    <option value={2032}>2032</option>
                    <option value={2033}>2033</option>
                  </select>
                </div>

                <div className="flex flex-col ">
                  <label htmlFor="classSelect">Select Class</label>
                  <select
                    id="classSelect"
                    className="border border-1 border-primary p-3 rounded-md text-primary"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                  >
                    {classList.map((clas, id) => (
                      <option key={id} value={clas._id}>
                        {clas.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => handlePrintResult(session)}
                  disabled={!session && !classId}
                  className={`py-4 px-6 rounded-md md:mt-[15px] md:ml-[20px] ${
                    session
                      ? "bg-primary text-white"
                      : "bg-gray-400 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Print Result
                </button>
              </div>
            </div>
          </section>
        </Wrapper>
      </div>
    </div>
  );
}

const Wrapper = styled.section`
  .parents__dashboard__section {
    background: #f1f3f9;
  }
`;

export default ParentsDashboard;
