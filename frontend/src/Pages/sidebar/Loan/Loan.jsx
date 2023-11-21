import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import axios from "axios";
import "./Loan.css";
const apiUrl = "https://omnireports.azurewebsites.net/api/CRUD_irwb?";

function Loan() {
  const [loanType, setLoanType] = useState("");
  const [vendor, setVendor] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [emi, setEmi] = useState("");
  const [tenure, setTenure] = useState("");
  const [roi, setRoi] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pendAmount, setPendAmount] = useState("");

  const session = JSON.parse(sessionStorage.getItem("user"));
  const userIdObj = session && session.Name === "_id" ? session : null;
  const userId = userIdObj ? userIdObj.Value : null;

  const handlesubmit = async (e) => {
    e.preventDefault();
    const recordId = uuid();
    try {
      const response = await axios.post(apiUrl, {
        crudtype: 1,
        userId: userId,
        recordid: recordId,
        collectionname: "loans",
        data: {
          loanType: loanType,
          vendor: vendor,
          loanAmount: loanAmount,
          emi: emi,
          tenure: tenure,
          roi: roi,
          startDate: startDate,
          endDate: endDate,
          pendingAmount: pendAmount,
        },
      });
      console.log(response);
      if (response.data.status === "PASS") {
        console.log("Data saved Successfully");
      } else {
        console.log("Failed to save data", response.data.message);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
    setLoanType("");
    setVendor("");
    setLoanAmount("");
    setEmi("");
    setTenure("");
    setRoi("");
    setStartDate("");
    setEndDate("");
    setPendAmount("");
  };
  return (
    <div className="page-container4">
      <div className="container4">
        <div className="form-container4">
          <h2> Your Loan Details</h2>
          <form onSubmit={handlesubmit}>
            <div className="form-group4">
              <div className="form-column">
                <label>Type Of Loan</label>
                <input
                  type="text"
                  id="loanType"
                  placeholder="Type Of Loan"
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                />
                <label>Enter Loan Amount</label>
                <input
                  type="text"
                  id="loanAmount"
                  placeholder="Enter Loan Amount"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                />
                <label>Enter Tenure</label>
                <input
                  type="text"
                  id="tenure"
                  placeholder="Enter Tenure"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                />
                <label>Enter Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  placeholder="Enter Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <div className="form-column">
                  <button
                    type="submit"
                    style={{
                      marginTop: "30px",
                      marginLeft: "30px",
                      width: "50%",
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
              <div className="form-column">
                <label>Vendor</label>
                <input
                  type="text"
                  id="vendor"
                  placeholder="Enter Vendor Here"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                />
                <label>EMI To Pay</label>
                <input
                  type="text"
                  id="emi"
                  placeholder="EMI To Pay"
                  value={emi}
                  onChange={(e) => setEmi(e.target.value)}
                />
                <label>Return On Investment(ROI)</label>
                <input
                  type="text"
                  id="roi"
                  placeholder="Enter ROI"
                  value={roi}
                  onChange={(e) => setRoi(e.target.value)}
                />
                <label>Enter End Date</label>
                <input
                  type="date"
                  id="endDate"
                  placeholder="Enter End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <label>Enter Pending Amount</label>
                <input
                  type="text"
                  id="pendAmount"
                  placeholder="Enter Pending Amount"
                  value={pendAmount}
                  onChange={(e) => setPendAmount(e.target.value)}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Loan;
