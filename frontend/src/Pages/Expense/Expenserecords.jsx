// src/components/Expenserecords.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Expenserecords.css";

const apiUrl = 'https://omnireports.azurewebsites.net/api/CRUD_irwb';

const Expenserecords = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expenseTitle, setExpenseTitle] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);

  const handleRetrieveDetails = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(apiUrl, {
        crudtype: 2,
        recordid: null,
        collectionname: "expense"
      });
      const expenseData = JSON.parse((String(data.data).replaceAll('ObjectId(', '')).replaceAll(')', ""));

      const filteredData = expenseData.filter((item) => {
        const isMatchingStartDate = !startDate || new Date(item.date) >= new Date(startDate);
        const isMatchingEndDate = !endDate || new Date(item.date) <= new Date(endDate);
        const isMatchingExpenseTitle = !expenseTitle || item.expenseTitle.toLowerCase().includes(expenseTitle.toLowerCase());

        return isMatchingStartDate && isMatchingEndDate && isMatchingExpenseTitle;
      });

      setFilteredRecords(filteredData);
      console.log(filteredData);
    } catch (error) {
      console.error('API Error:', error);
    }
  };


  return (
    <div className="page-container">
      <div className="container">
        <div className="form-container">
          <h2>Expense Records</h2>
          <form>
            <div className="form-group">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="expenseTitle">Expense Title</label>
              <input
                type="text"
                id="expenseTitle"
                placeholder="Enter Expense Title"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <button className="retrieve-button" onClick={handleRetrieveDetails}>
                Retrieve Details
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <div className="filtered-records">
            <h3>Filtered Expense Records</h3>
            <table>
              <thead>
                <tr>
                  <th>Expense Title</th>
                  <th>Bank Account</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords && filteredRecords.map((item, index) => (
                  <tr key={index}>
                    <td>{item.expenseTitle}</td>
                    <td>{item.savingsAccount}</td>
                    <td>{item.amount}</td>
                    <td>{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenserecords;
