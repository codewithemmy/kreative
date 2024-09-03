import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Collapse, MobileNav } from "@material-tailwind/react";
import { creative_logo } from "../../../utilities/Utils";

const Navbar = () => {
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul
      className="items-center lg:px-0 text-black justify-center space-y-2 lg:flex lg:space-x-12 lg:space-y-0 font-
    DM Sans"
    >
      <li className="px-1 py-1">
        <NavLink to="/" className="hover:text-hover text-sm font-semibold">
          Home
        </NavLink>
      </li>
      <li className="px-1 py-1">
        <NavLink to="/about" className="hover:text-hover text-sm font-semibold">
          About us
        </NavLink>
      </li>
      <li className="px-1 py-1">
        <NavLink
          to="/gallery"
          className="hover:text-hover text-sm font-semibold"
        >
          Gallery
        </NavLink>
      </li>
      <li className="px-1 py-1">
        <NavLink
          to="/contact"
          className="hover:text-hover text-sm font-semibold"
        >
          Contact us
        </NavLink>
      </li>
    </ul>
  );

  return (
    <div className="w-full bg-white py-2 lg:py-4 px-4 md:px-10 border-none rounded-none z-50 sticky top-0 left-0 right-0">
      <div className="w-full mx-auto flex items-center justify-between text-blue-gray-900">
        <Link to="/" className="flex items-center justify-start gap-x-1">
          <div className="nav-logo w-8 h-8 rounded-full">
            <img
              src={creative_logo}
              id="nav-logo"
              color="white"
              className="w-full h-full block"
            />
          </div>
          <h2 className="hidden lg:flex font-bold text-primary hover:text-hover italic">
            CreativeKiddiesAcademy
          </h2>
        </Link>
        <div className="hidden w-3/5 lg:flex gap-x-15 items-center justify-end px-3">
          {navList}
          <span className="auth-btn ml-2 items-center">
            <Link
              to="/login"
              className="bg-primary text-white py-2 px-4 ml-3 inline-block rounded-md text-sm hover:bg-hover"
            >
              Login
            </Link>
          </span>
        </div>
        <button
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6 stroke-primary border-primary border-2"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 stroke-primary  border-primary border-1"
              fill="none"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>
      <Collapse open={openNav}>
        {navList}{" "}
        <span className="auth-btn m-1 items-center">
          <Link
            to="/login"
            className="bg-primary text-white py-2 px-4 mt-2 inline-block rounded-md text-sm hover:bg-hover"
          >
            Login
          </Link>
        </span>
      </Collapse>
    </div>
  );
};

export default Navbar;
