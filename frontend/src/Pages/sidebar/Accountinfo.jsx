import React, { useState } from "react";
import axios from "axios";
import "./AccountInfo.css";
import { v4 as uuid } from "uuid";

const apiUrl = "https://pfmservices.azurewebsites.net/api/CRUD_irwb?";

function AccountInfo() {
  const [bankName, setBankName] = useState("");
  const [address, setAddress] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [micrCode, setMicrCode] = useState("");
  const [accountType, setAccountType] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [accountId, setAccountId] = useState("");

  const session = JSON.parse(sessionStorage.getItem("user"));

  
  const userIdObj = session && session.Name === "_id" ? session : null;
  const userId = userIdObj ? userIdObj.Value : null;


  const handlesubmit = async (e) => {
    e.preventDefault();
    const recordId = uuid();
    try {
      const response = await axios.post(apiUrl, {
        crudtype: 1,
        userId: session[0].Value,
        recordid: recordId,
        collectionname: "bankaccounts",
        data: {
          accountId: accountId,
          bankName: bankName.toLowerCase(),
          address: address.toLowerCase(),
          ifsccode: ifscCode,
          micrCode: micrCode,
          accountType: accountType,
          swiftCode: swiftCode,
        },
      },{
        Authorization:session.token,
      });

      console.log(response);

      if (response.data.status === "PASS") {
        console.log("Data saved successfully");
      } else {
        console.error("Failed to save data:", response.data.message);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
    setAccountId("");
    setBankName("");
    setAccountType("");
    setAddress("");
    setIfscCode("");
    setMicrCode("");
    setSwiftCode("");
  };

  return (
    <div className="page-container2">
      <div className="container2">
        <div className="form-container2">
          <h2>Enter your Account Details</h2>
          <form onSubmit={handlesubmit}>
            <div className="form-group2">
              <div className="left-column">
                <label>Enter Account ID</label>
                <input
                  type="text"
                  id="accountId"
                  placeholder="Enter Account ID"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                />
              </div>
              <div className="left-column">
                <label>Enter Bank Name</label>
                <input
                  type="text"
                  id="bankName"
                  placeholder="Enter Bank Name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>
              <div className="left-column">
                <label>Enter Account Type</label>
                <input
                  type="text"
                  id="accountType"
                  placeholder="Enter Account Type"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                />
              </div>
              <div className="left-column">
                <label>Enter Address</label>
                <input
                  type="text"
                  id="address"
                  placeholder="Enter Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group2">
              <div className="right-column">
                <label>Enter IFSC Code</label>
                <input
                  type="text"
                  id="ifscCode"
                  placeholder="Enter IFSC Code"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                />
              </div>
              <div className="right-column">
                <label>Enter MICR Code</label>
                <input
                  type="text"
                  id="micrCode"
                  placeholder="Enter MICR Code"
                  value={micrCode}
                  onChange={(e) => setMicrCode(e.target.value)}
                />
              </div>
              <div className="right-column">
                <label>Enter SWIFT Code</label>
                <input
                  type="text"
                  id="swiftCode"
                  placeholder="Enter SWIFT Code"
                  value={swiftCode}
                  onChange={(e) => setSwiftCode(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group2">
              <button className=" btn-1" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AccountInfo;
