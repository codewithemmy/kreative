import React, { useContext, useEffect, useState } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import ApiAuth from "../../../api/ApiAuth";
import { Context } from "../../../context/Context";

// Registering the required components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
};

// type DataOptions = {
//   monthly: ChartData;
//   weekly: ChartData;
//   yearly: ChartData;
// };

const ChartSection: React.FC = () => {
  // const [timeFrame, setTimeFrame] = useState<keyof DataOptions>("monthly");

  const [timeFrame, setTimeFrame] = useState<"month" | "week" | "day">("month");
  const [message, setMessage] = useState<string>("");
  const { access, userDetails } = useContext(Context);
  const [classId, setClassId] = useState(access?.classId);
  const [studentChart, setStudentChart] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  useEffect(() => {
    const handleGetStudentAttendance = async () => {
      if (!classId) {
        console.error("classId is required");
        return;
      }
      try {
        // Defining the periodMap object with valid values
        const periodMap: { [key: string]: string } = {
          month: "month",
          week: "week",
          day: "day",
        };

        const response = await ApiAuth.get(
          `/attendance?classId=${classId}&period=${periodMap[timeFrame]}`,
          {
            headers: {
              Authorization: `Bearer ${access?.userToken}`,
            },
          }
        );

        console.log(response?.data?.data);

        const attendanceData: Array<{
          studentId: string[];
          updatedAt: string; // This is the date field
        }> = response?.data?.data;
        console.log("chart", attendanceData);

        const labels: string[] = [];
        const data: number[] = [];

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const currentYear = new Date().getFullYear();

        if (timeFrame === "month") {
          // Generate labels for each month and initialize data
          for (let i = 0; i < 12; i++) {
            labels.push(`${monthNames[i]} ${currentYear}`);
            data.push(0); // Initialize with 0
          }

          // Aggregate data for each month
          attendanceData.forEach((record) => {
            const date = new Date(record.updatedAt);
            const monthIndex = date.getMonth();
            data[monthIndex] += 1;
          });
        } else if (timeFrame === "week") {
          // Generate labels for 4 weeks (assuming 4 weeks per month for simplicity)
          for (let i = 1; i <= 4; i++) {
            labels.push(`Week ${i}`);
            data.push(0); // Initialize with 0
          }

          // Aggregate data for each week
          attendanceData.forEach((record) => {
            const date = new Date(record.updatedAt);
            const weekNumber = Math.ceil(date.getDate() / 7);
            if (weekNumber <= 4) {
              data[weekNumber - 1] += 1;
            }
          });
        } else if (timeFrame === "day") {
          // Generate labels for each day of the month
          const date = new Date();
          const daysInMonth = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
          ).getDate();
          for (let i = 1; i <= daysInMonth; i++) {
            labels.push(`Day ${i}`);
            data.push(0); // Initialize with 0
          }

          // Aggregate data for each day
          attendanceData.forEach((record) => {
            const recordDate = new Date(record.updatedAt);
            const dayOfMonth = recordDate.getDate();
            if (dayOfMonth <= daysInMonth) {
              data[dayOfMonth - 1] += 1;
            }
          });
        }

        const total = data.reduce(
          (acc: number, value: number) => acc + value,
          0
        );
        const percentageData = data.map((value: number) =>
          Number(((value / total) * 100).toFixed(2))
        );

        setStudentChart({
          labels,
          datasets: [
            {
              label: `${
                timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)
              } Data`,
              data: percentageData,
              backgroundColor: "#6C1EEB",
            },
          ],
        });
      } catch (error: any) {
        console.error(
          "Error fetching attendance data:",
          error.response?.data || error.message
        );
      }
    };

    handleGetStudentAttendance();
  }, [classId, timeFrame, access]);

  return (
    <div className="w-full flex flex-col items-center">
      <FormControl variant="outlined" className="mb-5 w-[50%] ">
        <InputLabel id="time-frame">Select Attendance</InputLabel>
        <Select
          labelId="time-frame"
          id="select-timeframe"
          value={timeFrame}
          onChange={(e) =>
            setTimeFrame(e.target.value as "month" | "week" | "day")
          }
          label="Timeframe"
        >
          <MenuItem value="month">Monthly</MenuItem>
          <MenuItem value="week">Weekly</MenuItem>
          <MenuItem value="day">Daily</MenuItem>
        </Select>
      </FormControl>
      <div className="w-full max-w-[600px] h-[400px] sm:h-[300px]">
        <Bar
          // data={data[timeFrame]}
          data={studentChart}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Timeframe",
                },
              },
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: (value) => `${value}%`,
                },
                title: {
                  display: true,
                  text: "Percentage",
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    return `${tooltipItem.raw}%`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ChartSection;
