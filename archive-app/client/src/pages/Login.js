import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Login({ setUser }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

    if (!formData.email || !formData.password) {
      setMessage("Email and password are required.");
      return;
    }

    try {
      const response = await api.post("/auth/login", formData);
      setUser(response.data.user);
      navigate("/add-object");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <section className="auth-card">
      <h2>Sign in to Archive</h2>

      <form onSubmit={handleSubmit}>
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

        <button type="submit">Login</button>
      </form>

      {message && <p className="message">{message}</p>}

      <p>
        Do not have an account? <Link to="/signup">Sign up</Link>
      </p>
    </section>
  );
}

export default Login;