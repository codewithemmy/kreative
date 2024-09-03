import React, { useState, useEffect, useContext } from "react";
import ApiAuth from "../../../../api/ApiAuth";
import { Context } from "../../../../context/Context";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";

interface AttendanceFormProps {
  onSubmit: () => void;
  record?: any;
}

interface Teacher {
  _id: string;
  name: string;
}

const AdminAttendanceForm: React.FC<AttendanceFormProps> = ({
  onSubmit,
  record,
}) => {
  const { adminAccess, adminDetails, loadAdminDetails } = useContext(Context);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      setTeachers(response?.data.data.data || []);
      if (record) {
        console.log(record);
        setTeachers(response?.data.data.data || []);
      }
    } catch (error) {
      setIsLoading(false);
      errorNotifier("Failed to fetch teachers");
    }
  };

  useEffect(() => {
    handleGetTeachers();
  }, [adminAccess, adminDetails, record]);


  const handleSubmit = async () => {
    if (selectedTeachers.length === 0) {
      errorNotifier("No teacher selected");
      return;
    }

    try {
      const data = {
        type: "teacher",
        branchId: adminDetails?.[0]?.branchId,
        classId: adminDetails?.classId,
        teacherId: selectedTeachers,
      };

      await ApiAuth.post("/attendance", data, {
        headers: {
          Authorization: `Bearer ${adminAccess?.userToken}`,
        },
      });
      console.log(data);
      successNotifier("Attendance successfully submitted");
      onSubmit();
    } catch (error) {
      errorNotifier("Failed to submit attendance");
    }
  };

  const handlePresentChange = (teacherId: string) => {
    setSelectedTeachers((prevSelected) =>
      prevSelected.includes(teacherId)
        ? prevSelected
        : [...prevSelected, teacherId]
    );
  };

  const handleAbsentChange = (teacherId: string) => {
    setSelectedTeachers((prevSelected) =>
      prevSelected.includes(teacherId)
        ? prevSelected.filter((id) => id !== teacherId)
        : prevSelected
    );
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {record ? "Edit Attendance" : "Take Attendance"}
      </h2>
      {isLoading ? (
        <p>Loading teachers...</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 md:pl-[15px] text-left">Students</th>
              <th className="py-2">Present</th>
              <th className="py-2">Absent</th>
            </tr>
          </thead>
          <tbody>
            {teachers?.map((teacher) => (
              <tr key={teacher?._id}>
                <td className="py-2 px-4">{teacher?.name}</td>
                <td className="py-2 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectedTeachers.includes(teacher?._id)}
                    onChange={() => handlePresentChange(teacher?._id)}
                    disabled={isLoading}
                  />
                </td>
                <td className="py-2 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={!selectedTeachers.includes(teacher?._id)}
                    onChange={() => handleAbsentChange(teacher?._id)}
                    disabled={isLoading}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={handleSubmit}
        className="mt-6 py-2 px-4 bg-primary hover:bg-hover text-white rounded-lg"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Submit Attendance"}
      </button>
    </div>
  );
};

export default AdminAttendanceForm;
