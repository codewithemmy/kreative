import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrClose } from "react-icons/gr";
import { creative_logo } from "../../../utilities/Utils";
import { Context } from "../../../context/Context";
import "./sidebar.css";

interface SidebarBuildersProps {}

const ParentSidebar: React.FC<SidebarBuildersProps> = () => {
  const { parentTab, setParentTab, logout, access } = useContext(Context);
  const [userSidebar, setUserSidebar] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const tab = location.pathname.split("/user/")[1]?.split("/")[0];
    handleTabClick(tab, location.pathname);
  }, [location.pathname]);

  const handleTabClick = (tabName: string, to: string) => {
    setParentTab(tabName);
    setUserSidebar(false);
    navigate(`${to}`);
  };

  return (
    <div
      className={`bg-primary py-5 lg:py-0 lg:pt-8 fixed z-20 top-0 left-0 pl-5 lg:min-h-screen flex flex-col justify-between md:justify-between md:flex-col lg:justify-start lg:flex-col w-full lg:w-[15%]`}
    >
      <div className="flex justify-between items-center">
        <img
          className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:ml-6 lg:mb-6 rounded-full"
          src={creative_logo}
          alt="logo"
        />
        <button
          className="lg:hidden text-2xl py-2 text-grayText rounded-md outline-none focus:border-gray-400"
          onClick={() => setUserSidebar(!userSidebar)}
        >
          {userSidebar ? (
            <GrClose className="mr-2" />
          ) : (
            <GiHamburgerMenu className="mr-2" />
          )}
        </button>
      </div>
      <ul
        className={`absolute pl-2 mx-0 left-0 top-[3.4rem] lg:top-0 lg:-mt-1 lg:static ${
          userSidebar
            ? "left-0 w-1/2 md:w-[25%] min-h-screen  lg:w-auto lg:h-auto"
            : "left-[-55rem] min-h-screen lg:h-auto lg:left-0"
        } sidebar-ul lg:mt-8 mt-6 bg-primary transition-all duration-1000 ease-in`}
      >
        <li
          className={`text-sm my-5 p-2 text-white ${
            parentTab === "home" ? "active" : ""
          }`}
        >
          <Link
            to="/user/home"
            className="flex justify-start items-center space-x-4"
            onClick={() => {
              handleTabClick("home", "/user/home");
            }}
          >
            <div className="icon">
              <i className="fas fa-home home__icon"></i>
            </div>{" "}
            <div className="">Home</div>
          </Link>
        </li>
        <li
          className={`text-sm my-5 p-2  text-white ${
            parentTab === "students" ? "active" : ""
          }`}
        >
          <Link
            to="/user/class"
            className="flex justify-start items-center space-x-4 "
            onClick={() => {
              handleTabClick("class", "/user/class");
            }}
          >
            <div className="icon">
              <i className="far fa-file-alt home__icon"></i>
            </div>{" "}
            <div>My Class</div>
          </Link>
        </li>
    
        <li
          className={`text-sm my-5 p-2 text-white ${
            parentTab === "settings" ? "active" : ""
          }`}
        >
          <Link
            to="/user/settings"
            className="flex justify-start items-center space-x-4"
            onClick={() => {
              handleTabClick("settings", "/user/settings");
            }}
          >
            <div className="icon">
              <i className="far fa-envelope home__icon"></i>
            </div>{" "}
            <div>Settings</div>
          </Link>
        </li>
        <li className="text-sm mt-8 p-3 text-orange-500">
          <button
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
            className="flex justify-start items-center space-x-4"
          >
            <div className="icon">
              <i className="far fa-user home__icon"></i>
            </div>{" "}
            <div>Logout</div>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ParentSidebar;
