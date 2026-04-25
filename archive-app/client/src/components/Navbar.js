import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed");
    }
  };

  return (
    <nav className="archive-navbar">
      <Link className="archive-logo" to="/">
          ARCH<span>-IVE</span>
      </Link>

      <input
        className="archive-search"
        placeholder="Search objects, collections, tags"
      />

      <div className="archive-links">
        <Link to="/">Home</Link>
        <Link to="/">Collection</Link>

        {user && <Link to="/add-object">Add Object</Link>}

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;