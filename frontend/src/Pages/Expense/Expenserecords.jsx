import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenserecordCSS from "./Expenserecords.module.css";
import 'jspdf-autotable'
import jsPDF from 'jspdf';

const apiUrl = "https://omnireports.azurewebsites.net/api/CRUD_irwb";
const session = JSON.parse(sessionStorage.getItem("user"));
const userIdObj = session && session.Name === "_id" ? session : null;
const userId = userIdObj ? userIdObj.Value : null;
const Expenserecords = () => {
  const [accountDetails,setAccountDetails]=useState([])
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
  useEffect(() => {
    console.log("filtered data", filteredRecords);
    setAccountDetails(filteredRecords);
    
  }, [filteredRecords]);
  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['Account ID', 'Description', 'Amount', 'Date'];
    const tableRows = [];
  
    filteredRecords.forEach((item) => {
      item.accountDetails.forEach((detail) => {
        const dotDate = new Date(detail.dot);
        const isWithinDateRange =
          dotDate >= new Date(startDate) && dotDate <= new Date(endDate);
        const hasMatchingTitle = detail.description === expenseTitle;
  
        if (isWithinDateRange && (expenseTitle === '' || hasMatchingTitle)) {
          const { accountId, description, amount, dot } = detail;
          const rowData = [accountId, description, amount, new Date(dot).toLocaleDateString()];
          tableRows.push(rowData);
        }
      });
    });
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });
  
    doc.save('accountDetails.pdf');
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
          <div className={ExpenserecordCSS.filtered_record_heading}>
            <h3>Filtered Expense Records</h3>
            <button onClick={generatePDF}  className={ExpenserecordCSS.pdfbutton}>Export to PDF</button>
    </div>
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
        const dotDate = new Date(detail.dot);
        const isWithinDateRange =
          dotDate >= new Date(startDate) && dotDate <= new Date(endDate);
        const hasMatchingTitle = detail.description === expenseTitle;

        if (isWithinDateRange && (expenseTitle === '' || hasMatchingTitle)) {
          expensesum = expensesum + parseInt(detail.amount);

          return (
            <tr key={idx}>
              <td>{detail.description}</td>
              <td>{detail.accountId}</td>
              <td>{detail.amount}</td>
              <td className={ExpenserecordCSS.td_1}>
              {new Date(detail.dot).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </td>
            </tr>
          );
        } else {
          return null; 
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
