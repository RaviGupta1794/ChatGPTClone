import React, { useState, useContext } from "react";
import "./login.css";
import MyContext from "../MyContext.jsx";

export default function Login() {
 const { setShowAuth, setAuthPage } = useContext(MyContext);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      console.log(data);

      if (data.token) {
        localStorage.setItem("token", data.token);

        // close popup
        setShowAuth(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">
        <i className="fa-solid fa-robot"></i>
      </div>

      <h2>Welcome Back</h2>

      <p className="auth-subtitle">Sign in to continue using SigmaGPT</p>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={user.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
        />

        <button type="submit" className="auth-btn">
          <span>Login</span>
        </button>
      </form>

      <div className="divider">OR</div>

      <div className="auth-footer">
        Don't have an account?{" "}
        <span className="auth-link" onClick={() => setAuthPage("signup")}>
          Create one
        </span>
      </div>
    </div>
  );
}
