// src/components/Expenserecords.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenserecordCSS from "./Expenserecords.module.css";

const apiUrl = "https://omnireports.azurewebsites.net/api/CRUD_irwb";
const session = JSON.parse(sessionStorage.getItem("user"));
const userIdObj = session && session.Name === "_id" ? session : null;
const userId = userIdObj ? userIdObj.Value : null;
const Expenserecords = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expenseTitle, setExpenseTitle] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [rowPage, setRowPage] = useState(5);
  let expensesum = 0;

  const parseData = (data) => {
    const modifiedData = data
      .replaceAll("ISODate(", "")
      .replaceAll("ObjectId(", "")
      .replaceAll(")", "");

    try {
      return JSON.parse(modifiedData);
    } catch (error) {
      console.error("Error parsing data:", error);
      return [];
    }
  };

  const handleRetrieveDetails = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        apiUrl,
        {
          crudtype: 2,
          recordid: null,
          collectionname: "expense",
          userId: session[0].Value,
        },
        {
          Authorization: session.token,
        }
      );
      console.log(userId);
      console.log(data);
      const expenseData = parseData(data.data);
      const filteredData = expenseData;
      setFilteredRecords(filteredData);
    } catch (error) {
      console.log("API Error:", error);
    }
  };
  const sdate = parseInt(startDate.slice(8, 10), 10);
  const smonth = parseInt(startDate.slice(5, 7), 10);
  const syear = parseInt(startDate.slice(0, 4), 10);
  const edate = parseInt(endDate.slice(8, 10), 10);
  const emonth = parseInt(endDate.slice(5, 7), 10);
  const eyear = parseInt(endDate.slice(0, 4), 10);

  const moreinfo = () => {
    setRowPage(rowPage + 2);
  };

  return (
    <div className={ExpenserecordCSS.page_container}>
      <div className={ExpenserecordCSS.container}>
        <div className={ExpenserecordCSS.form_container}>
          <h2>Expense Records</h2>
          <form>
            <div className={ExpenserecordCSS.form_group}>
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className={ExpenserecordCSS.form_group}>
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className={ExpenserecordCSS.form_group}>
              <label htmlFor="expenseTitle">Expense Title</label>
              <input
                type="text"
                id="expenseTitle"
                placeholder="Enter Expense Title"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
              />
            </div>
            <div className={ExpenserecordCSS.form_group}>
              <button
                className={ExpenserecordCSS.btn_retrieve}
                onClick={handleRetrieveDetails}
              >
                Retrieve Details
              </button>
            </div>
            <h3 className={ExpenserecordCSS.footer}>
              Click above to know how much you have spent in the given time
              period
            </h3>
          </form>
        </div>
        <div className={ExpenserecordCSS.table_container}>
          <div className={ExpenserecordCSS.filtered_records}>
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
                {filteredRecords &&
                  filteredRecords.map((item, index) =>
                    item.accountDetails.map((detail, idx) => {
                      const dfirst =
                        parseInt(detail.dot.slice(5, 7), 10) > smonth;
                      const dend =
                        parseInt(detail.dot.slice(5, 7), 10) < emonth;
                      const isAfterStartDate =
                        (parseInt(detail.dot.slice(8, 10), 10) >= sdate ||
                          dfirst) &&
                        parseInt(detail.dot.slice(5, 7), 10) >= smonth &&
                        parseInt(detail.dot.slice(0, 4), 10) >= syear;

                      const isBeforeEndDate =
                        (parseInt(detail.dot.slice(8, 10), 10) <= edate ||
                          dend) &&
                        parseInt(detail.dot.slice(5, 7), 10) <= emonth &&
                        parseInt(detail.dot.slice(0, 4), 10) <= eyear;
                      const desTitle = detail.description === expenseTitle;
                      const all =
                        isBeforeEndDate && isAfterStartDate && desTitle;
                      if (all) {
                        expensesum = expensesum + parseInt(detail.amount);
                      }
                      if (all) {
                        return (
                          <>
                            <tr key={idx}>
                              <td>{detail.description}</td>
                              <td>{detail.accountId}</td>
                              <td>{detail.amount}</td>
                              <td>{detail.dot}</td>
                            </tr>
                          </>
                        );
                      }
                    })
                  )}
                <tr>
                  <td colSpan="2">Total:</td>
                  <td>{expensesum}</td>
                </tr>
              </tbody>
            </table>
            <button className={ExpenserecordCSS.btn_info} onClick={moreinfo}>
              More info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenserecords;
