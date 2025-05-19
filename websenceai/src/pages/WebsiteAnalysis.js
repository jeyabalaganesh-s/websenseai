import React, { useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell } from "recharts";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const WebsiteAnalysis = () => {
    const [url, setUrl] = useState("");
    const [sentimentData, setSentimentData] = useState([]);
    const [trendData, setTrendData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        if (!url.trim()) {
            setError("Please enter a valid website URL.");
            return;
        }

        setError("");  
        setSentimentData([]);  
        setTrendData([]);
        setLoading(true); // Show loading state

        try {
            const response = await axios.post("http://localhost:5000/analyze", { url }, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.data.sentiment_counts && response.data.sentiment_trend) {
                const counts = response.data.sentiment_counts;
                const trend = response.data.sentiment_trend;

                // Pie Chart Data
                const chartData = [
                    { name: "Positive", value: counts.Positive },
                    { name: "Negative", value: counts.Negative },
                    { name: "Neutral", value: counts.Neutral },
                ];
                setSentimentData(chartData);

                // Line Chart Data with proper formatting
                const formattedTrendData = trend.map((entry, index) => ({
                    timestamp: entry.timestamp || `Feedback ${index + 1}`,
                    score: entry.score || 0 
                }));
                setTrendData(formattedTrendData);

            } else {
                setError("No feedback data available for this website.");
            }
        } catch (err) {
            setError("Error fetching data. Please try again.");
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    const COLORS = ["#00C49F", "#FF4444", "#FFBB28"]; 

    return (
        <div className="p-6">
            <Card>
                <CardContent>
                    <h2 className="text-xl font-bold mb-4">Website Sentiment Analysis</h2>
                    <Input 
                        type="text" 
                        placeholder="Enter website URL" 
                        value={url} 
                        onChange={(e) => setUrl(e.target.value)} 
                    />
                    <Button onClick={fetchData} className="mt-4" disabled={loading}>
                        {loading ? "Analyzing..." : "Analyze"}
                    </Button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </CardContent>
            </Card>

            {/* Sentiment Pie Chart */}
            {sentimentData.length > 0 && (
                <Card className="mt-6">
                    <CardContent>
                        <h3 className="text-lg font-semibold mb-4">Sentiment Breakdown</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie 
                                    data={sentimentData} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    outerRadius={100} 
                                    fill="#8884d8"
                                    label
                                >
                                    {sentimentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {/* Sentiment Score Trend Line Chart */}
            {trendData.length > 0 && (
                <Card className="mt-6">
                    <CardContent>
                        <h3 className="text-lg font-semibold mb-4">User Sentiment Score Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={[-1, 1]} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="score" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
export default WebsiteAnalysis;
