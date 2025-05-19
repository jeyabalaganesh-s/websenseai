import React, { useEffect, useState } from "react";
import styled from "styled-components";

const AIReportsContainer = styled.div`
  padding: 20px;
  color: white;
`;

const ScrollableTableContainer = styled.div`
  width: 100%;
  overflow-x: auto; /* Enables horizontal scrolling */
  max-width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  min-width: 600px; /* Prevents too much shrinking */
`;

const Th = styled.th`
  padding: 12px;
  background: #2b2b2b;
  border-bottom: 2px solid #444;
  text-align: left;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #333;
  white-space: nowrap; /* Keeps text in one line */
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px; /* Prevents content overflow */
  color: ${({ sentiment }) =>
    sentiment === "Positive" ? "limegreen" : sentiment === "Negative" ? "red" : "white"};
`;

const truncateURL = (url, length = 30) => {
  return url.length > length ? url.substring(0, length) + "..." : url;
};

const AIReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/ai-reports")
      .then((response) => response.json())
      .then((data) => setReports(data))
      .catch((error) => console.error("Error fetching AI Reports:", error));
  }, []);

  return (
    <AIReportsContainer>
      <h1>AI Reports</h1>
      {reports.length > 0 ? (
        <ScrollableTableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Website</Th>
                <Th>Feedback</Th>
                <Th>Sentiment</Th>
                <Th>Rating</Th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <Td>
                    <a href={report.website} target="_blank" rel="noopener noreferrer" style={{ color: "cyan" }}>
                      {truncateURL(report.website)}
                    </a>
                  </Td>
                  <Td>{report.feedback}</Td>
                  <Td sentiment={report.sentiment}>{report.sentiment}</Td>
                  <Td>{report.rating}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollableTableContainer>
      ) : (
        <p>Loading AI Reports...</p>
      )}
    </AIReportsContainer>
  );
};

export default AIReports;
