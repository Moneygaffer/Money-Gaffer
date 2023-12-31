import React, { useEffect, useState } from "react";
import ExpenseCSS from "./Expense.module.css";
import axios from "axios";
import { TablePagination } from "@mui/material";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "jspdf-autotable";
import jsPDF from "jspdf";

const apiUrl = "https://pfmservices.azurewebsites.net/api/CRUD_irwb?";

function FormTable({ addTransaction }) {
  const [data, setData] = useState([]);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [bankName, setBankName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [bankid, setBankId] = useState("");
  const [page, setPage] = useState(0);
  const [address, setAddress] = useState("");
  const [editMode, setEditMode] = useState("");
  const [editRecordId, setEditRecordId] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [transactionType, setTransactionType] = useState("");
  const [expTypeFilter, setExpTypeFilter] = useState("");
  const [expTitleFilter, setExpTitleFilter] = useState("");
  const [accountNoFilter, setAccountNoFilter] = useState("");
  const [bankNameFilter, setBankNameFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

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

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Expense Type","Account ID", "Description", "Amount", "Date"];
    const tableRows = [];

    flattenedData.forEach((item) => {
      const { transactionType, accountId, description, amount, dot } = item;
      const rowData = [
        transactionType,
        accountId,
        description,
        amount,
        new Date(dot).toLocaleDateString(),
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("accountDetails.pdf");
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
      console.log("fetched Data:", data);
      const temp = parseData(data.data);
      console.log("The details from database:", temp);
      setData(temp);
    } catch (error) {
      console.log("API Error:", error);
    }
  };

  useEffect(() => {
    fetchExpenseData();
  }, [userId]);

  const handleEdit = (recordId) => {
    console.log("Editing with respect to record Id:", recordId);
    const editRecord = data.reduce((acc, item) => {
      const foundDetail = item.accountDetails.find(
        (detail) => detail.recordId === recordId
      );
      if (foundDetail) {
        acc = foundDetail;
      }
      return acc;
    }, null);
    setTransactionType(editRecord.transactionType);
    setExpenseTitle(editRecord.description);
    setBankId(editRecord.accountId);
    setBankName(editRecord.bankName);
    setAddress(editRecord.address);
    setAmount(editRecord.amount);
    setDate(editRecord.dot);
    setEditMode(true);
    setEditRecordId(editRecord.recordId);
  };

  const handleCancelEdit = () => {
    setTransactionType("");
    setExpenseTitle("");
    setBankId("");
    setBankName("");
    setAddress("");
    setAmount("");
    setDate("");
    setEditMode(false);
    setEditRecordId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        const updatedData = await axios.post(apiUrl, {
          crudtype: 3,
          userId: session[0].Value,
          recordid: editRecordId,
          collectionname: "expense",
          data: {
            transactionType:transactionType,
            description: expenseTitle,
            accountId: bankid,
            amount: amount,
            transactionType: transactionType,
            bankName: bankName,
            dot: new Date(date).toISOString().split("T")[0],
          },
        });
        if (updatedData.data.status === "PASS") {
          console.log("Updated data successfully");
          fetchExpenseData();
          handleCancelEdit();
        } else {
          console.log("Failed to update data:", updatedData.data.message);
        }
      } else {
        const recordId = uuid();
        let foundAccount = null;

        const { data: bankData } = await axios.post(
          apiUrl,
          {
            crudtype: 2,
            userId: session[0].Value,
            bankid: bankid,
            recordid: null,
            collectionname: "bankaccounts",
          },
          {
            Authorization: session.token,
          }
        );
        console.log(bankData);
        const bankAccounts = JSON.parse(
          bankData.data.replace(/ObjectId\("(\w+)"\)/g, '"$1"')
        );
        if (Array.isArray(bankAccounts)) {
          for (const account of bankAccounts) {
            if (Array.isArray(account.details)) {
              foundAccount = account.details.find(
                (detail) =>
                  detail.bankName === bankName.toLowerCase() &&
                  detail.address === address.toLowerCase()
              );
              if (foundAccount) {
                setBankId(foundAccount.accountId);
                break;
              }
            }
          }
        } else {
          console.log("Bank not found");
          return;
        }
        const requestData = await axios.post(
          apiUrl,
          {
            crudtype: 1,
            userId: session[0].Value,
            recordid: recordId,
            collectionname: "expense",
            data: {
              description: expenseTitle,
              accountId: foundAccount.accountId,
              amount: amount,
              transactionType: transactionType,
              bankName: bankName,
              dot: new Date(date).toISOString().split("T")[0],
            },
          },
          {
            Authorization: session.token,
          }
        );
        if (requestData.data.status === "PASS") {
          console.log("Data saved successfully");
          fetchExpenseData();
        } else {
          console.log("Failed to save data", requestData.data.message);
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }
    setExpenseTitle("");
    setBankName("");
    setTransactionType("");
    setAddress("");
    setAmount("");
    setDate("");
  };

  const handleDelete = async (recordId) => {
    try {
      console.log("Deleting with recordId:", recordId);
      const { data: requestData } = await axios.post(
        apiUrl,
        {
          crudtype: 4,
          userId: session[0].Value,
          recordid: recordId,
          bankId: null,
          collectionname: "expense",
          data: { data },
        },
        {
          Authorization: session.token,
        }
      );
      console.log("Deleting:", requestData);
      console.log("Deleting:", data);
      console.log(userId);

      if (
        requestData &&
        requestData.data &&
        requestData.data.status === "PASS"
      ) {
        console.log("Data deleted successfuly");
        fetchExpenseData();
      } else {
        console.log(
          "Failed to delete data:",
          requestData && requestData.data && requestData.data.message
        );
      }
    } catch (error) {
      console.log("API Error:", error);
    }
  };

  const flattenedData = data.flatMap((item) => item.accountDetails);

  const filteredData = flattenedData.filter((detail) => {
    const expTypeMatch = expTypeFilter === "" || detail.transactionType === expTypeFilter;
    const expTitleMatch = expTitleFilter === "" || detail.description.includes(expTitleFilter);
    const accountNoMatch = accountNoFilter === "" || detail.accountId.includes(accountNoFilter);
    const bankNameMatch = bankNameFilter === "" || detail.bankName.includes(bankNameFilter);
    const amountMatch = amountFilter === "" || detail.amount.toString().includes(amountFilter);
    const dateMatch =dateFilter === "" || new Date(detail.dot).toISOString().split("T")[0] === dateFilter;
  
    return expTypeMatch && expTitleMatch && accountNoMatch && bankNameMatch && amountMatch && dateMatch;
  });

  return (
    <div className={ExpenseCSS.page_container}>
      <div className={ExpenseCSS.container}>
        <div className={ExpenseCSS.form_container}>
          <h2>{editMode ? "Edit Expense Details" : "Expense Details"}</h2>
          <div className={ExpenseCSS.form_group}>
            <label htmlFor="expenseTitle">Expense Title</label>
            <input
              type="text"
              id="expenseTitle"
              placeholder="Enter Expense Title"
              value={expenseTitle}
              onChange={(e) => setExpenseTitle(e.target.value)}
            />
          </div>
          <div className={ExpenseCSS.form_group}>
            <label htmlFor="expenseTye">Expense Type</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Food">Food</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="DailyExpense">DailyExpense</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className={ExpenseCSS.form_group}>
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
          <div className={ExpenseCSS.form_group}>
            <label>Enter Your Branch</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className={ExpenseCSS.form_group}>
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className={ExpenseCSS.form_group}>
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className={ExpenseCSS.form_group}>
            <button
              type="submit"
              className={ExpenseCSS.btn_ExpenseSaveChanges}
              onClick={handleSave}
            >
              {editMode ? "Save Changes" : "Save"}{" "}
            </button>
            {editMode && (
              <button
                type="button"
                className={ExpenseCSS.btn_ExpenseCancel}
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        <div className={ExpenseCSS.table_container}>
          <h2>
            Expense Data{" "}
            <Link to="/Expenserecords" className={ExpenseCSS.btn_2}>
              Expense Records
            </Link>
            <button onClick={generatePDF} className={ExpenseCSS.pdfbutton}>
              Export to PDF
            </button>
          </h2>
          <div className={ExpenseCSS.custom_filters}>
  <div className={`${ExpenseCSS.form_group} ${ExpenseCSS.inline_filter}`}>
    {/* <label>Exp Type Filter</label> */}
    <select className={ExpenseCSS.select_filter}
      value={expTypeFilter}
      onChange={(e) => setExpTypeFilter(e.target.value)}
    >
      <option value="">All</option>
      <option value="Food">Food</option>
      <option value="Shopping">Shopping</option>
      <option value="Entertainment">Entertainment</option>
      <option value="DailyExpense">DailyExpense</option>
      <option value="Others">Others</option>
    </select>
  </div>

  <div className={`${ExpenseCSS.form_group} ${ExpenseCSS.inline_filter}`}>
    {/* <label>Exp Title Filter</label> */}
    <input 
      type="text"
      placeholder="ExpTitle"
      value={expTitleFilter}
      onChange={(e) => setExpTitleFilter(e.target.value)}
    />
  </div>
  
  <div className={`${ExpenseCSS.form_group} ${ExpenseCSS.inline_filter}`}>
    {/* <label>Acc No Filter</label> */}
    <input 
      type="text"
      placeholder="Acc No"
      value={accountNoFilter}
      onChange={(e) => setAccountNoFilter(e.target.value)}
    />
  </div>
  <div className={`${ExpenseCSS.form_group} ${ExpenseCSS.inline_filter}`}>
    {/* <label>Bank Name Filter</label> */}
    <input 
      type="text"
      placeholder="BankName"
      value={bankNameFilter}
      onChange={(e) => setBankNameFilter(e.target.value)}
    />
  </div>
  <div className={`${ExpenseCSS.form_group} ${ExpenseCSS.inline_filter}`}>
    {/* <label>Amt Filter</label> */}
    <input 
      type="text"
      placeholder="Amt"
      value={amountFilter}
      onChange={(e) => setAmountFilter(e.target.value)}
    />
  </div>
  <div className={`${ExpenseCSS.form_group} ${ExpenseCSS.inline_filter}`}>
    {/* <label>Date Filter</label> */}
    <input 
      type="date"
      value={dateFilter}
      onChange={(e) => setDateFilter(e.target.value)}
    />
  </div>
</div>

          <table>
            <thead>
              <tr>
                <th>Exp Type</th>
                <th>Exp Title</th>
                <th>Account No</th>
                <th>Bank Name</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((detail, idx) => (
                  <tr key={idx} className="pagination-data">
                    <td>{detail.transactionType}</td>
                    <td>{detail.description}</td>
                    <td>{detail.accountId}</td>
                    <td>{detail.bankName}</td>
                    <td>{detail.amount}</td>
                    <td className={ExpenseCSS.td_1}>
                      {new Date(detail.dot).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <EditIcon
                        onClick={() => handleEdit(detail.recordId)}
                        className={ExpenseCSS.editIcon}
                      />
                      <DeleteIcon
                        onClick={() => handleDelete(detail.recordId)}
                        className={ExpenseCSS.deleteIcon}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <TablePagination
            component="div"
            count={flattenedData.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[4, 6, 7,8, 9]}
          />
        </div>
      </div>
    </div>
  );
}

export default FormTable;
