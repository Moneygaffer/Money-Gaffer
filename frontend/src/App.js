import { useState } from 'react'
import Signup from "./Pages/Signup"
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Login  from './Pages/Login';
import Dashboard from "./Pages/sidebar/Dashboard";
import Income from './Pages/sidebar/Income';
import Messages from './Pages/sidebar/Messages';
import Analytics from './Pages/sidebar/Analytics';
import FileManager from './Pages/sidebar/FileManager';
import Order from './Pages/sidebar/Order';
import Saved from './Pages/sidebar/Saved';
import Setting from './Pages/sidebar/Settings/ProfilePage';
import Records from './Pages/sidebar/Records';
import Home from "./Pages/Home"
import SideBar from "./components/Sidebar/SideBar"
import ExpenseForm from "./Pages/Expense/ExpenseForm";
import Expenserecords from "./Pages/Expense/Expenserecords";
import Incomerecords from "./Pages/Expense/Incomerecords";
import ProfilePage from "./Pages/sidebar/Settings/ProfilePage";
import First from "./Pages/first";
import First1 from "./Pages/First1";
import Blog from "./Pages/blog";
import Info from './Pages/sidebar/Insurance/Info';
import AccountInfo from './Pages/sidebar/Accountinfo';
import "./App.css";
function App() {   
  const array = ["/", "register", "Login", "login"]     
  return(
   <Router>
    <Routes>
    <Route path="/howitworks" element={<First1/>}></Route>
    <Route path="/blog" element={<Blog/>}></Route>
    </Routes>

      <Routes>
        {/* {console.log(window.location.pathname)} */}
        <Route path="/" element={<First />}/>
        <Route path="/register" element={<Signup/>}></Route>
        <Route path="/login" element={<Login/>}></Route>

        </Routes>
        {array.includes(window.location.pathname)?<></>:

        <SideBar > 
        <Routes>
        {/* <Route path="/" element={<First />} />  */}
        <Route path="/income" element={<Income />} />
        <Route path='/AccountInfo' element={<AccountInfo/>}/>
        <Route path="/messages" element={<ExpenseForm />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/file-manager" element={<FileManager />} />
        <Route path="/order" element={<Order />} />
        <Route path="/saved" element={<Saved />} />
        {/* <Route path="/settings" element={<Setting />} /> */}
        <Route path="/settings/profile" element={<ProfilePage/>} />
       <Route path='/Insurance/info' element={<Info/>}/>
        {/* <Route path="/dashboard" element={<Dashboard/>}/> */}

        <Route path="/Records" element={<Records/>}> </Route>
        {/* <Route path="/Dashboard" element={<Dashboard/>} /> */}
        <Route path="/Expenserecords" element={<Expenserecords/>} />
        <Route path="/Incomerecords" element={<Incomerecords/>} />
        </Routes>
      
        </SideBar>
        
}

   </Router>

  )
  
}
export default App