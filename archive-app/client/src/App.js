import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import "./styles/main.scss";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddObject from "./pages/AddObject";
import EditObject from "./pages/EditObject";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [materials, setMaterials] = useState(() => {
    const savedMaterials = localStorage.getItem("materials");
    return savedMaterials ? JSON.parse(savedMaterials) : [];
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("materials", JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className={darkMode ? "app-shell grey-mode" : "app-shell"}>
        <Navbar user={user} setUser={setUser} handleLogout={handleLogout} />

        <div className="theme-toggle">
          <label className="mode-switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />

            <span className="mode-slider">
              <span className="mode-icon">{darkMode ? "☾" : "☼"}</span>
            </span>
          </label>

          <span className="mode-label">
            {darkMode ? "Dark Mode" : "Light Mode"}
          </span>
        </div>

        <Routes>
          <Route path="/" element={<Home materials={materials} />} />

          <Route path="/collection" element={<Home materials={materials} />} />

          <Route
            path="/add"
            element={
              <AddObject materials={materials} setMaterials={setMaterials} />
            }
          />

          <Route
            path="/edit/:id"
            element={
              <EditObject materials={materials} setMaterials={setMaterials} />
            }
          />

          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;