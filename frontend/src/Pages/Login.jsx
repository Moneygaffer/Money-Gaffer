import { useState, useEffect } from "react";
import "./Login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userId] = useState("");
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await axios.post(
        "https://pfmservices.azurewebsites.net/api/Login?",
        {
          username: username,
          password: password,
        }
      );

      if (loginResponse.data.status === "PASS") {
        const temp = JSON.parse(
          loginResponse.data.data.replace(/ObjectId\("(\w+)"\)/g, '"$1"')
        );
        const temp1 = loginResponse.data.token;
        const temp3 = { token: temp1, ...temp[0] };
        console.log("temp3", temp3);

        sessionStorage.setItem("user", JSON.stringify(temp3));
        axios.defaults.headers.common["Authorization"] = `Bearer ${temp1}`;
        navigate("/dashboard");
      } else {
        setInvalidCredentials(true);
        console.log("Invalid credentials");
      }
    } catch (err) {
      console.error("Error occurred: ", err);
    }
  };

  useEffect(() => {
    if (invalidCredentials) {
      const timeoutId = setTimeout(() => {
        setInvalidCredentials(false);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [invalidCredentials]);

  return (
    <div className="login-container">
      <AnimatePresence>
        {invalidCredentials && (
          <motion.div
            className="error-card"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <p className="error-message" style={{color:"white"}}>Invalid Credentials</p>
          </motion.div>
        )}
      </AnimatePresence>

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
