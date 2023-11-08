import React, {  useState,useEffect } from "react";
import "./incomecss.css";
import axios from "axios";
import { TablePagination } from "@mui/material";
import {v4 as uuid} from 'uuid';


const apiUrl = 'https://omnireports.azurewebsites.net/api/CRUD_irwb?';

  
function FormTable({ addTransaction }) {
  const [incomeTitle, setincomeTitle] = useState("");
  const [bankName, setBankName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [data, setData] = useState([]);
  const [bankid,setBankId]=useState("");
  const [address,setAddress]=useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 8; 
  const session = JSON.parse(sessionStorage.getItem("user"))

  const userIdObj = session.find((item) => item.Name === "_id");
  const userId = userIdObj ? userIdObj.Value : null;

  const parseData = (data) => {
    const modifiedData = data
      .replaceAll('ISODate(', '') 
      .replaceAll('ObjectId(', '')
      .replaceAll(')', '');
  
    try {
      return JSON.parse(modifiedData);
    } catch (error) {
      console.error('Error parsing data:', error);
      return [];
    }
  };
  
  const fetchIncomeData = async () => {
    try {
      const { data } = await axios.post(apiUrl, {
        crudtype: 2,
        recordid: null,
        collectionname: 'income',
        userId: userId,
      });
      const temp = parseData(data.data);
      console.log("The details from databse:",temp)
      setData(temp);
    } catch (error) {
      console.error('API Error:', error);
    }
  };
  useEffect(() => {
    fetchIncomeData();
  }, [userId]);  

const handleSubmit = async (e) => {
  e.preventDefault();
  const recordId = uuid();
  let foundAccount = null;
  try {
    const { data: bankData } = await axios.post(apiUrl, {
      crudtype: 2,
      userId: userId,
      bankid:bankid,
      recordid: null,
      collectionname: "bankaccounts",
    });
    if(userId){
      console.log(userId)

    }
    console.log(bankData);
    const bankAccounts =   JSON.parse(bankData.data.replace(/ObjectId\("(\w+)"\)/g, '"$1"'));
    console.log("Parsed Bank Accounts:", bankAccounts);
    console.log("Bank Name:", bankName);
    console.log("Length of Bank Accounts:", bankAccounts.length);

   //const  bankNameLower=bankName.toLowerCase();
    //const addressLower=address.toLowerCase();
    //console.log(bankNameLower);
    //console.log(addressLower)
    if (Array.isArray(bankAccounts)) {
      for (const account of bankAccounts) {
        if (Array.isArray(account.details)) {
          foundAccount = account.details.find((detail) =>( detail.bankName ===bankName.toLowerCase()  && detail.address === address.toLowerCase()) );
          console.log(foundAccount)
          if (foundAccount) {
            setBankId(foundAccount.recordId);
            console.log("Bank ID:", foundAccount.recordId);
            break;
          }
        }
      
      }
    }
    else {
      console.log("Bank not found");
      return;
    }

    const requestData = await axios.post(apiUrl, {
      crudtype: 1,
      userId: userId,
      recordid: recordId,
      collectionname: "income",
      data: {
        description: incomeTitle,
        accountId: foundAccount.recordId, 
        amount: amount,
        dot: date
      }
    });

    console.log(requestData);

    if (requestData.data.status === 'PASS') {
      console.log("Data saved Successfully");
    } else {
      console.log("Failed to save data", requestData.data.message);
    }
  } catch (error) {
    console.error('API error:', error);
  }

  setincomeTitle("");
  setBankName("");
  setAddress("");
  setAmount("");
  setDate("");
};

  return (
    <div className="page-container">
      <div className="container">
        <div className="form-container">
          <h2>Income Details</h2>
          <form onSubmit={handleSubmit}>
          <div className="form-group">
          <label htmlFor="incomeTitle">Income Title</label>
          <input
            type="text"
            id="incomeTitle"
            placeholder="Enter Income Title"
            value={incomeTitle}
            onChange={(e) => setincomeTitle(e.target.value)}
          />
        </div>
            <div className="form-group">
              <label>Savings Account</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              >
                <option value="">Select</option>
                <option value="SBI">SBI</option>
                <option value="HDFC">HDFC</option>
                <option value="Karnataka Bank">Karnataka</option>
                <option value="ICICI">ICICI</option>
                <option value="AXIS">AXIS</option>
                <option value="CANARA">CANARA</option>
                <option value="HDFC">HDFC</option>

              </select>
            </div>
            <div className="form-group">
              <label>Enter Your Branch</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
        <div className="table-container">
          <h2>Income Data</h2>
          <table>
            <thead>
              <tr>
                <th>Income Title</th>
                <th>Savings Account</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
  {data &&
    data.length > 0 &&
    data
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((item, index) => {
        console.log("Mapped Item:", item);
        return item.accountDetails.map((detail, idx) => (
          <tr key={idx}>
            <td>{detail.description}</td>
            <td>{detail.accountId}</td>
            <td>{detail.amount}</td>
            <td>{detail.dot}</td>
          </tr>
        ));
      })}
</tbody>

          </table>
          <TablePagination
            component="div"
            count={data.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
          />
        </div>
        {/* Pagination Controls */}
   
      </div>
    </div>
    
  );
}


export default FormTable;