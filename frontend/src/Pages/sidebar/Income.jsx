import React, { useState, useEffect } from "react";
import IncomeCSS from "./Income.module.css";
import axios from "axios";
import { TablePagination } from "@mui/material";
import 'jspdf-autotable'
import jsPDF from 'jspdf';
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const apiUrl = "https://omnireports.azurewebsites.net/api/CRUD_irwb?";


function FormTable({ addTransaction }) {
  const [incomeTitle, setincomeTitle] = useState("");
  const [bankName, setBankName] = useState("sbi");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [data, setData] = useState([]);
  const [bankid, setBankId] = useState("");
  const [address, setAddress] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [editMode, setEditMode] = useState(false);
  const [incomeType, setincomeType] = useState("");
  const [editRecordId, setEditRecordId] = useState(null);
  const session = JSON.parse(sessionStorage.getItem("user"));

  
  const userIdObj = session && session.Name === "_id" ? session : null;
  const userId = userIdObj ? userIdObj.Value : null;

  // const moreinfo = () => {
  //   setRowPage(rowPage + 2);
  // };

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
    const tableColumn = [ 'Account ID','Bank Name', 'Description', 'Amount', 'Date'];
    const tableRows = [];

flattenedData.forEach((item) => {
  const {  accountId,bankName, description, amount, dot } = item;
  const rowData = [ accountId, bankName,description, amount, new Date(dot).toLocaleDateString()];
  tableRows.push(rowData);
});


    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save('accountDetails.pdf');
  }

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
      console.log("fetched data:", data);
      const temp = parseData(data.data);
      console.log("The details from database:", temp);
      setData(temp);
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  useEffect(() => {
    fetchIncomeData();
  }, [userId]);

  const handleEdit = (recordId) => {
    console.log("Editing record with ID:", recordId);
    const editRecord = data.reduce((acc, item) => {
      const foundDetail = item.accountDetails.find(
        (detail) => detail.recordId === recordId
      );
      if (foundDetail) {
        acc = foundDetail;
      }
      return acc;
    }, null);

    setincomeTitle(editRecord.description);
    setBankName(editRecord.bankName);
    setAddress(editRecord.address);
    setAmount(editRecord.amount);
    setDate(editRecord.dot);
    setEditMode(true);
    setEditRecordId(recordId);
  };
  const handleCancelEdit = () => {
    setincomeTitle("");
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
          collectionname: "income",
          data: {
            description: incomeTitle,
            accountId: bankid,
            amount: amount,
            incomeType:incomeType,
            bankName:bankName,
            dot: new Date(date).toISOString().split("T")[0],
          },
        });

        if (updatedData.data.status === "PASS") {
          console.log("Data updated successfully");
          fetchIncomeData();
          handleCancelEdit();
        } else {
          console.log("Failed to update data", updatedData.data.message);
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
          { Authorization: session.token }
        );

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
                setBankName(foundAccount.bankName);
                break;
              }
            }
          }
        } else {
          console.log("Bank not found");
          return;
        }
        // const requestBankName = await axios.post()
        const requestData = await axios.post(
          apiUrl,
          {
            crudtype: 1,
            userId: session[0].Value,
            recordid: recordId,
            collectionname: "income",
            data: {
              description: incomeTitle,
              incomeType: incomeType,
              accountId: foundAccount.accountId,
              bankName: bankName,
              amount: amount,
              dot: new Date(date).toISOString().split("T")[0],
            },
          },
          {
            Authorization: session.token,
          }
        );
        console.log("bank name is :", bankName);
        console.log("amount is :",amount)
        if (requestData.data.status === "PASS") {
          console.log("Data saved Successfully");
          console.log("cureent data:", data);
          fetchIncomeData();
        } else {
          console.log("Failed to save data", requestData.data.message);
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }

    setincomeTitle("");
    setincomeType("");
    setBankName("");
    setAddress("");
    setAmount("");
    setDate("");
  };
  const handleDelete = async (recordId) => {
    try {
      console.log("Deleting with ID:", recordId);

      const { data: requestData } = await axios.post(
        apiUrl,
        {
          crudtype: 4,
          userId: session[0].Value,
          recordid: recordId,
          bankId: null,
          collectionname: "income",
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
        console.log("Data deleted successfully");
        fetchIncomeData();
      } else {
        console.log(
          "Failed to delete data",
          requestData && requestData.data && requestData.data.message
        );
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const flattenedData = data.flatMap((item) => item.accountDetails);

  return (
    <div className={IncomeCSS.page_container}>
      <div className={IncomeCSS.container}>
        <div className={IncomeCSS.form_container}>
          <h2>{editMode ? "Edit Income Details" : "Income Details"}</h2>
          <div className={IncomeCSS.form_group}>
            <label htmlFor="incomeTitle">Income Title</label>
            <input
              type="text"
              id="incomeTitle"
              placeholder="Enter Income Title"
              value={incomeTitle}
              onChange={(e) => setincomeTitle(e.target.value)}
            />
          </div>
          <div className={IncomeCSS.form_group}>
            <label htmlFor="incomeType">Income Type</label>
            <input
              type="text"
              id="incomeType"
              placeholder="Enter Income Type"
              value={incomeType}
              onChange={(e) => setincomeType(e.target.value)}
            />
          </div>
          <div className={IncomeCSS.form_group}>
            <label>Select Bank Name</label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            >
              <option value="">Select</option>
              <option value="SBI">SBI</option>
              <option value="HDFC">HDFC</option>
              <option value="Karnataka">Karnataka</option>
              <option value="ICICI">ICICI</option>
              <option value="AXIS">AXIS</option>
              <option value="CANARA">CANARA</option>
              <option value="HDFC">HDFC</option>
            </select>
          </div>
          <div className={IncomeCSS.form_group}>
            <label>Enter Your Branch</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className={IncomeCSS.form_group}>
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className={IncomeCSS.form_group}>
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className={IncomeCSS.form_group}>
           
            <button
              type="submit"
              className={IncomeCSS.btn_IncomeSaveChanges}
              onClick={handleSave}
            >
              {editMode ? "Save Changes" : "Save"}{" "}
            </button>
            {editMode && (
              <button
                type="button"
                className={IncomeCSS.btn_IncomeCancel}
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        <div></div>
        <div className={IncomeCSS.table_container}>
          <h2>
            Income Data{" "}
            <Link to="/Incomerecords" className={IncomeCSS.btn_2}>
              Income Records
            </Link>
            <button onClick={generatePDF}  className={IncomeCSS.pdfbutton}>Export to PDF</button>

          </h2>
          <table>
            <thead>
              <tr>
                <th>Income Title</th>
                <th>Savings Account</th>
                <th>Bank Name</th>
                <th>Amount</th>
                <th>Date</th>
                <th> Action</th>
              </tr>
            </thead>
            <tbody>
            {flattenedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((detail, idx) => (
                <tr key={idx} className="pagination-data">
                  <td className={IncomeCSS.td_1}>{detail.description}</td>
                  <td className={IncomeCSS.td_1}>{detail.accountId}</td>
                  <td className={IncomeCSS.td_1}>{detail.bankName}</td>
                  <td className={IncomeCSS.td_1}>{detail.amount}</td>
                  <td className={IncomeCSS.td_1}>
              {new Date(detail.dot).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </td>
            
                  <td className={IncomeCSS.td_1}>
                    <EditIcon
                      onClick={() => handleEdit(detail.recordId)}
                      className={IncomeCSS.editIcon}
                    />
                    <DeleteIcon
                      onClick={() => handleDelete(detail.recordId)}
                      className={IncomeCSS.deleteIcon}
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
          rowsPerPageOptions={[4, 6,8,9]}
        />
      </div>
    </div>
  </div>
);
        }

export default FormTable;
