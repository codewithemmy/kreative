import React, { useState, useContext, useEffect } from "react";
import ViewModal from "./ViewModal";
import { errorNotifier } from "../utilities/Toast";
import { Context } from "../context/Context";
import ApiAuth from "../api/ApiAuth";
import dayjs from "dayjs";
import Avatar from "../assets/avartar.jpeg";
import Spinner from "../utilities/Spinner";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Notification {
  _id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
}

interface NotificationDetailsProps {
  onCloseModal: () => void;
}

const NotificationDetails: React.FC<NotificationDetailsProps> = ({
  onCloseModal,
}) => {
  const [notification, setNotification] = useState<Notification[]>([]);
  const { adminAccess, access, userDetails } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        let url =
          "/notice?noticeType=announcement&noticeType=event&noticeType=emailSms";
        if (access) {
          if (access.accountType === "student") {
            url += `&userType=User&classId=${access?.classId}`;
          } else if (access.accountType === "teacher") {
            url += `&userType=Admin&branchId=${userDetails?.[0]?.branchId}`;
          }
        } else if (adminAccess) {
          url =
            "/notice?noticeType=announcement&noticeType=event&noticeType=emailSms";
        }

        const response = await ApiAuth.get(url, {
          headers: {
            Authorization: `Bearer ${
              access ? access.userToken : adminAccess?.userToken
            }`,
          },
        });
        setIsLoading(false);
        setNotification(response?.data?.notice || []);
      } catch (error) {
        console.log(error);
        errorNotifier("Failed to get Notification");
      }
    };
    handleFetch();
  }, []);

  return (
    <ViewModal isVisible={true} onClose={onCloseModal} text="Notifications">
      <div className="pb-14 h-full">
        <div className="p-8 h-full">
          {isLoading ? (
            <Spinner />
          ) : (
            <div className="overflow-y-auto h-full p-6">
              {notification.map((data) => {
                const createdAt = dayjs(data?.createdAt);
                const currentDate = dayjs();
                const dateDifference = currentDate.diff(createdAt, "day");
                const formattedDate =
                  dateDifference <= 30
                    ? createdAt.fromNow()
                    : createdAt.format("DD MMM YYYY");

                return (
                  <div key={data?._id} className="mb-4 p-2">
                    <div className="flex mt-2 mb-6">
                      <img
                        src={data?.image || Avatar}
                        alt=""
                        className="h-10 w-10 mr-4 rounded-[50%]"
                      />
                      <div>
                        <p className="text-[#333333] text-[14px]">
                          {data?.title}
                        </p>
                        <h4 className="text-[#6A6868] text-xs">
                          {formattedDate}
                        </h4>

                        <p className="text-[#333333] text-[14px]">
                          {data?.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ViewModal>
  );
};

export default NotificationDetails;
