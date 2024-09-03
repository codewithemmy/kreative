import React, { useState, useEffect, useContext } from "react";
import ApiAuth from "../../../../api/ApiAuth";
import { Context } from "../../../../context/Context";
import { errorNotifier } from "../../../../utilities/Toast";

interface AttendanceHistoryProps {
  onEdit: (record: any) => void;
}

const AdminAttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  onEdit,
}) => {
  const [history, setHistory] = useState<any[]>([]);
  const { adminAccess, adminDetails } = useContext(Context);
  const [viewRecordId, setViewRecordId] = useState<string | null>(null);
  const [teacher, setTeacher] = useState<any[]>([]);

  // Set branchId and period internally
  const branchId = adminDetails?.[0]?.branchId || "";
  const period = "month"; // Set period as needed

  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      try {
        const response = await ApiAuth.get(
          `/attendance?period=${period}&branchId=${branchId}`,
          {
            headers: {
              Authorization: `Bearer ${adminAccess?.userToken}`,
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
        // setHistory(response.data.data || []);
        console.log(response.data.data || []);
      } catch (error) {
        setHistory([]);
        if (error instanceof Error) {
          console.error("Error fetching attendance history:", error.message);
          errorNotifier(`Failed to fetch attendance history: ${error.message}`);
        } else {
          console.error("Unexpected error:", error);
          errorNotifier(
            "Failed to fetch attendance history due to an unexpected error."
          );
        }
      }
    };

    if (adminAccess?.userToken && branchId) {
      fetchAttendanceHistory();
    } else {
      console.error("No user token or branchId available");
    }
  }, [adminAccess?.userToken, branchId]);

  const handleGetTeachers = async () => {
    if (!adminDetails) {
      return;
    }

    try {
      const response =
        adminAccess?.accountType === "admin"
          ? await ApiAuth.get(`/user?branchId=${branchId}`, {
              headers: {
                Authorization: "Bearer " + adminAccess?.userToken,
              },
            })
          : await ApiAuth.get(`/user`, {
              headers: {
                Authorization: "Bearer " + adminAccess?.userToken,
              },
            });

      setTeacher(response?.data.data.data || []);
    } catch (error) {
      errorNotifier("Failed to fetch teachers");
    }
  };

  useEffect(() => {
    handleGetTeachers();
  }, [adminAccess, adminDetails]);

  const calculateAbsentees = (record: any) => {
    return teacher.length - record?.teacherId?.length;
  };

  const handleView = (id: string) => {
    setViewRecordId(viewRecordId === id ? null : id);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-10">
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
                    {record?.teacherId?.length}
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
                        <th className="py-2 px-4">Teachers</th>
                        <th className="py-2 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teacher.map((teachers) => (
                        <tr key={teachers?._id}>
                          <td className="py-2 px-4 text-primary">
                            {teachers?.name}
                          </td>
                          <td className="py-2 px-4 text-left">
                            {record?.teacherId?.some(
                              (t: any) => t._id === teachers?._id
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

export default AdminAttendanceHistory;
