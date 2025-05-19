import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import AIReports from "./AIReports";
import Home from "./Dash";
import WebsiteAnalysis from "./WebsiteAnalysis";
import styled from "styled-components";
import axios from "axios";

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #121212;
  color: white;
`;

const Sidebar = styled.aside`
  width: 280px;
  background: #1f1f1f;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledNavItem = styled(Link)`
  text-decoration: none;
  color: white;
  padding: 10px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const LogoutButton = styled.button`
  margin-top: auto;
  padding: 10px;
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
  &:hover {
    background-color: darkred;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout");
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <DashboardContainer>
      <Sidebar>
        <StyledNavItem to="/dashboard">Dashboard</StyledNavItem>
        <StyledNavItem to="/dashboard/ai-reports">AI Reports</StyledNavItem>
        <StyledNavItem to="/dashboard/website-analysis">Website Analysis</StyledNavItem>

        {/* Logout Button */}
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Sidebar>

      <MainContent>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="ai-reports" element={<AIReports />} />
          <Route path="website-analysis" element={<WebsiteAnalysis />} />
        </Routes>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
