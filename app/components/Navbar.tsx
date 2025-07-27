import React from "react";
import { Link } from "react-router";
import { ThemeToggleCompact } from "./ThemeToggle";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">CV Engine</p>
      </Link>
      
      <div className="flex items-center gap-4">
        <ThemeToggleCompact />
        <Link to="/upload" className="primary-button w-fit">
          Upload CV
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;