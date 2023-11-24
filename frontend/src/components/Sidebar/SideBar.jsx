import { NavLink } from "react-router-dom";
import { FaBars, FaHome, FaLock, FaMoneyBill, FaUser } from "react-icons/fa";
import { HiCreditCard } from "react-icons/hi";
import { MdMessage } from "react-icons/md";
import { BiAnalyse, BiSearch } from "react-icons/bi";
import { BiCog } from "react-icons/bi";
import { BsBookFill } from "react-icons/bs";
import { BsFillBookmarksFill } from "react-icons/bs";
import { AiTwotoneFileExclamation } from "react-icons/ai";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LiveTvIcon from "@mui/icons-material/LiveTv";
import ProfileCard from "./ProfileCard";

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <FaHome />,
  },
  {
    path: "/AccountInfo",
    name: "Create Account",
    icon: <AccountCircleIcon fontSize="small" />,
  },
  {
    path: "/income",
    name: "Income",
    icon: <HiCreditCard />,
  },
  {
    path: "/messages",
    name: "Expenses",
    icon: <MdMessage />,
  },
  {
    path: "/investments",
    name: "Investments",
    icon: <BiAnalyse />,
  },
  {
    path: "/insurance",
    name: "Insurance",
    icon: <AiTwotoneFileExclamation />,
  },
  {
    path: "/loan",
    name: "Loans",
    icon: <BsFillBookmarksFill />,
  },
  {
    path: "/settings",
    name: "Settings",
    icon: <BiCog />,
    exact: true,
    subRoutes: [
      {
        path: "/settings/profile",
        name: "ProfilePage",
        icon: <FaUser />,
      },
      {
        path: "/settings/billing",
        name: "Toggle",
        icon: <FaMoneyBill />,
      },
    ],
  },
  {
    path: "/tutorials",
    name: "Tutorials",
    icon: <LiveTvIcon fontSize="small" />,
  },
  {
    path: "/Records",
    name: "Records",
    icon: <BsBookFill />,
  },
];

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isProfileOpen,setIsProfileOpen]=useState(false)
  const toggle = () => setIsOpen(!isOpen);
  const openProfile=()=>setIsProfileOpen(true);
  const closeProfile=()=>setIsProfileOpen(false);
  const session = JSON.parse(sessionStorage.getItem("user"));

  // const userIdObj = session.find((item) => item.Name === "_id");
  // const userId = userIdObj ? userIdObj.Value : null;
  const userIdObj = session && session.Name === "_id" ? session : null;
  const userId = userIdObj ? userIdObj.Value : null;
  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.0,
      },
    },
    show: {
      width: "140px",
      padding: "5px 15px",
      transition: {
        duration: 0.0,
      },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.0,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.0,
      },
    },
  };

  return (
    <>
      <div className="main-container">
        <motion.div className="sidebar"> {/* Removed unnecessary brackets */}
          <div className="top_section">
          <div onClick={openProfile}>
              <AccountCircleIcon fontSize="large" />
            </div>
           
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="logo"
                >
                  Money Gaffer
                </motion.h1>
              )}
            </AnimatePresence>
            <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProfileCard user={session[0].Value} closeProfile={closeProfile} />
          </motion.div>
        )}
      </AnimatePresence>
            <div className="bars">
              <FaBars onClick={toggle} />
            </div>
            </div>

          <div className="search">
            <div className="search_icon">
              <BiSearch />
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.input
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={inputAnimation}
                  type="text"
                  placeholder="Search"
                />
              )}
            </AnimatePresence>
          </div>
          
          <section className="routes">
            {routes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    key={index}
                    setIsOpen={setIsOpen}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                  />
                );
              }
              return (
                <NavLink
                  to={route.path}
                  key={index}
                  className="link"
                  activeClassName="active"
                >
                  <div className="icon">{route.icon}</div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                      >
                        {route.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </section>
        </motion.div>

        <main>{children}</main>
      </div>
    </>
  );
};

export default SideBar;
