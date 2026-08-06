import React, { useState, useContext } from "react";
import "./Signup.css";
import MyContext from "../MyContext.jsx";
import Alert from "./Alert.jsx";

export default function SignUp() {
  const { setShowAuth, setAuthPage,setCurrentUser ,alert, showAlert } = useContext(MyContext);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      console.log(data);

      if (data.success) {
        localStorage.setItem("token", data.token);

        localStorage.setItem("user", JSON.stringify(data.user));

        setCurrentUser(data.user);

        showAlert("success", "Account created successfully 🎉");

        setTimeout(() => {
          setShowAuth(false);
        }, 1500);
      } else {
        showAlert("error", data.message || "Signup failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="auth-container">
      {alert.show && <Alert type={alert.type} message={alert.message} />}
      <button className="close-auth" onClick={() => setShowAuth(false)}>
        <i className="fa-solid fa-xmark"></i>
      </button>
      <div className="signup-logo">
        <i className="fa-solid fa-user-plus"></i>
      </div>

      <h2>Create Account</h2>

      <p className="auth-subtitle">
        Join SigmaGPT and unlock smarter conversations.
      </p>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={user.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={user.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Create password"
          value={user.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="auth-btn">
          Create Account
        </button>
      </form>

      <div className="divider">OR</div>

      <div className="auth-footer">
        Already have an account?{" "}
        <span className="auth-link" onClick={() => setAuthPage("login")}>
          Sign In
        </span>
      </div>
    </div>
  );
}
