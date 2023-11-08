import React from 'react'
import Cards from './Cards'
import Details from './Details'
import Graph from './Graph'
import ChatBot from './ChatBot'
import SideBarHomeCSS from './SideBarHome.module.css';

const SideBarHome = () => {
  return (
    <div className={SideBarHomeCSS.sidebarhome}>
      <div className={SideBarHomeCSS.home_cards}><Cards /></div>
          <div className={SideBarHomeCSS.home_main}>
          <Details/>
          <Graph/>
          <div className={SideBarHomeCSS.chat_bot}><ChatBot/></div>
      </div>
    </div>
  )
}

export default SideBarHome;