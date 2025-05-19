import styled from "styled-components";

/* Main Container */
export const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #1a1a1a;
  color: white;
`;

/* Sidebar */
export const Sidebar = styled.aside`
  width: 250px;
  background: linear-gradient(to bottom, #1a1a1a, #333);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
`;

export const SidebarNav = styled.nav`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 10px;
  text-decoration: none;
  color: white;
  font-size: 16px;
  font-weight: 500;
  border-radius: 5px;
  transition: background 0.3s;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

/* Main Content */
export const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

/* Analytics Card */
export const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

export const AnalyticsCard = styled.div`
  background: #2d2d2d;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const CardTitle = styled.h3`
  font-size: 1.2rem;
  color: #bbb;
`;

export const CardValue = styled.p`
  font-size: 2rem;
  font-weight: bold;
`;

/* Recent Activity */
export const RecentActivity = styled.section`
  margin-top: 30px;
`;

export const ActivityBox = styled.div`
  background: #222;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #444;
`;

export const ActivityText = styled.p`
  color: #ccc;
  margin: 5px 0;
`;
