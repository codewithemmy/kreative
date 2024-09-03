import React from "react";
import SMSDetails from "./NoticeDetails/SMSDetails";
import NewsletterDetails from "./NoticeDetails/NewsletterDetails";
import ViewModal from "../header/ViewModal";
import AnnouncementDetails from "./NoticeDetails/AnnouncementDetails";
import AssignmentDetails from "./NoticeDetails/AssignmentDetails";

interface NoticeDetailProps {
  onCloseModal: () => void;
  datum: {
    _id: string;
    title: string;
    notice: string;
    noticeType: string;
    accountType: string;
    createdAt: string;
  };
}

const NoticeDetails: React.FC<NoticeDetailProps> = ({
  onCloseModal,
  datum,
}) => {
  const capitalLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const renderNoticeDetails = () => {
    switch (datum?.noticeType) {
      case "email":
        return <SMSDetails data={datum} />;
      case "announcement":
        return <AnnouncementDetails data={datum} />;
      case "adverts":
        return <AssignmentDetails data={datum} />;
      case "events":
        return <NewsletterDetails data={datum} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <ViewModal
        isVisible={true}
        onClose={onCloseModal}
        text={`${capitalLetter(datum?.noticeType)} Details`}
      >
        {renderNoticeDetails()}
      </ViewModal>
    </div>
  );
};

export default NoticeDetails;
