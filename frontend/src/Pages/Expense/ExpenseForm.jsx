import React, {  useState } from "react";
import "./ExpenseForm.css";
import axios from "axios";
import { TablePagination } from "@mui/material";
import {v4 as uuid} from "uuid";

const apiUrl = 'https://omnireports.azurewebsites.net/api/CRUD_irwb?';

function FormTable({ addTransaction }) {
  const [data] = useState([]);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [bankName, setBankName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [bankid,setBankId] =useState("");
  const [page, setPage] = useState(0);
  const [address,setAddress]=useState("");
  const rowsPerPage = 8;


  const session=JSON.parse(sessionStorage.getItem("user"));
  const userIdObj=session.find((item)=>item.Name==="_id")
  const userId=userIdObj?userIdObj.Value:null;

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const recordId=uuid();
    let foundAccount=null;
    try{
      const {data:bankData} =await axios.post(apiUrl,{
        crudtype:2,
        userId:userId,
        bankid:bankid,
        recordId:null,
        collectionname:"bankaccounts",
      });
      if(userId){
        console.log(userId)
      }
      console.log(bankData);
      const bankAccounts=JSON.parse(bankData.data.replace(/ObjectId\("(\w+)"\)/g, '"$1"'))
      console.log("Parsed bank accounts:",bankAccounts);
      console.log("bank Name:",bankName);
      console.log("Length of bank Accounts:",bankAccounts.length);

      const bankNameLower=bankName.toLowerCase();
      const addressLower=address.toLowerCase();


      if(Array.isArray(bankAccounts)){
        for(const account of bankAccounts){
          if(Array.isArray(account.details)){
            foundAccount=account.details.find((detail)=>(detail.bankName===bankNameLower && detail.address===addressLower));
            if(foundAccount){
              setBankId(foundAccount.recordId);
              console.log("Bank ID:",foundAccount.recordId);
              break;
            }
          }
        }
      }
      else{
        console.log("Bank not found");
        return;
      }
      const requestData=await axios.post(apiUrl,{
        crudtype:1,
        userId:userId,
        recordid:recordId,
        collectionname:"expense",
        data:{
          description:expenseTitle,
          accountId:foundAccount.recordId,
          amount:amount,
          dot:date
        }
      });
      console.log(requestData);
      console.log(requestData.data)
      if(requestData.data.status==="PASS"){
        console.log("Data saved successfully");
      }
      else{
        console.log("Failed to save data",requestData.data.message);
      }
    }
    catch(error){
      console.error('API error:',error)

    }
    setExpenseTitle("");
    setBankName("");
    setAddress("");
    setAmount("");
    setDate("");

  }
  return (
    <div className="page-container">
      <div className="container">
        <div className="form-container">
          <h2>Expense Details</h2>

          <form onSubmit={handleSubmit}>
          <div className="form-group">
          <label htmlFor="expenseTitle">Expense Title</label>
          <input
            type="text"
            id="expenseTitle"
            placeholder="Enter Expense Title"
            value={expenseTitle}
            onChange={(e) => setExpenseTitle(e.target.value)}
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
          <h2>Expense Data</h2>
          <table>
            <thead>
              <tr>
                <th>Expense Title</th>
                <th>Savings Account</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item["expenseTitle"]}</td>
                      <td>{item.savingsAccount}</td>
                      <td>{item.amount}</td>
                      <td>{item.date}</td>
                      <td>
                        <button  className="edit">
                          Edit
                        </button>
                        <button  className="delete">
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
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
      </div>
    </div>
  );
}

export default FormTable;