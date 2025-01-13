import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../domain/useCase/useAuth";
import { DistributerPicker } from "./components/DistributerPicker";
import "./style/authintication.css";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [distributerPick, setDistributerPick] = useState<string | null>(null); // Manage state for distributor pick
  const [formError, setFormError] = useState("");

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setFormError("Name is required.");
      return false;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setFormError("Invalid email address.");
      return false;
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return false;
    }
    if (!distributerPick) {
      setFormError("You must select a distributor.");
      return false;
    }
    setFormError(""); // Clear previous errors
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newUser = {
      email,
      password,
      name,
      imageUrl,
      distributerId: distributerPick,
    };

    await register(
      email,
      password,
      name,
      imageUrl,
      distributerPick!!
    ); // Updated to include distributor pick
    if (!error) navigate(-1); // Navigate back or to the homepage
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <DistributerPicker
        distributerPick={distributerPick}
        setDistributerPick={setDistributerPick}
      />
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
        />
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
        <input
          type="text"
          placeholder="Profile Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="form-input"
        />
        {formError && <p className="error-message">{formError}</p>}
        {error && <p className="error-message">Error: {error}</p>}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="navigate-message">
        Already have an account?{" "}
        <Link to="/Login" className="navigate-link">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
