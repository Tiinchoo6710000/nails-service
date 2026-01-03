import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="byOri">Capricornio byOri</h2>
      </div>
    </nav>
  );
}