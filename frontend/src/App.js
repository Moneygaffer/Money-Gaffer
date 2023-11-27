import Signup from "./Pages/Signup";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./Pages/Login";
import Income from "./Pages/sidebar/Income";
import Records from "./Pages/sidebar/Records";
import ExpenseForm from "./Pages/Expense/ExpenseForm";
import Expenserecords from "./Pages/Expense/Expenserecords";
import Incomerecords from "./Pages/Expense/Incomerecords";
import ProfilePage from "./Pages/sidebar/Settings/ProfilePage";
import First from "./Pages/first";
import First1 from "./Pages/First1";
import Blog from "./Pages/blog";
import AccountInfo from "./Pages/sidebar/Accountinfo";
import "./App.css";
import Investments from "./Pages/sidebar/Investments/Investments";
import Loan from "./Pages/sidebar/Loan/Loan";
import InsuranceForm from "./Pages/sidebar/Insurance/InsuranceForm";
import Tutorials from "./Pages/sidebar/Tutorials";
import SideBarHome from "./components/SideBarHome";
import Layout from "./components/Layout";

function App() {
  const array = ["/", "register", "login","Login"];

  return (
    <Router>
      <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Signup />}/>

            
            <Route element={<Layout />}>
              <Route path="/howitworks" element={<First1 />}></Route>
              <Route path="/blog" element={<Blog />}></Route>
              <Route path="/dashboard" element={<SideBarHome />} />
              <Route path="/income" element={<Income />} />
              <Route path="/AccountInfo" element={<AccountInfo />} />
              <Route path="/messages" element={<ExpenseForm />} />
              <Route path="/investments" element={<Investments />} />
              <Route path="/insurance" element={<InsuranceForm />} />
              <Route path="/loan" element={<Loan />} />
              <Route path="/settings/profile" element={<ProfilePage/>} />
              <Route path="/tutorials" element={<Tutorials />}/>
              <Route path="/Records" element={<Records />}/>
              <Route path="/Expenserecords" element={<Expenserecords />} />
              <Route path="/Incomerecords" element={<Incomerecords />} />
            </Route>
            <Route path="*" element={<First/>}/>
          </Routes>
    </Router>
  );
}
export default App;
