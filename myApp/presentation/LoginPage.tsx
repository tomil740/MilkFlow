import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import useAuth from "../domain/useCase/useAuth";
import "./style/authintication.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    if (!error) navigate("/");
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
        />
        {error && <p className="error-message">Error: {error}</p>}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="navigate-message">
        Don’t have an account?{" "}
        <Link to="/Register" className="navigate-link">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
