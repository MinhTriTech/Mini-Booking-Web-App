import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await register({ email, password });
      setMessage("Đăng ký thành công, vui lòng login.");
      setTimeout(() => navigate("/login"), 600);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="page">
      <h1>Register</h1>
      <form onSubmit={onSubmit} className="form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {message ? <p className="message">{message}</p> : null}
      <p>
        Đã có tài khoản? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
