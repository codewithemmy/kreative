import React, { useState, useEffect, useContext } from "react";
import ApiAuth from "../../../../api/ApiAuth";
import { Context } from "../../../../context/Context";
import { errorNotifier } from "../../../../utilities/Toast";

interface AttendanceHistoryProps {
  onEdit: (id: any) => void;
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ onEdit }) => {
  const { access } = useContext(Context);
  const [history, setHistory] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [viewRecordId, setViewRecordId] = useState<string | null>(null);
  // Set branchId and period internally
  const classId = access?.classId || "";
  const period = "month"; // Set period as needed

  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      try {
        const response = await ApiAuth.get(
          `/attendance?classId=${classId}&period=${period}`,
          {
            headers: {
              Authorization: `Bearer ${access?.userToken}`,
            },
          }
        );
        const fetchedHistory = response.data.data || [];
        // Group the history by date
        const groupedHistory = fetchedHistory.reduce(
          (acc: any, record: any) => {
            const date = new Date(record.createdAt).toLocaleDateString();
            if (!acc[date]) {
              acc[date] = { ...record, count: 1 };
            } else {
              acc[date].teacherId.push(...record.teacherId);
              acc[date].count++;
            }
            return acc;
          },
          {}
        );
        setHistory(Object.values(groupedHistory));
        console.log(response.data.data || []);
        // setHistory(response.data?.data || []);
      } catch (error) {
        console.log(error);
        errorNotifier("Failed to fetch attendance history");
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await ApiAuth.get(`/class?_id=${access?.classId}`, {
          headers: {
            Authorization: `Bearer ${access?.userToken}`,
          },
        });
        setStudents(response.data?.data?.[0]?.studentId || []);
      } catch (error) {
        console.log(error);
        errorNotifier("Failed to fetch students");
      }
    };

    fetchAttendanceHistory();
    fetchStudents();
  }, [access]);

  const calculateAbsentees = (record: any) => {
    console.log("Students Length:", students.length);
    console.log("Present Students:", record?.studentId?.length);
    return students.length - (record?.studentId?.length || 0);
  };

  const handleView = (id: string) => {
    setViewRecordId(viewRecordId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-xl font-semibold mb-4">Attendance History</h2>
      {history.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <ul className="space-y-4 overflow-x-auto w-full">
          {history.map((record) => (
            <li key={record?._id}>
              <div className="flex gap-4 items-center">
                <span className="w-[90px] lg:w-[120px] shrink-0 text-center">
                  {new Date(record?.createdAt).toLocaleDateString()}
                </span>
                <span className="w-[90px] lg:w-[120px] text-hover shrink-0 text-center">
                  Present:{" "}
                  <span className="text-primary">
                    {record?.studentId?.length}
                  </span>
                </span>
                <span className="w-[90px] lg:w-[120px] text-hover shrink-0 text-center">
                  Absent:{" "}
                  <span className="text-primary">
                    {calculateAbsentees(record)}
                  </span>
                </span>
                <button
                  onClick={() => handleView(record?._id)}
                  className="py-1 px-3 bg-green-600 hover:bg-green-400 text-white rounded-lg"
                >
                  {viewRecordId === record?._id ? "Hide" : "View"}
                </button>
                <button
                  onClick={() => onEdit(record)}
                  className="py-1 px-3 bg-primary hover:bg-hover text-white rounded-lg"
                >
                  Edit
                </button>
              </div>
              {viewRecordId === record?._id && (
                <div className="mt-10">
                  <h3 className="text-lg font-semibold mb-4">
                    Attendance Details
                  </h3>
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4">Students</th>
                        <th className="py-2 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student?._id}>
                          <td className="py-2 px-4 text-primary">
                            {student?.name}
                          </td>
                          <td className="py-2 px-4 text-left">
                            {record?.studentId?.some(
                              (s: any) => s._id === student?._id
                            ) ? (
                              <span className="text-hover">Present</span>
                            ) : (
                              <span className="text-red-500">Absent</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AttendanceHistory;
