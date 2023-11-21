import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import axios from "axios";
//import "./Loan.css"
const apiUrl = "https://omnireports.azurewebsites.net/api/CRUD_irwb?";

function InsuranceForm() {
  const [policyNum, setPolicyNum] = useState("");
  const [insuranceType, setInsuranceType] = useState("");
  const [insuranceCompany, setInsuranceCompany] = useState("");
  const [premiumAmt, setPremiumAmt] = useState("");
  const [startDate, setStartDate] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [coverageAmt, setCoverageAmt] = useState("");
  const [desc, setDesc] = useState("");

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
        collectionname: "insurance",
        data: {
          policyNumber: policyNum,
          insuranceType: insuranceType,
          insuranceCompany: insuranceCompany,
          premiumAmount: premiumAmt,
          startDate: startDate,
          renewalDate: renewalDate,
          coverageAmount: coverageAmt,
          description: desc,
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
    setPolicyNum("");
    setInsuranceType("");
    setInsuranceCompany("");
    setPremiumAmt("");
    setStartDate("");
    setRenewalDate("");
    setCoverageAmt("");
    setDesc("");
  };
  return (
    <div className="page-container4">
      <div className="container4">
        <div className="form-container4">
          <h2> Your Insurance Details</h2>
          <form onSubmit={handlesubmit}>
            <div className="form-group4">
              <div className="form-column">
                <label>Enter Policy Number</label>
                <input
                  type="text"
                  id="policyNum"
                  placeholder="Enter Policy Number"
                  value={policyNum}
                  onChange={(e) => setPolicyNum(e.target.value)}
                />
                <label>Enter Insurance Type</label>
                <input
                  type="text"
                  id="insuranceType"
                  placeholder="Enter Insurance Type"
                  value={insuranceType}
                  onChange={(e) => setInsuranceType(e.target.value)}
                />
                <label>Enter Insurance Company</label>
                <input
                  type="text"
                  id="insuranceCompany"
                  placeholder="Enter Isurance Company"
                  value={insuranceCompany}
                  onChange={(e) => setInsuranceCompany(e.target.value)}
                />
                <label>Enter Premium Amount</label>
                <input
                  type="text"
                  id="premiumAmt"
                  placeholder="Enter Premium Amount"
                  value={premiumAmt}
                  onChange={(e) => setPremiumAmt(e.target.value)}
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
                <label>Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  placeholder="Enter Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <label>Renewal Date</label>
                <input
                  type="date"
                  id="renewalDate"
                  placeholder="Enter Renewal Date"
                  value={renewalDate}
                  onChange={(e) => setRenewalDate(e.target.value)}
                />
                <label>Coverage Amount</label>
                <input
                  type="text"
                  id="coverageAmt"
                  placeholder="Enter Coverage Amount"
                  value={coverageAmt}
                  onChange={(e) => setCoverageAmt(e.target.value)}
                />
                <label>Description</label>
                <input
                  type="text"
                  id="desc"
                  placeholder="Enter your Description Here"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InsuranceForm;
