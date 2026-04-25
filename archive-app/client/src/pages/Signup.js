import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Signup({ setUser }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setMessage("All fields are required.");
      return;
    }

    if (formData.password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    try {
      const response = await api.post("/auth/signup", formData);
      setUser(response.data.user);
      navigate("/add-object");
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <section className="auth-card">
      <h2>Create Archive Account</h2>

      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">Sign Up</button>
      </form>

      {message && <p className="message">{message}</p>}

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}

export default Signup;