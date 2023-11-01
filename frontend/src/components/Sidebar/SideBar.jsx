import { NavLink } from "react-router-dom";
import { FaBars, FaHome, FaLock, FaMoneyBill, FaUser } from "react-icons/fa";
import { HiCreditCard } from "react-icons/hi";
import { MdMessage } from "react-icons/md";
import { BiAnalyse, BiSearch } from "react-icons/bi";
import { FaElementor } from "react-icons/fa";
import { BiCog } from "react-icons/bi";
import {BsBookFill} from "react-icons/bs";
import { BsFillBookmarksFill } from "react-icons/bs";
import { AiFillHeart, AiTwotoneFileExclamation } from "react-icons/ai";
import { BsCartCheck } from "react-icons/bs";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";
import PersonIcon from '@mui/icons-material/Person';
const routes = [
  {
    path: "/Home",
    name: "Dashboard",
    icon: <FaHome />,
  },
  {
    path:"/AccountInfo",
    name:"Create Account",
    icon:<PersonIcon/>
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
    path: "/analytics",
    name: "Savings",
    icon: <BiAnalyse />,
  },
  {
    path: "/file-manager",
    name: "Insurance",
    icon: <AiTwotoneFileExclamation />,
    subRoutes: [
      {
        path: "/Insurance/info",
        name: "Insurance funda",
        icon: <FaUser />,
      },
     
    ],
  },
  {
    path: "/order",
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
        name: "Profile ",
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
    path: "/saved",
    name: "My Locker",
    icon: <FaElementor />,
  },
  {
    path: "/Records",
    name: "Records",
    icon: <BsBookFill />,
  },
];

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(true);
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
      <div className="main-container" >
        <motion.div
          // animate={{
          //   width: isOpen ? "300px" : "45px",

          //   transition: {
          //     duration: 0.0,
          //     type: "spring",
          //     damping: 10,
          //   },   
          // }}
          className={"sidebar"}
        >
          <div className="top_section">
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

        <main >{children   }</main>
      </div>
    </>
  );
};

export default SideBar;
