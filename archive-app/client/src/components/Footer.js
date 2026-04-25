import React, { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed: ${email}`);
    setEmail("");
  };

  return (
    <footer className="archive-footer">
      <div>
        <h4>About ARCH-IVE</h4>
        <p>
          A curated design archive for materials, fixtures, furniture, articles,
          and spatial references. Explore, collect, and contribute new design objects.
        </p>
      </div>

      <div>
        <h4>Quick Links</h4>
        <Link to="/">Home</Link>
        <Link to="/collection">Collection</Link>
        <Link to="/add">Add Object</Link>
        <Link to="/login">Login</Link>
      </div>

      <div>
        <h4>Subscribe</h4>
        <form onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Email for newsletter"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </footer>
  );
}

export default Footer;