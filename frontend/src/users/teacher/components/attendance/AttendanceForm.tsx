import React, { useState, useEffect, useContext } from "react";
import ApiAuth from "../../../../api/ApiAuth";
import { Context } from "../../../../context/Context";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";

interface AttendanceFormProps {
  onSubmit: () => void;
  record?: any;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({
  onSubmit,
  record,
}) => {
  const { access, userDetails, loadUserDetails } = useContext(Context);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await ApiAuth.get(`/class?_id=${access?.classId}`, {
          headers: {
            Authorization: `Bearer ${access?.userToken}`,
          },
        });
        setStudents(response.data?.data?.[0]?.studentId || []);

        if (record) {
          console.log(record);
          setSelectedStudents(record.studentId || []);
        }
      } catch (error) {
        console.log(error);
        errorNotifier("Failed to fetch students");
      }
    };

    fetchStudents();
  }, [record]);

  const handlePresentChange = (studentId: string) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected
        : [...prevSelected, studentId]
    );
  };

  const handleAbsentChange = (studentId: string) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : prevSelected
    );
  };

  const formSubmit = async () => {
    if (selectedStudents.length === 0) {
      errorNotifier("No students marked present");
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        type: "teacher",
        branchId: userDetails?.[0]?.branchId,
        classId: access?.classId,
        studentId: selectedStudents,
      };

      if (record) {
        await ApiAuth.patch(`/attendance/${record._id}`, data, {
          headers: {
            Authorization: `Bearer ${access?.userToken}`,
          },
        });
      } else {
        await ApiAuth.post("/attendance", data, {
          headers: {
            Authorization: `Bearer ${access?.userToken}`,
          },
        });
      }

      successNotifier("Attendance successfully submitted");
      onSubmit();
    } catch (error) {
      console.log(error);
      errorNotifier("Failed to submit attendance");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    await loadUserDetails();
    if (userDetails?.[0]?.branchId) {
      formSubmit();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md pb-4">
      <h2 className="text-xl font-semibold mb-4">
        {record ? "Edit Attendance" : "Take Attendance"}
      </h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 md:pl-[15px] text-left">Students</th>
            <th className="py-2">Present</th>
            <th className="py-2">Absent</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((student) => (
            <tr key={student?._id}>
              <td className="py-2 px-4">{student?.name}</td>
              <td className="py-2 px-4 text-center">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student?._id)}
                  onChange={() => handlePresentChange(student?._id)}
                  disabled={isLoading}
                />
              </td>
              <td className="py-2 px-4 text-center">
                <input
                  type="checkbox"
                  checked={!selectedStudents.includes(student?._id)}
                  onChange={() => handleAbsentChange(student?._id)}
                  disabled={isLoading}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default AttendanceForm;
