import React from "react";
import ViewModal from "../header/ViewModal";

interface NewsProps {
  onClose: () => void;
  selectedCampaign: string;
}

const News: React.FC<NewsProps> = ({ onClose, selectedCampaign }) => {
  return (
    <ViewModal
      isVisible={true}
      onClose={onClose}
      text={`${selectedCampaign} Details`}
    >
      <div className="P-4">News</div>
    </ViewModal>
  );
};

export default News;
