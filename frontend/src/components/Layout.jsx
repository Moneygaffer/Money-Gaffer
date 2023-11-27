import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import SideBar from './Sidebar/SideBar'

const Layout = () => {
    var data = null;
    if (sessionStorage.getItem("user")) {
         data = sessionStorage.getItem("user")
    }
  return (
    <>
      {data && data !== null ? <><SideBar><Outlet/></SideBar></> :<Navigate to={"/login"}/>}
    </>
  )
}

export default Layout
