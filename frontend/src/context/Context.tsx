import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  authenticateUser,
  gAuthenticateUser,
  getUserDetails,
  authenticateAdmin,
  getAdminDetails,
} from "../api/ApiAuth";
import {
  clearLocalStorage,
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utilities/Utils";
import addNotification from "react-push-notification";
import { errorNotifier } from "../utilities/Toast";

export interface UserAccess {
  userId: string;
  userToken: string;
  accountType: string;
  classId: string;
}

export interface AdminAccess {
  userId: string;
  userToken: string;
  accountType: string;
}

export interface UserDetails {
  [key: string]: any;
}

export interface AdminDetails {
  [key: string]: any;
}

type TermOption = "first" | "second" | "third";

type YearOption =
  | "2021"
  | "2022"
  | "2023"
  | "2024"
  | "2025"
  | "2026"
  | "2027"
  | "2028"
  | "2029"
  | "2030"
  | "2031"
  | "2032";

export interface ContextValue {
  userDetails: UserDetails | null;
  adminDetails: AdminDetails | null;
  adminTab: string;
  access: UserAccess | null;
  adminAccess: AdminAccess | null;
  setAdminAccess: React.Dispatch<React.SetStateAction<AdminAccess | null>>;
  setAccess: React.Dispatch<React.SetStateAction<UserAccess | null>>;
  tabSidebar: string;
  sent: boolean;
  setSent: React.Dispatch<React.SetStateAction<boolean>>;
  setTabSidebar: React.Dispatch<React.SetStateAction<string>>;
  setAdminTab: React.Dispatch<React.SetStateAction<string>>;
  parentTab: string;
  setParentTab: React.Dispatch<React.SetStateAction<string>>;
  teacherTab: string;
  setTeacherTab: React.Dispatch<React.SetStateAction<string>>;
  classId: string;
  setClassId: React.Dispatch<React.SetStateAction<string>>;
  selectedTerm: TermOption;
  setSelectedTerm: React.Dispatch<React.SetStateAction<TermOption>>;
  selectedYear: YearOption;
  setSelectedYear: React.Dispatch<React.SetStateAction<YearOption>>;
  login: (data: any, endpoint: string) => Promise<void>;
  GLogin: (data: any) => Promise<void>;
  adminLogin: (data: any) => Promise<void>;
  logout: () => void;
  adminLogout: () => void;
  teacherLogout: () => void;
  loadUserDetails: () => Promise<void>;
  newMessageNotification: boolean;
  setNewMessageNotification: React.Dispatch<React.SetStateAction<boolean>>;
  loadAdminDetails: () => Promise<void>;
}

export const Context = createContext<ContextValue>({
  userDetails: null,
  adminDetails: null,
  adminTab: "",
  access: null,
  adminAccess: null,
  sent: false,
  setSent: () => {},
  setAdminAccess: () => {},
  setAccess: () => {},
  tabSidebar: "",
  setTabSidebar: () => {},
  setAdminTab: () => {},
  parentTab: "",
  setParentTab: () => {},
  teacherTab: "",
  setTeacherTab: () => {},
  classId: "",
  setClassId: () => {},
  selectedTerm: "first",
  setSelectedTerm: () => {},
  selectedYear: "2024",
  setSelectedYear: () => {},
  login: async () => {},
  GLogin: async () => {},
  adminLogin: async () => {},
  logout: () => {},
  adminLogout: () => {},
  teacherLogout: () => {},
  loadUserDetails: async () => {},
  newMessageNotification: false,
  setNewMessageNotification: () => {},
  loadAdminDetails: async () => {},
});

interface ContextProviderProps {
  children: ReactNode;
}

export function ContextProvider({ children }: ContextProviderProps) {
  const navigate = useNavigate();
  const [access, setAccess] = useState<UserAccess | null>(
    loadFromLocalStorage("creativeAccess") || null
  );
  const [adminAccess, setAdminAccess] = useState<AdminAccess | null>(
    loadFromLocalStorage("creativeAdminAccess") || null
  );
  const [selectedTerm, setSelectedTerm] = useState<TermOption>(
    loadFromLocalStorage("creativeSelectedTerm") || "first"
  );
  const [selectedYear, setSelectedYear] = useState<YearOption>(
    loadFromLocalStorage("creativeSelectedYear") || "2024"
  );
  const [classId, setClassId] = useState<string>(
    loadFromLocalStorage("creativeClassId") || ""
  );
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [sent, setSent] = useState<boolean>(
    loadFromLocalStorage("creativeSent") || false
  );
  const [adminDetails, setAdminDetails] = useState<AdminDetails | null>(null);
  const [adminTab, setAdminTab] = useState<string>("home");
  const [tabSidebar, setTabSidebar] = useState<string>("home");
  const [parentTab, setParentTab] = useState<string>("home");
  const [teacherTab, setTeacherTab] = useState<string>("home");
  const [newMessageNotification, setNewMessageNotification] =
    useState<boolean>(false);
  const [isUserActive, setIsUserActive] = useState<boolean>(true);
  const logoutTimerRef = useRef<any>(null);
  const LOGOUT_TIME = 1000 * 60 * 4;

  const resetLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    logoutTimerRef.current = setTimeout(logoutUser, LOGOUT_TIME);
  };

  const logoutUser = () => {
    if (access) {
      logout();
      handleApiError("", "Login to continue.");
    } else if (adminAccess) {
      adminLogout();
      handleApiError("", "Login to continue.");
    }
  };

  useEffect(() => {
    const activityListener = () => {
      setIsUserActive(true);
      resetLogoutTimer();
    };

    const events = [
      "touchstart",
      "touchmove",
      "touchend",
      "mousemove",
      "keypress",
    ];

    const bindEvents = () => {
      events.forEach((event) =>
        document.addEventListener(event, activityListener)
      );
    };

    const unbindEvents = () => {
      events.forEach((event) =>
        document.removeEventListener(event, activityListener)
      );
    };

    bindEvents();
    resetLogoutTimer();

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
      unbindEvents();
    };
  }, []);

  useEffect(() => {
    if (isUserActive) {
      resetLogoutTimer();
    }
  }, [isUserActive]);

  useEffect(() => {
    saveToLocalStorage("creativeAccess", access);
  }, [access]);

  useEffect(() => {
    saveToLocalStorage("creativeSent", sent);
  }, [sent]);

  useEffect(() => {
    saveToLocalStorage("creativeClassId", classId);
  }, [classId]);

  useEffect(() => {
    saveToLocalStorage("creativeSelectedTerm", selectedTerm);
  }, [selectedTerm]);

  useEffect(() => {
    saveToLocalStorage("creativeSelectedYear", selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    saveToLocalStorage("creativeAdminAccess", adminAccess);
  }, [adminAccess]);

  useEffect(() => {
    if (access && userDetails === null) {
      loadUserDetails();
    }
  }, [access, userDetails]);

  useEffect(() => {
    if (adminAccess && adminDetails === null) {
      loadAdminDetails();
    }
  }, [adminAccess, adminDetails]);

  const loadUserDetails = async () => {
    if (access !== null) {
      try {
        const response = await getUserDetails(
          access.userId,
          access.userToken,
          access.accountType
        );
        setUserDetails(response);
      } catch (error) {
        handleApiError(error, "Error fetching user details");
      }
    }
  };

  const loadAdminDetails = async () => {
    if (adminAccess !== null) {
      try {
        const response = await getAdminDetails(
          adminAccess.userToken,
          adminAccess.userId
        );
        setAdminDetails(response);
      } catch (error) {
        // handleApiError(error, "Your internet is down, reconnect to continue");
      }
    }
  };

  const login = async (data: any, endpoint: string) => {
    try {
      const response = await authenticateUser(data, endpoint);
      setAccess(response);
    } catch (error) {
      handleApiError(error, "Error during login");
    }
  };

  const GLogin = async (data: any) => {
    try {
      const response = await gAuthenticateUser(data);
      setAccess(response);
    } catch (error) {
      handleApiError(error, "Error during login");
    }
  };

  const adminLogin = async (data: any) => {
    try {
      const response = await authenticateAdmin(data);
      setAdminAccess(response);
    } catch (error) {
      handleApiError(error, "Error during login");
    }
  };

  const logout = () => {
    setAccess(null);
    setUserDetails(null);
    setAdminAccess(null);
    setAdminDetails(null);
    clearLocalStorage("creativeAccess");
    clearLocalStorage("creativeAdminAccess");
    navigate("/login");
  };

  const adminLogout = () => {
    setAccess(null);
    setUserDetails(null);
    setAdminAccess(null);
    setAdminDetails(null);
    clearLocalStorage("creativeAccess");
    clearLocalStorage("creativeAdminAccess");
    navigate("/admin/login");
  };

  const teacherLogout = () => {
    setAccess(null);
    setUserDetails(null);
    setAdminAccess(null);
    setAdminDetails(null);
    clearLocalStorage("creativeAccess");
    clearLocalStorage("creativeAdminAccess");
    navigate("/login");
  };

  const handleApiError = (error: any, message: string) => {
    if (error.response !== undefined) {
      if (error.response.data.message === "Unable to verify token.") {
        errorNotifier("Access Expired! Login again");
        if (access) {
          logout();
        } else {
          adminLogout();
        }
      } else {
        errorNotifier(error.response.data.message);
      }
    }
  };

  const contextValue: ContextValue = {
    userDetails,
    adminDetails,
    adminTab,
    access,
    adminAccess,
    setAdminAccess,
    setAccess,
    tabSidebar,
    setTabSidebar,
    setAdminTab,
    parentTab,
    setParentTab,
    teacherTab,
    setTeacherTab,
    classId,
    setClassId,
    selectedTerm,
    setSelectedTerm,
    selectedYear,
    setSelectedYear,
    login,
    sent,
    setSent,
    GLogin,
    adminLogin,
    logout,
    teacherLogout,
    adminLogout,
    loadUserDetails,
    newMessageNotification,
    setNewMessageNotification,
    loadAdminDetails,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
