import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import graphCSS from "./Graph.module.css";
const apiUrl = "https://omnireports.azurewebsites.net/api/CRUD_irwb?";

const Graph = () => {
  const [incomeTypeData, setIncomeTypeData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Income");
  const [show, setShow] = useState(true);
  const [data, setData] = useState([]);
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
        console.log("Extracting incomeType and amount data...");

        // Extract incomeType and amount data and store it in incomeTypeData state
        const incomeDetails = temp[0].accountDetails.map((detail) => ({
          incomeType: detail.incomeType,
          amount: detail.amount,
        }));

        console.log("Income details:", incomeDetails);

        setIncomeTypeData(incomeDetails);
      }

      setData(temp);

      console.log("Fetch completed successfully!");
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    fetchIncomeData();
  }, [userId]);

  const categoryData = {
    Income: [44, 55, 41, 17, 15],
    Expense: [30, 40, 35, 10, 25],
    Savings: [20, 30, 25, 5, 15],
    Loans: [10, 15, 5, 2, 8],
  };

  const options = {
    chart: {
      width: 380,
      type: "donut",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          labels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: false,
            },
            total: {
              show: true,
              label: "Total",
              color: "#000000",
              fontSize: "18px",
              fontFamily: "Arial, sans-serif",
              offsetY: 0,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
    },
    title: {
      text: "Money Tracker",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  const handleChange = (event) => {
    const selected = event.target.value;
    setSelectedCategory(selected);
  };

  return (
    <div>
      <div>
        <label htmlFor="category">Select Category: </label>
        <select id="category" onChange={handleChange} value={selectedCategory}>
          {Object.keys(categoryData).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div id={graphCSS.chart}>
        {show && (
          <ReactApexChart
            options={options}
            series={categoryData[selectedCategory]}
            type="donut"
            width={380}
          />
        )}
      </div>
    </div>
  );
};

export default Graph;