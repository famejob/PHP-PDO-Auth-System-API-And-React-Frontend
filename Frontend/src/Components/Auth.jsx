// Auth.jsx
import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Auth = ({ component: Component }) => {
  const navigate = useNavigate();
  const { dataLogin } = useContext(AuthContext);

  useEffect(() => {
    if (!dataLogin) {
      navigate("/");
    }
  }, [dataLogin, navigate]);

  if (!dataLogin) {
    return null; // ไม่มีการ render Component ถ้าไม่ได้ล็อกอิน
  }

  return <Component />;
};

export default Auth;
