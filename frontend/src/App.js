
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CalendarBooking from "./components/CalendarBooking";
import WorksSection from "./components/WorksSection";
import Admin from "./pages/Admin";
import Footer from "./components/Footer";

function Home() {
  return (
    <div className="container">
      <CalendarBooking />
      <WorksSection />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

export default App;
