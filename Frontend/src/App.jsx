import Main from "./Components/Main";
import Register from "./Components/Register";
import Login from "./Components/Login";
import User from "./Components/User";
import Admin from "./Components/Admin";
import Auth from "./Components/Auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Components/AuthContext";
import Forgotpw from "./Components/Forgotpw";
import Resetpw from "./Components/Resetpw";
function App() {
  return (
    <>
      <div>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Main />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/forgotpassword" element={<Forgotpw />} />
              <Route path="/resetpassword" element={<Resetpw />} />
              <Route path="/admin" element={<Auth component={Admin} />} />
              <Route path="/user" element={<Auth component={User} />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </div>
    </>
  );
}

export default App;
