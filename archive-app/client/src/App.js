import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import api from "./api";
import "./styles/main.scss";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AddObject from "./pages/AddObject";
import EditObject from "./pages/EditObject";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [objects, setObjects] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    const loadObjects = async () => {
      try {
        const res = await api.get("/objects");
        setObjects(res.data);
      } catch (err) {
        console.error("Could not load objects:", err);
      }
    };

    const checkUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch {
        setUser(null);
      }
    };

    loadObjects();
    checkUser();
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Router>
      <div className={darkMode ? "app-shell grey-mode" : "app-shell"}>
        <Navbar
          user={user}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleLogout={handleLogout}
        />

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
          <Route
            path="/"
            element={
              <Home
                objects={objects}
                setObjects={setObjects}
                searchTerm={searchTerm}
                user={user}
              />
            }
          />

          <Route
            path="/collection"
            element={
              <Home
                objects={objects}
                setObjects={setObjects}
                searchTerm={searchTerm}
                user={user}
              />
            }
          />

          <Route
            path="/add"
            element={
              user ? (
                <AddObject objects={objects} setObjects={setObjects} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/edit/:id"
            element={
              user ? (
                <EditObject objects={objects} setObjects={setObjects} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;