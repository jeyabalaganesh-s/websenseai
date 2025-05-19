import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Feedback from "./pages/Feedback"; 
import Login from "./pages/Login";
import AIReports from "./pages/AIReports";
import Dashboard from "./pages/dashboard"; // Ensure correct case for imports

function App() {
  return (
    <Router>
      <nav className="bg-dark p-4 text-white d-flex justify-content-between shadow-sm">
        <h1 className="fs-3 fw-bold">Websense AI</h1>
        <div>
          <Link to="/" className="text-white mx-3">Home</Link>
          <Link to="/feedback" className="text-white mx-3">Feedback</Link>
          <Link to="/dashboard" className="text-white mx-3">Dashboard</Link>
          <Link to="/login" className="text-white mx-3">Login</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/login" element={<Login />} />
        
        {/* Dashboard as a parent route for protected pages */}
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
