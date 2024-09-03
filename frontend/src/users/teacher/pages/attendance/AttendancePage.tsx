import React, { useState, useEffect } from "react";
import AttendanceForm from "../../components/attendance/AttendanceForm";
import AttendanceHistory from "../../components/attendance/AttendanceHistory";
import TeacherSidebar from "../../components/TeacherSidebar";
import Header from "../../../../header/Header";
import { FaPlus, FaTimes } from "react-icons/fa";

const AttendancePage: React.FC = () => {
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [isTakingAttendance, setIsTakingAttendance] = useState(false);

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setIsTakingAttendance(true);
  };

  const handleFormSubmit = () => {
    setEditingRecord(null);
    setIsTakingAttendance(false);
  };

  const handleTakeAttendance = () => {
    setIsTakingAttendance((prevState) => !prevState);
    if (isTakingAttendance) {
      setEditingRecord(null);
    }
  };

  return (
    <div className="md:flex min-h-full bg-[#F8F8F8] lg:px-4 lg:relative">
      <TeacherSidebar />
      <div className="w-screen lg:w-[85%] lg:absolute lg:right-0 mt-24 lg:mt-0">
        <Header />
        <div className="p-6" style={{ zIndex: 999 }}>
          <h1 className="font-semibold text-xl md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl flex flex-grow pb-4">
            Attendance Management
          </h1>
          <div className="flex flex-wrap justify-end items-center w-full rounded-sm py-2">
            <button
              type="button"
              onClick={handleTakeAttendance}
              className="flex justify-between items-center gap-2 h-[35px] rounded-md bg-[#FFFFFF] text-[#CC400C] text-[12px] font-[400] border-[1.5px] p-[12px] border-[#CC400C]"
            >
              {isTakingAttendance ? (
                ""
              ) : (
                <div className="text-[#CC400C]">
                  <FaPlus />
                </div>
              )}{" "}
              <div>{isTakingAttendance ? "Cancel" : "Take Attendance"}</div>
            </button>
          </div>
          {isTakingAttendance && (
            <AttendanceForm
              onSubmit={handleFormSubmit}
              record={editingRecord} // Pass the record to the form
            />
          )}
          <AttendanceHistory onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
