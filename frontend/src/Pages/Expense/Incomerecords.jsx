import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Incomerecords.css";

const apiUrl = 'https://omnireports.azurewebsites.net/api/CRUD_irwb';

const Incomerecords = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [incomeTitle, setIncomeTitle] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);

  const handleRetrieveDetails = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(apiUrl, {
        crudtype: 2,
        recordid: null,
        collectionname: "income"
      });
      const incomeData = JSON.parse((String(data.data).replaceAll('ObjectId(', '')).replaceAll(')', ""));

      const filteredData = incomeData.filter((item) => {
        const isMatchingStartDate = !startDate || new Date(item.date) >= new Date(startDate);
        const isMatchingEndDate = !endDate || new Date(item.date) <= new Date(endDate);
        const isMatchingIncomeTitle = !incomeTitle || item.incomeTitle.toLowerCase().includes(incomeTitle.toLowerCase());

        return isMatchingStartDate && isMatchingEndDate && isMatchingIncomeTitle;
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
          <h2>Income Records</h2>
          <form>
            <div className="form-group5">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group5">
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="form-group5">
              <label htmlFor="incomeTitle">Income Title</label>
              <input
                type="text"
                id="incomeTitle"
                placeholder="Enter Income Title"
                value={incomeTitle}
                onChange={(e) => setIncomeTitle(e.target.value)}
              />
            </div>
            <div className="form-group5">
              <button className="retrieve-button" onClick={handleRetrieveDetails}>
                Retrieve Details
              </button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <div className="filtered-records">
            <h3>Filtered Income Records</h3>
            <table>
              <thead>
                <tr>
                  <th>Income Title</th>
                  <th>Bank Account</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords && filteredRecords.map((item, index) => (
                  <tr key={index}>
                    <td>{item.incomeTitle}</td>
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

export default Incomerecords;
