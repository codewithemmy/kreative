import React, { useContext, useEffect } from "react";
import "./index.css";
import { Context, ContextProvider } from "./context/Context";
import { Route, Routes } from "react-router-dom";
import MyCourse from "./users/admin/pages/classes/Classes";
import Home from "./users/admin/pages/home/Home";
import TeachersProfile from "./users/admin/pages/teacher/TeachersProfile";
import ForgotPassword from "./auth/forgetpassword/ForgotPassword";
import Login from "./auth/login-page/Login";
import ParentsDashboard from "./users/parents/pages/home/ParentsDashboard";
import TeachersPage from "./users/admin/pages/teacher/TeachersPage";
import Assignments from "./screens/Assignments";
import ErrorPage from "./utilities/ErrorPage";
import HomePage from "./landingpage/Homepage/Home";
import About from "./landingpage/Aboutpage/About";
import GalleryPage from "./landingpage/GalleryPage/Gallery";
import ContactPage from "./landingpage/contact/ContactPage";
import AdminLogin from "./auth/login-page/AdminLogin";
import TeacherDashboard from "./users/teacher/pages/home/TeacherDashboard";
import TeacherClass from "./users/teacher/pages/myClass/TeacherClass";
import Notices from "./users/admin/pages/notices/Notices";
import ExamRecord from "./users/teacher/components/exams/ExamRecord";
import TeacherSettings from "./users/teacher/pages/profile/TeacherSettings";
import ClassDetails from "./users/admin/pages/classes/ClassDetails";
import MessageCenter from "./users/admin/pages/reports/MessageCenter";
import Branches from "./users/admin/pages/branches/Branches";
import { ToastContainer } from "react-toastify";
import BranchDetails from "./users/admin/pages/branches/BranchDetails";
import StudentsPage from "./users/admin/pages/students/StudentsPage";
import AddNewTeacher from "./users/admin/pages/teacher/AddNewTeacher";
import AddNewStudent from "./users/admin/pages/students/AddNewStudent";
import StudentProfile from "./users/admin/pages/students/StudentProfile";
import AdminProfileSettings from "./users/admin/pages/profile/AdminProfileSettings";
import AdminEditStudent from "./users/admin/pages/students/AdminEditStudent";
import AdminEditTeacher from "./users/admin/pages/teacher/AdminEditTeacher";
import AdminProfile from "./users/admin/pages/profile/AdminProfile";
import ClassEnrolledStudents from "./users/admin/pages/classes/ClassEnrolledStudents";
import ClassEnrolledTeachers from "./users/admin/pages/classes/ClassEnrolledTeachers";
import { UserDetails } from "./api/ApiAuth";
import ClassStudents from "./users/teacher/pages/students/ClassStudents";
import ClassStudentProfile from "./users/teacher/pages/students/ClassStudentProfile";
import { clearLocalStorage } from "./utilities/Utils";
import ResultTemplate from "./users/parents/components/myClass/ResultTemplate";
import ResultSample from "./shared/components/resultTemplate/ResultSample";
import ParentSettings from "./users/parents/pages/profile/ParentSettings";
import ParentClass from "./users/parents/pages/myClass/ParentClass";
import AttendancePage from "./users/teacher/pages/attendance/AttendancePage";
import AdminAttendancePage from "./users/admin/pages/attendance/AdminAttendancePage";

function App() {
  useEffect(() => {
    clearLocalStorage("creativeAdminAccess");
    clearLocalStorage("creativeAccess");
  }, []);

  const {
    access,
    adminAccess,
    userDetails,
    setClassId,
    loadUserDetails,
    loadAdminDetails,
  } = useContext(Context);

  useEffect(() => {
    if (adminAccess) {
      loadAdminDetails();
    }
    if (access) {
      loadUserDetails();
    }
    if (userDetails) {
      setClassId(userDetails?.[0].intendedClass);
    }
  }, [access, adminAccess, userDetails]);


  // const client = useApolloClient();

  // const { data } = useQuery(IS_LOGGED_IN);

  // const notifDispatch = useNotificationDispatch();
  // const { showNotification, notifTitle, notifSubTitle, variant } =
  //   useNotificationState();

  // useEffect(() => {
  //   const token = sessionStorage.getItem("accessToken");

  //   if (token !== null) {
  //     const claim = parseJwt(token);
  //     if (claim !== undefined) {
  //       const tokenExpired = isAfter(new Date(), new Date(claim.exp * 1000));

  //       if (tokenExpired) {
  //         client.cache.gc();
  //         sessionStorage.removeItem("accessToken");
  //         isLoggedInVar(false);
  //       }
  //     }
  //   }
  // }, [client.cache]);

  return (
    <div className="w-full">
      <ContextProvider>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />{" "}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user/home" element={<ParentsDashboard />} />
          <Route path="user/class" element={<ParentClass />} />
          <Route path="user/settings" element={<ParentSettings />} />
          <Route path="/print-results" element={<ResultTemplate />} />
          <Route path="/printresults" element={<ResultSample />} />
          <Route path="user/students/:id" element={<ClassStudentProfile />} />
          <Route path="/teacher/home" element={<TeacherDashboard />} />
          <Route path="/teacher/attendance" element={<AttendancePage />} />
          <Route path="/teacher/students" element={<ClassStudents />} />
          <Route path="/teacher/class-details" element={<TeacherClass />} />
          <Route path="/teacher/settings" element={<TeacherSettings />} />
          <Route
            path="/teacher/students/:id"
            element={<ClassStudentProfile />}
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/students" element={<StudentsPage />} />
          <Route path="/admin/teachers" element={<TeachersPage />} />
          <Route path="/admin/home" element={<Home />} />
          <Route path="/admin/attendance" element={<AdminAttendancePage />} />
          <Route path="/admin/classes" element={<MyCourse />} />
          <Route
            path="/admin/classes/class-students"
            element={<ClassEnrolledStudents />}
          />
          <Route
            path="/admin/classes/class-teachers"
            element={<ClassEnrolledTeachers />}
          />
          <Route
            path="/admin/students/new-student"
            element={<AddNewStudent />}
          />
          <Route
            path="/admin/teachers/new-teacher"
            element={<AddNewTeacher />}
          />
          {/* <Route path="/student-profile" element={<StudentProfile />} /> */}
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/admin/notices" element={<Notices />} />
          <Route path="/admin/reports" element={<MessageCenter />} />
          <Route path="/admin/branches" element={<Branches />} />
          <Route path="/admin/settings" element={<AdminProfileSettings />} />
          <Route path="/admin/classes/:id" element={<ClassDetails />} />
          <Route path="/admin/branches/:id" element={<BranchDetails />} />
          <Route path="/admin/teachers/:id" element={<TeachersProfile />} />
          <Route path="/admin/students/:id" element={<StudentProfile />} />
          <Route path="/admin/admin-profile/:id" element={<AdminProfile />} />
          <Route path="/students/:id" element={<AdminEditStudent />} />
          <Route path="/teachers/:id" element={<AdminEditTeacher />} />
          <Route path="/students/record/:id" element={<ExamRecord />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </ContextProvider>
    </div>
  );
}

export default App;
