import React, { useState, useEffect } from "react";
import axios from "axios";
import detailsCSS from "./Details.module.css";

const apiUrl = "https://pfmservices.azurewebsites.net/api/CRUD_irwb?";

function Details({ addTransaction }) {
  const session = JSON.parse(sessionStorage.getItem("user"));
  const userIdObj = session && session.Name === "_id" ? session : null;
  const userId = session && session[0] ? session[0].Value : null;

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const parseData = (data) => {
    if (data === null || data === undefined) {
      console.error("Data is null or undefined");
      return [];
    }

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

  const fetchIncomeData = async () => {
    try {
      const { data } = await axios.post(
        apiUrl,
        {
          crudtype: 2,
          recordid: null,
          collectionname: "income",
          userId: session[0].Value,
        },
        {
          Authorization: session.token,
        }
      );

      const temp = parseData(data.data);

      let totalAmount = 0;

      if (temp && temp[0].accountDetails && temp[0].accountDetails.length > 0) {
        temp[0].accountDetails.forEach((item) => {
          totalAmount += parseFloat(item.amount);
        });
      }

      setTotalIncome(totalAmount);
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

  const fetchExpenseData = async () => {
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

      const temp = parseData(data.data);

      let totalAmount = 0;

      if (temp && temp[0].accountDetails && temp[0].accountDetails.length > 0) {
        temp[0].accountDetails.forEach((item) => {
          totalAmount += parseFloat(item.amount);
        });
      }

      setTotalExpense(totalAmount);
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchIncomeData();
    fetchExpenseData();
  }, []);

  return (
    <div className={detailsCSS.detailsContainer}>
  <div className={detailsCSS.incomeContainer}>
    <h2 className={detailsCSS.income}>Total Income: ₹{totalIncome}</h2>
  </div>
  <div className={detailsCSS.expenseContainer}>
    <h2 className={detailsCSS.expense}>Total Expense: ₹{totalExpense}</h2>
  </div>
  <div className={detailsCSS.savingsContainer}>
    <h2 className={detailsCSS.savings}>Total Savings: ₹ </h2>
  </div>
  <div className={detailsCSS.loanContainer}>
    <h2 className={detailsCSS.loan}>Total Loan: ₹ </h2>
  </div>
</div>

  );
}

export default Details;