import ApiAuth, { AdminAccessDetails } from "../api/ApiAuth";


export const handleGetReport = async (adminAccess: AdminAccessDetails ) => {
  try {
    const response = await ApiAuth.get(`/admin/report-analysis`, {
      headers: {
        Authorization: "Bearer " + adminAccess.userToken,
      },
    });
    return response?.data?.data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const handleGetUsers = async (adminAccess: AdminAccessDetails ) => {
  try {
    const response = await ApiAuth.get(`/admin/user?sort=desc`, {
      headers: {
        Authorization: "Bearer " + adminAccess.userToken,
      },
    });
    return response?.data?.data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

  
  