import axios from "axios";
import { useState, useEffect } from "react";
import "./Register.css";
import Nav from "./Nav";
import Footer from "./Footer";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "querystring";
export default function Resetpw() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const [password, SetPassword] = useState({
    password: "",
    cfpassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Check if token is not available, redirect to desired page
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const reset = async (e) => {
    e.preventDefault();
    // Check empty
    if (!password.password || !password.cfpassword) {
      setError("Password is required");
      return;
    }
    if (password.password !== password.cfpassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const formData = {
        new_password: password.password,
        token: token,
      };
      console.log(formData);
      const response = await axios.post(
        `http://localhost/php_auth+react/Backend/api/resetpassword_api.php`,
        qs.stringify(formData),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const data = response.data;
      if (response.status === 200) {
        setMessage(data.message);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    }
  };
  return (
    <>
      <div className="container">
        <Nav />
        <form method="post" onSubmit={reset}>
          <h1 className="h3 mb-3 fw-normal text-center">Reset password</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          <div className="form-floating my-3">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              onChange={(e) =>
                SetPassword({ ...password, password: e.target.value })
              }
            />
            <label>Password</label>
          </div>
          <div className="form-floating my-3">
            <input
              type="password"
              className="form-control"
              id="cfpassword"
              placeholder="Confirm Password"
              onChange={(e) =>
                SetPassword({ ...password, cfpassword: e.target.value })
              }
            />
            <label>Confirm Password</label>
          </div>
          <button className="btn btn-primary py-2" type="submit">
            Reset Password
          </button>
        </form>
        <Footer />
      </div>
    </>
  );
}
