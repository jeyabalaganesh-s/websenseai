// pages/Home.js
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center bg-dark text-white">
      <h1 className="display-4 fw-bold">Welcome to Websense AI</h1>
      <p className="fs-5 text-light">AI-driven solutions for a smarter future.</p>
      <Link to="/dashboard" className="btn btn-primary mt-4">Get Started</Link>
    </div>
  );
}
export default Home;
