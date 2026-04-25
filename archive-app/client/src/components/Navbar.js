import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar({ user, searchTerm, setSearchTerm, handleLogout }) {
  const navigate = useNavigate();

  const logout = async () => {
    await handleLogout();
    navigate("/");
  };

  return (
    <nav className="archive-navbar">
      <NavLink to="/" className="archive-logo">
        ARCH<span>-IVE</span>
      </NavLink>

      <input
        className="archive-search"
        type="text"
        placeholder="Search objects, collections, tags"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="archive-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/collection">Collection</NavLink>

        {user && <NavLink to="/add">Add Object</NavLink>}

        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;