import React, { useState, useEffect } from "react";
import axios from "axios";
import cardsCSS from "./Cards.module.css";

const apiUrl = "https://omnireports.azurewebsites.net/api/CRUD_irwb?";

const StyledBox = ({ visible }) => {
  return (
    <div className={cardsCSS.styled_box_container}>
      {visible && (
        <div className={cardsCSS.styled_box}>
          {/* Add your advanced styling here */}
        </div>
      )}
    </div>
  );
};

function Cards({ addTransaction }) {
  const session = JSON.parse(sessionStorage.getItem("user"));
  const userIdObj = session && session.Name === "_id" ? session : null;
  const userId = session && session[0] ? session[0].Value : null;

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const [selectedMonth, setSelectedMonth] = useState(null);

  const [activeCard, setActiveCard] = useState(null);

  const MonthDropdown = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const handleMonthChange = (selectedMonth) => {
      // Call fetchIncomeData with the selected month
      fetchIncomeData(selectedMonth);
      fetchExpenseData(selectedMonth);
    };

    return (
      <div className={cardsCSS.dropdownContainer}>
        <select
          value={selectedMonth}
          onChange={(e) => {
            const selectedMonth = parseInt(e.target.value, 10);
            setSelectedMonth(selectedMonth);
            handleMonthChange(selectedMonth);
          }}
          className={cardsCSS.dropdown}
        >
          <option value="" disabled hidden>
            Select Month
          </option>
          {months.map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
        <div className={cardsCSS.arrowIcon}></div>
      </div>
    );
  };

  const handleClick = (index) => {
    setActiveCard((prevActiveCard) =>
      prevActiveCard === index ? null : index
    );
  };

  const parseData = (data) => {
    if (data === null || data === undefined) {
      console.error("Data is null or undefined");
      return [];
    }
    console.log(parseData);
    const modifiedData = data
      .replaceAll("ISODate(", "")
      .replaceAll("ObjectId(", "")
      .replaceAll(")", "");

    console.log("modifiedData", modifiedData);
    try {
      return JSON.parse(modifiedData);
    } catch (error) {
      console.error("Error parsing data:", error);
      return [];
    }
  };
  const fetchIncomeData = async (selectedMonth) => {
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
      console.log("details", temp);

      if (temp && temp[0].accountDetails && temp[0].accountDetails.length > 0) {
        temp[0].accountDetails.forEach((item) => {
          const transactionDate = new Date(item.dot);
          const transactionMonth = transactionDate.getMonth() + 1;
          console.log("trasactionmoth:", transactionMonth);
          console.log("Transaction Date:", transactionDate);

          // Compare transactionMonth with the selectedMonth parameter
          if (transactionMonth === selectedMonth) {
            totalAmount += parseFloat(item.amount);
          }
        });
      }
      console.log(totalAmount);

      return totalAmount;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

  const fetchExpenseData = async (selectedMonth) => {
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

      let totalAmounts = 0;
      console.log("details", temp);

      if (temp && temp[0].accountDetails && temp[0].accountDetails.length > 0) {
        temp[0].accountDetails.forEach((item) => {
          const transactionDate = new Date(item.dot);
          const transactionMonth = transactionDate.getMonth() + 1;
          console.log("trasactionmoth:", transactionMonth);
          console.log("Transaction Date:", transactionDate);

          // Compare transactionMonth with the selectedMonth parameter
          if (transactionMonth === selectedMonth) {
            totalAmounts += parseFloat(item.amount);
          }
        });
      }
      console.log(totalAmounts);

      return totalAmounts;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

  // const fetchExpenseData = async () => {
  //   try {
  //     const { data } = await axios.post(
  //       apiUrl,
  //       {
  //         crudtype: 2,
  //         recordid: null,
  //         collectionname: "expense",
  //         userId: session[0].Value,
  //       },
  //       {
  //         Authorization: session.token,
  //       }
  //     );
  //     console.log("fetched expense data:", data);
  //     const temp = parseData(data.data);

  //     let totalAmount = 0;
  //     let transactionMonth;

  //     if (temp && temp[0].accountDetails && temp[0].accountDetails.length > 0) {
  //       temp[0].accountDetails.forEach((item) => {
  //         if (transactionMonth === selectedMonth) {
  //           totalAmount += parseFloat(item.amount);
  //         }
  //       });
  //     }
  //     console.log("total:", totalAmount);

  //     setTotalExpense(totalAmount);
  //   } catch (error) {
  //     console.error("API Error:", error);
  //   }
  // };

  useEffect(() => {
    console.log("userId:", userId);
    console.log("selectedMonth:", selectedMonth);

    const fetchData = async () => {
      if (userId && selectedMonth !== null) {
        try {
          const [incomeData, expenseData] = await Promise.all([
            fetchIncomeData(selectedMonth),
            fetchExpenseData(selectedMonth),
          ]);
          setTotalIncome(incomeData);
        setTotalExpense(expenseData);

          // Do something with incomeData and expenseData if needed
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [userId, selectedMonth]);

  return (
    <div>
      <StyledBox visible={activeCard !== null} />

      <div className={cardsCSS.card_container}>
        <MonthDropdown />
        <div
          className={cardsCSS.cardss}
          onClick={() => handleClick(0)}
          style={{ cursor: "pointer" }}
        >
          <h2 className={cardsCSS.h2}>Monthly Income</h2>
          <p className={cardsCSS.p}>
            <b>₹{totalIncome}</b>
          </p>
        </div>
        <div
          className={cardsCSS.cardss}
          onClick={() => handleClick(1)}
          style={{ cursor: "pointer" }}
        >
          <h2 className={cardsCSS.h2}>Monthly Expense</h2>
          <p className={cardsCSS.p}>
            <b>₹{totalExpense}</b>
          </p>
        </div>
        <div
          className={cardsCSS.cardss}
          onClick={() => handleClick(2)}
          style={{ cursor: "pointer" }}
        >
          <h2 className={cardsCSS.h2}>Monthly Savings</h2>
          <p className={cardsCSS.p}>
            <b>₹{totalIncome - totalExpense}</b>
          </p>
        </div>
        <div
          className={cardsCSS.cardss}
          onClick={() => handleClick(3)}
          style={{ cursor: "pointer" }}
        >
          <h2 className={cardsCSS.h2}>Net Worth</h2>
          <p className={cardsCSS.p}>
            <b>₹{totalIncome - totalExpense}</b>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cards;