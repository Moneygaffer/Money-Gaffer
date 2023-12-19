import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import graphCSS from "./Graph.module.css";

const apiUrl = "https://pfmservices.azurewebsites.net/api/CRUD_irwb?";

const Graph = () => {
  const [incomeTypeData, setIncomeTypeData] = useState([]);
  const [data, setData] = useState([]);

  const [categoryData, setCategoryData] = useState({
    Income: [],
    Expense: [],
  });

  const [incomeChartOptions, setIncomeChartOptions] = useState({
    chart: {
      type: "donut",
      height: 380,
      title: {
        text: "Income Status",
      },
    },
    // Other income chart options...
    labels: [],
  });

  const [expenseChartOptions, setExpenseChartOptions] = useState({
    chart: {
      type: "donut",
      height: 380,
      title: {
        text: "Income Status",
      },
    },
    // Other expense chart options...
    labels: [],
  });

  const session = JSON.parse(sessionStorage.getItem("user"));
  const userIdObj = session && session.Name === "_id" ? session : null;
  const userId = userIdObj ? userIdObj.Value : null;

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

      if (temp && temp[0].accountDetails && temp[0].accountDetails.length > 0) {
        const incomeDetails = temp[0].accountDetails.map((detail) => ({
          transactType: detail.transactionType,
          amount: parseInt(detail.amount, 10),
        }));

        setIncomeTypeData(incomeDetails);

        // Grouping data by transactType and summing up amounts
        const groupedIncomeDetails = incomeDetails.reduce((result, detail) => {
          const { transactType, amount } = detail;
          if (result[transactType]) {
            result[transactType] += amount;
          } else {
            result[transactType] = amount;
          }
          return result;
        }, {});

        // Update categoryData state
        setCategoryData({
          ...categoryData,
          Income: Object.keys(groupedIncomeDetails).map((transactType) => ({
            name: transactType,
            data: [groupedIncomeDetails[transactType]],
          })),
        });
      }

      setData(temp);
      console.log("Fetch completed successfully!");
    } catch (error) {
      console.error("API Error:", error);
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
      console.log("hi...:", temp);

      if (temp && temp[0].accountDetails && temp[0].accountDetails.length > 0) {
        const expenseDetails = temp[0].accountDetails.map((detail) => ({
          transactType: detail.transactionType,
          amount: parseInt(detail.amount, 10),
        }));

        // Grouping data by transactType and summing up amounts
        const groupedExpenseDetails = expenseDetails.reduce(
          (result, detail) => {
            const { transactType, amount } = detail;
            if (result[transactType]) {
              result[transactType] += amount;
            } else {
              result[transactType] = amount;
            }
            return result;
          },
          {}
        );

        // Update the correct state
        setCategoryData({
          ...categoryData,
          Expense: Object.keys(groupedExpenseDetails).map((transactType) => ({
            name: transactType,
            data: [groupedExpenseDetails[transactType]],
          })),
        });

        setData(temp);
        console.log("Fetch completed successfully for Expense!");
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchIncomeData();
      await fetchExpenseData();
    };

    fetchData();
  }, [userId, categoryData]);

  useEffect(() => {
    // Update labels based on the selected category for Income
    setIncomeChartOptions((prevOptions) => ({
      ...prevOptions,
      labels: categoryData.Income.map((item) => item.name),
    }));
  }, [categoryData.Income]);

  useEffect(() => {
    // Update labels based on the selected category for Expense
    setExpenseChartOptions((prevOptions) => ({
      ...prevOptions,
      labels: categoryData.Expense.map((item) => item.name),
    }));
  }, [categoryData.Expense]);

  return (
    <div className={graphCSS.chartContainer}>
      <div className={graphCSS.chart}>
        <h3 className={graphCSS.income3}>Income Status </h3>
        {categoryData.Income.length > 0 && (
          <ReactApexChart
            options={incomeChartOptions}
            series={categoryData.Income.map((income) => income.data[0])}
            type="donut"
          />
        )}
      </div>

      <div className={graphCSS.chart}>
        <h3 className={graphCSS.expense3}>Expense Status </h3>
        {categoryData.Expense.length > 0 && (
          <ReactApexChart
            options={expenseChartOptions}
            series={categoryData.Expense.map((expense) => expense.data[0])}
            type="donut"
          />
        )}
      </div>
    </div>
  );
};

export default Graph;