import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import qs from "querystring";
import "./Register.css";
import Nav from "./Nav";
import Footer from "./Footer";
export default function Register() {
  const [users, SetUser] = useState({
    username: "",
    email: "",
    password: "",
    cfpassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const checkEmailUnique = async () => {
    const checkData = {
      email: users.email,
    };
    const formData = qs.stringify(checkData);

    try {
      const response = await axios.post(
        `http://localhost/php_auth+react/Backend/api/check_email_unique.php`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.exists) {
        setError("Email already exists");
        return false;
      }

      return true;
    } catch (error) {
      console.error(error);
      setError("Error checking email");
      return false;
    }
  };

  const checkUsernameUnique = async () => {
    const checkData = {
      username: users.username,
    };
    const formData = qs.stringify(checkData);

    try {
      const response = await axios.post(
        `http://localhost/php_auth+react/Backend/api/check_username_unique.php`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.exists) {
        setError("Username already exists");
        return false;
      }

      return true;
    } catch (error) {
      console.error(error);
      setError("Error checking username");
      return false;
    }
  };
  const register = async (e) => {
    e.preventDefault();
    // Check empty
    if (
      !users.username ||
      !users.email ||
      !users.password ||
      !users.cfpassword
    ) {
      setError("All field is required");
      return;
    }

    if (users.password !== users.cfpassword) {
      setError("Passwords do not match");
      return;
    }
    // Check email uniqueness
    const isEmailUnique = await checkEmailUnique();
    if (!isEmailUnique) {
      return;
    }

    // Check username uniqueness
    const isUsernameUnique = await checkUsernameUnique();
    if (!isUsernameUnique) {
      return;
    }
    try {
      const data = {
        username: users.username,
        email: users.email,
        password: users.password,
      };
      await axios.post(
        `http://localhost/php_auth+react/Backend/api/register_api.php`,
        data
      );
      document.getElementById("registerForm").reset();
      setSuccess("Register succesfuly");
    } catch (error) {
      // console.log(error);
      setError("Error registering user"); // Generic error message
    }
  };
  return (
    <>
      <div className="container">
        <Nav />
        <form id="registerForm" method="post" onSubmit={register}>
          <h1 className="h3 mb-3 fw-normal text-center">Sign Up</h1>
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-floating my-3">
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Username"
              onChange={(e) => SetUser({ ...users, username: e.target.value })}
            />
            <label>Username</label>
          </div>
          <div className="form-floating my-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="name@example.com"
              onChange={(e) => SetUser({ ...users, email: e.target.value })}
            />
            <label>Email address</label>
          </div>
          <div className="form-floating my-3">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              onChange={(e) => SetUser({ ...users, password: e.target.value })}
            />
            <label>Password</label>
          </div>
          <div className="form-floating my-3">
            <input
              type="password"
              className="form-control"
              id="cfPassword"
              placeholder="Password"
              onChange={(e) =>
                SetUser({ ...users, cfpassword: e.target.value })
              }
            />
            <label>Confirm Password</label>
          </div>
          <button className="btn btn-primary py-2" type="submit">
            Sign up
          </button>
          <p className="mt-5 mb-3 text-body-secondary">
            Have already an account? <Link to="/login">Signin</Link>
          </p>
        </form>
        <Footer />
      </div>
    </>
  );
}
