import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../domain/useCase/useAuth";
import "./style/authintication.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const validatePhone = (phone: string): boolean => {
    return (
      phone.length === 10 &&
      phone.startsWith("05") &&
      /^\d+$/.test(phone)
    );
  };

  useEffect(() => {
    const valid = validatePhone(phone);
    setIsFormValid(valid);
    setPhoneError(valid || phone === "" ? "" : "יש להזין מספר טלפון תקני בפורמט 05XXXXXXXX");
  }, [phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhone(phone)) {
      setPhoneError("יש להזין מספר טלפון תקני בפורמט 05XXXXXXXX");
      return;
    }

    const email = `${phone}@mail.com`;
    const password = phone;

    const success = await login(email, password);
    if (success) {
      navigate("/");
    } else {
      setPhoneError("שגיאה בהתחברות. ודא שהמספר נכון.");
    }
  };

  return (
    <div className="login-container">
      <h1>התחברות</h1>
      <form onSubmit={handleSubmit} className="login-form">

        <input
          type="tel"
          placeholder="מספר טלפון (05XXXXXXXX)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={`form-input ${phoneError ? "input-error" : ""}`}
          inputMode="numeric"
        />
        {phoneError && <p className="error-message">{phoneError}</p>}
        {error && <p className="error-message">שגיאה: {error}</p>}

        <button
          type="submit"
          className="submit-button"
          disabled={!isFormValid || loading}
        >
          {loading ? "מתחבר..." : "התחבר"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

