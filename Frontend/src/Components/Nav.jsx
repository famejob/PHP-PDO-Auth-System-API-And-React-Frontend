// OtherComponent.js
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Link } from "react-router-dom";
export default function Nav() {
  const { dataLogin, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // เรียกใช้งานฟังก์ชัน logout เมื่อต้องการออกจากระบบ
  };
  return (
    <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div className="col-md-3 mb-2 mb-md-0">
        <a
          href="/"
          className="d-inline-flex link-body-emphasis text-decoration-none"
        >
          <svg
            className="bi"
            width="40"
            height="32"
            role="img"
            aria-label="Bootstrap"
          >
            <use xlink:href="#bootstrap"></use>
          </svg>
        </a>
      </div>

      <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li>
          <Link to="/" className="nav-link px-2 link-secondary">
            Home
          </Link>
        </li>
        <li>
          <a href="#" className="nav-link px-2">
            Features
          </a>
        </li>
        <li>
          <a href="#" className="nav-link px-2">
            Pricing
          </a>
        </li>
        <li>
          <a href="#" className="nav-link px-2">
            FAQs
          </a>
        </li>
        <li>
          <a href="#" className="nav-link px-2">
            About
          </a>
        </li>
      </ul>

      {dataLogin ? (
        <div className="col-md-3 text-end">
          <p>
            Welcome {dataLogin.user_data.role != 0 ? "Admin" : ""}{" "}
            {dataLogin.user_data.username}
          </p>
          <button
            onClick={handleLogout}
            className="btn btn-outline-primary me-2"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="col-md-3 text-end">
          <Link to="/login" className="btn btn-outline-primary me-2">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary">
            Sign-up
          </Link>
        </div>
      )}
    </header>
  );
}
