// AuthContext.js
import { createContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [dataLogin, setDataLogin] = useState(null);

  const login = (userData) => {
    // Perform login logic here, such as calling API to authenticate user
    setDataLogin(userData);
  };

  const logout = () => {
    // Perform logout logic here, such as clearing data and session
    setDataLogin(null);
  };

  return (
    <AuthContext.Provider value={{ dataLogin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
