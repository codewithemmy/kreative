import React, { useEffect, useState, useContext } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ApiAuth from "../../../api/ApiAuth";
import { Context } from "../../../context/Context";
import { errorNotifier } from "../../../utilities/Toast"; // Assuming errorNotifier is imported correctly

dayjs.extend(relativeTime);

interface Notification {
  _id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  date: string;
  time: string;
}

const EventNotice = () => {
  const [noticeEvent, setNoticeEvent] = useState<Notification[]>([]);
  const { access } = useContext(Context);

  const colors = ["#FF5733", "#6A0DAD"]; // Red and Purple

  useEffect(() => {
    const fetchNoticeEvent = async () => {
      try {
        const response = await ApiAuth.get(`/notice?noticeType=event`, {
          headers: {
            Authorization: `Bearer ${access?.userToken}`,
          },
        });

        setNoticeEvent(response?.data?.notice || []);
        console.log(response?.data?.notice || []);
      } catch (error) {
        console.log(error);
        errorNotifier("Failed to get Notification");
      }
    };
    fetchNoticeEvent();
  }, [access?.userToken]);

  return (
    <div>
      <div className="mt-12">
        <h1 className="font-bold text-lg pb-4">Upcoming Events</h1>
        <div className="flex flex-col lg:flex-row flex-wrap gap-6 overflow-x-scroll">
          {noticeEvent.map((events, index) => {
            const createdAt = dayjs(events.createdAt);
            const formattedDate = createdAt.format("DD MMM YYYY");
            const formattedTime = createdAt.format(" h:mm A");

            const color = colors[index % 2]; // Alternate colors based on index Using index % 2, we alternate between the two colors. If the index is even (0, 2, 4, ...), it will use the first color (red). If the index is odd (1, 3, 5, ...), it will use the second color (purple).

            return (
              <div
                className="bg-white rounded-xl shadow-lg p-6 mb-4"
                key={events?._id}
                style={{ borderTop: `4px solid ${color}` }} // Assign alternating colors
              >
                <h1 className="text-gray-800 text-lg font-semibold">
                  {events?.title}
                </h1>
                <p className="text-gray-400 font-normal">
                  Date Posted:{formattedDate}
                </p>
                {/* <p className="text-gray-400">{formattedTime}</p> */}
                <p className="">{events?.content}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventNotice;
