import axios, { AxiosResponse } from "axios";
const baseURL: string = import.meta.env.VITE_BASEURL_ENDPOINT;

const ApiAuth = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
});

export default ApiAuth;

export interface UserAccessDetails {
  accountType: string;
  userToken: string;
  userId: string;
  classId: string;
}

export interface AdminAccessDetails {
  accountType: string;
  userToken: string;
  userId: string;
}

export interface ErrorResponse {
  message: string;
}

export interface AdminDetails {
  [key: string]: any;
}

export interface UserDetails {
  [key: string]: any;
}

export const authenticateUser = async (
  data: any,
  endpoint: string
): Promise<UserAccessDetails> => {
  try {
    const response: AxiosResponse = await ApiAuth.post(`${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const userAccessDetails: UserAccessDetails = {
      accountType: response?.data.data.accountType,
      userToken: response?.data.data.token,
      userId: response?.data.data._id,
      classId: response?.data.data.intendedClass,
    };
    return userAccessDetails;
  } catch (error: any) {
    let message: string = "Not responding at the moment";
    if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    throw error;
  }
};

export const gAuthenticateUser = async (
  data: any
): Promise<UserAccessDetails> => {
  try {
    const response: AxiosResponse = await ApiAuth.post(
      `/auth/google/login`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const userAccessDetails: UserAccessDetails = {
      accountType: response?.data.data.accountType,
      userToken: response?.data.data.token,
      userId: response?.data.data._id,
      classId: response?.data.data.intendedClass,
    };
    return userAccessDetails;
  } catch (error: any) {
    let message: string = "Not responding at the moment";
    if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    throw error;
  }
};

export const gSignupAuthenticateUser = async (
  data: any
): Promise<UserAccessDetails> => {
  try {
    const response: AxiosResponse = await ApiAuth.post(`/auth/sign-up`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const userAccessDetails: UserAccessDetails = {
      accountType: response?.data.data.accountType,
      userToken: response?.data.data.token,
      userId: response?.data.data._id,
      classId: response?.data.data.intendedClass,
    };

    return userAccessDetails;
  } catch (error: any) {
    let message: string = "Not responding at the moment";
    if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    throw error;
  }
};

export const authenticateAdmin = async (
  data: any
): Promise<AdminAccessDetails> => {
  try {
    const response: AxiosResponse = await ApiAuth.post(`/admin/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const adminAccessDetails: AdminAccessDetails = {
      accountType: response?.data.data.admin.accountType,
      userToken: response?.data.data.token,
      userId: response?.data.data.admin._id,
    };
    return adminAccessDetails;
  } catch (error: any) {
    let message: string = "Not responding at the moment";
    if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    throw error;
  }
};

export const getAdminDetails = async (
  token: string,
  id: string
): Promise<AdminDetails> => {
  try {
    const response = await ApiAuth.get(`/admin?_id=${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const adminDetails: AdminDetails = response.data.data;
    return adminDetails;
  } catch (error: any) {
    let message: string = "Not responding at the moment";
    if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    throw error;
  }
};

export const getUserDetails = async (
  id: string,
  token: string,
  type: string
): Promise<UserDetails> => {
  try {
    const response: AxiosResponse =
      type === "teacher"
        ? await ApiAuth.get(`/user?_id=${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
        : await ApiAuth.get(`/student?_id=${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
    const userDetails: UserDetails =
      type === "teacher" ? response.data.data.data : response.data.data;
    return userDetails;
  } catch (error: any) {
    let message: string = "Not responding at the moment";
    if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    throw error;
  }
};
