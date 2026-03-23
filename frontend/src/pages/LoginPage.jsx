import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const data = await login({ email, password });
      localStorage.setItem("token", data.token);
      navigate("/booking");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="page">
      <h1>Login</h1>
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
        <button type="submit">Login</button>
      </form>
      {message ? <p className="message error">{message}</p> : null}
      <p>
        Chưa có tài khoản? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default LoginPage;
