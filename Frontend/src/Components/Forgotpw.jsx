import Nav from "./Nav";
import Footer from "./Footer";
import axios from "axios";
import { useState } from "react";
import qs from "querystring";
export default function Forgotpw() {
  const [email, SetEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const send = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append("email", email);

      const response = await axios.post(
        "http://localhost/php_auth+react/Backend/api/forgotpassword_api.php",
        formData.toString(),
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
        <form method="post" onSubmit={send}>
          <h1 className="h3 mb-3 fw-normal text-center">Forgot password</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          <div className="form-floating my-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="name@example.com"
              onChange={(e) => SetEmail(e.target.value)}
            />
            <label>Email address</label>
          </div>
          <button className="btn btn-primary py-2" type="submit">
            Send
          </button>
        </form>
        <Footer />
      </div>
    </>
  );
}
