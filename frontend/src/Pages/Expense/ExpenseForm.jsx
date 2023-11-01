import React, { useEffect, useState } from "react";
import "./ExpenseForm.css";
import axios from "axios";
import { TablePagination } from "@mui/material";

const apiUrl = 'https://omnireports.azurewebsites.net/api/CRUD_irwb';

function FormTable({ addTransaction }) {
  const [data, setData] = useState([]);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [savingsAccount, setSavingsAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
   const [editIndex, setEditIndex] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 8;

  const fetchExpenseData = async () => {
    try {
      const {data} = await axios.post(apiUrl, {
        
          crudtype: 2,
            recordid: null,
            collectionname: "expense"
      
      });
        const temp = JSON.parse((String(data.data).replaceAll('ObjectId(','')).replaceAll(')',""))
  
      setData(temp)
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  useEffect(() => {
    fetchExpenseData();
  }, []);

  const handleEdit = (id) => {
    const index = data.findIndex((item) => item._id === id);
    if (index !== -1) {
      setEditIndex(index);
      setExpenseTitle(data[index].expenseTitle);
      setSavingsAccount(data[index].savingsAccount);
      setAmount(data[index].amount);
      setDate(data[index].date);
    }
  };

  const handleDelete = async (id) => {
    try {
      const deleteUrl = `${apiUrl}/${id}`;
      await axios.post(apiUrl, {
        crudtype: 4,
        recordid: id,
        collectionname: "expense",
      });
      await axios.delete(deleteUrl);
      fetchExpenseData();
    } catch (error) {
      console.error('API Error:', error);
    }
  };
  
  // HandleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
      "crudtype": 1,
      "recordid": null,
      "collectionname": "expense",
      "data": {
        "expenseTitle": expenseTitle,
        "savingsAccount": savingsAccount,
        "amount": amount,
        "date": date
      }
    };

    
    try {
      setData([...data, requestData])
      await axios.post(apiUrl, requestData);
      fetchExpenseData();
    } catch (error) {
      console.error('API Error:', error);
    }

    setExpenseTitle("");
    setSavingsAccount("");
    setAmount("");
    setDate("");
  };

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
                value={savingsAccount}
                onChange={(e) => setSavingsAccount(e.target.value)}
              >
                <option value="">Select</option>
                <option value="SBI">SBI</option>
                <option value="HDFC">HDFC</option>
                <option value="Karnataka Bank">Karnataka Bank</option>
                <option value="ICICI">ICICI</option>
                <option value="AXIS">AXIS</option>
                <option value="CANARA">CANARA</option>
                <option value="HDFC">HDFC</option>

              </select>
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
                        <button onClick={() => handleEdit(item._id)} className="edit">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="delete">
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