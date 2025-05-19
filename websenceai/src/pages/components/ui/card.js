import React from "react";

const Card = ({ children }) => {
    return <div className="border rounded-lg p-4 shadow-md">{children}</div>;
};

const CardContent = ({ children }) => {
    return <div className="p-4">{children}</div>;
};

export { Card, CardContent };
