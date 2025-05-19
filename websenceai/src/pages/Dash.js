import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const HomeContainer = styled.div`
  padding: 20px;
  color: white;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const StatCard = styled.div`
  background: #1f1f1f;
  padding: 20px;
  border-radius: 10px;
  width: 200px;
  text-align: center;
`;

const StatNumber = styled.h2`
  color: cyan;
  margin: 10px 0;
`;

const Dash = () => {
  const [stats, setStats] = useState({
    users: 0,
    reports: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard-stats")
      .then((response) => setStats(response.data))
      .catch((error) => console.error("Error fetching dashboard stats:", error));
  }, []);

  return (
    <HomeContainer>
      <h1>Dashboard Overview</h1>
      <StatsContainer>
        <StatCard>
          <h3>Total Users</h3>
          <StatNumber>{stats.users}</StatNumber>
        </StatCard>
        <StatCard>
          <h3>AI Reports</h3>
          <StatNumber>{stats.reports}</StatNumber>
        </StatCard>
      </StatsContainer>
    </HomeContainer>
  );
};

export default Dash;
