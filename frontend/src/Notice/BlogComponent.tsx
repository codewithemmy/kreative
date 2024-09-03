import React from "react";
import ViewModal from "../header/ViewModal";

interface BlogComponentProps {
  onClose: () => void;
  selectedCampaign: string;
}

const BlogComponent: React.FC<BlogComponentProps> = ({ onClose, selectedCampaign }) => {
  return (
    <ViewModal
      isVisible={true}
      onClose={onClose}
      text={`${selectedCampaign} Details`}
    >
      <div className="p-4">BlogComponent</div>
    </ViewModal>
  );
};

export default BlogComponent;
