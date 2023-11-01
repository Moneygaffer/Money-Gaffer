import { useState,useEffect } from "react";
import "./Login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userId,setUserId]=useState("");


  const navigate = useNavigate();
  const apiUrl = "https://omnireports.azurewebsites.net/api/CRUD_irwb"; 

// const fetchUserData = async () => {
//   try {
//     const response = await axios.post(apiUrl, {
//       crudtype: 2,
//       recordid: null,
//       collectionname: "irwbusers",
//     });

//     console.log("Complete Response: ", response);

//     let responseData = response.data;
//     console.log("Response Data: ", responseData);
//     if (typeof responseData === "object" && responseData.data) {
//       if (typeof responseData.data === "string") {
//         responseData.data = JSON.parse(responseData.data.replace(/ObjectId\("(\w+)"\)/g, '"$1"'));
//       }
//     } else {
//       console.error("Data is not in the expected format");
//       return;
//     }

//     console.log("Parsed Data: ", responseData.data);

//     if (Array.isArray(responseData.data)) {
//       const matchingUser = responseData.data.find(
//         (user) => user.username === username
//       );

//       if (matchingUser) {
//         const userId = matchingUser._id;
//         console.log("User ID:", userId);
//         setUserId(userId);
//       } else {
//         console.error("Invalid username or password");
//       }
//     } }catch (error) {
//       console.error("API Error:", error);
//     }
//   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // await fetchUserData(); 

      const loginResponse = await axios.post(
        "https://omnireports.azurewebsites.net/api/Login",
        {
          username: username,
          password: password,
        }
      );


      if (loginResponse.data.status === "PASS") {
      const temp =   JSON.parse(loginResponse.data.data.replace(/ObjectId\("(\w+)"\)/g, '"$1"'));
      console.log(temp)
        sessionStorage.setItem("user", JSON.stringify(temp[0]))
        navigate("/dashboard");
        
      } else {
        console.log("Invalid credentials");
      }
    } catch (err) {
      console.error("Error occurred: ", err);
    }
  };

  useEffect(() => {
   
  }, []);
  
  
  return (
    <div className="login-container">
      <motion.div
        className="login-box"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
          <>
        <h2 className="login-heading">Welcome Back</h2>
        <p className="login-content">
          Log in to access your account and manage your finances.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              autoComplete="off"
              name="username"
              className="login-input"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              autoComplete="off"
              name="password"
              className="login-input"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <motion.button
            type="submit"
            className="login-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </form>
        <p className="signup-link">
          Don't have an account? <Link to="/register">Signup</Link>
        </p>
        {userId && <p>User ID: {userId}</p>}
        </>
      </motion.div>
 </div>
);
}

export default Login;