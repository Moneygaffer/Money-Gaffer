import React from "react";
import { Link } from "react-router-dom";
import "./Records.css";

const Records = () => {
  return (
    <div className="records-page">
      <div className="header">
        <h1>Welcome to Your Financial Records</h1>
        <p>Explore and manage your expense and income records here.</p>
      </div>
      <div className="records-section">
        <h2>Expense Records</h2>
        <p>
          View and manage your expense records to keep track of your spending.
          You can categorize expenses, add descriptions, and set dates for
          better financial planning.
        </p>
      </div>
      <div className="records-section">
        <h2>Income Records</h2>
        <p>
          Access your income records to monitor your earnings and sources of
          income. You can record your salary, bonuses, and other sources of
          income for a complete financial overview.
        </p>
      </div>
    </div>
  );
};

export default Records;
