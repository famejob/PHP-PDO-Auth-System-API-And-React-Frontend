import axios from "axios";
import { useState, useContext } from "react";
import "./Register.css";
import Nav from "./Nav";
import Footer from "./Footer";
import { AuthContext } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
export default function Login() {
  const { login } = useContext(AuthContext);
  const [users, SetUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [error, setError] = useState("");

  const signin = async (e) => {
    e.preventDefault();
    // Check empty
    if (!users.email || !users.password) {
      setError("Username and Password is required");
      return;
    }
    // Check email uniqueness
    try {
      const data = {
        email: users.email,
        password: users.password,
      };
      const response = await axios.post(
        `http://localhost/php_auth+react/Backend/api/login_api.php`,
        data
      );
      if (response.data.status == "success") {
        login(response.data);
        if (response.data.user_data.role == 0) {
          navigate("/user");
        } else {
          navigate("/admin");
        }
      } else {
        setError("Email or password not correct");
      }
      //   const data_login = response.data;
    } catch (error) {
      // console.log(error);
      setError("Error registering user"); // Generic error message
    }
  };
  return (
    <>
      <div className="container">
        <Nav />
        <form method="post" onSubmit={signin}>
          <h1 className="h3 mb-3 fw-normal text-center">Sign Up</h1>
          {error && <div className="alert alert-danger">{error}</div>}
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
          <button className="btn btn-primary py-2" type="submit">
            Sign in
          </button>
          <p className="mt-2 mb-3 text-body-secondary">
            Forgotpassword? <Link to="/forgotpassword">Click here</Link>
          </p>
          <p className="mt-2 mb-3 text-body-secondary">
            Don't have an account? <Link to="/register">Signup</Link>
          </p>
        </form>
        <Footer />
      </div>
    </>
  );
}
