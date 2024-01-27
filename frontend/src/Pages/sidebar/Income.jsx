import React, { useState, useEffect } from "react";
import IncomeCSS from "./Income.module.css";
import axios from "axios";
import { TablePagination } from "@mui/material";
import "jspdf-autotable";
import jsPDF from "jspdf";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import * as XLSX from "xlsx";

const apiUrl = "https://pfmservices.azurewebsites.net/api/CRUD_irwb?";

function FormTable({ addTransaction }) {
  const [incomeTitle, setincomeTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [bankName, setBankName] = useState("sbi");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [data, setData] = useState([]);
  const [bankid, setBankId] = useState("");
  const [address, setAddress] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [editMode, setEditMode] = useState(false);
  const [transactionType, setTransactionType] = useState("");
  const [editRecordId, setEditRecordId] = useState(null);
  const [incTypeFilter, setIncTypeFilter] = useState("");
  const [incTitleFilter, setIncTitleFilter] = useState("");
  const [accountNoFilter, setAccountNoFilter] = useState("");
  const [bankNameFilter, setBankNameFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const session = JSON.parse(sessionStorage.getItem("user"));

  const userIdObj = session && session.Name === "_id" ? session : null;
  const userId = userIdObj ? userIdObj.Value : null;
  let doc; // Define doc at the top level
  let tableColumn;
  let tableRows;
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });

          if (
            workbook &&
            workbook.SheetNames &&
            Array.isArray(workbook.SheetNames) &&
            workbook.SheetNames.length > 0
          ) {
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            if (Array.isArray(jsonData) && jsonData.length > 0) {
              const transformedData = jsonData.slice(1).map((row) => ({
                accountId: String(row[2]),
                bankName: String(row[3]),
                description: String(row[1]),
                transactionType: String(row[0]),
                amount: String(row[4]),
                dot:
                  new Date((row[5] - 25569) * 86400 * 1000)
                    .toISOString()
                    .split("T")[0] + "T00:00:00.000Z",
              }));

              // Console log the bank name and formatted dot for each row
              transformedData.forEach((row) => {
                console.log("Bank Name:", row.bankName);
                console.log("Formatted Date:", row.dot);
              });

              requestDatas(transformedData);
            } else {
              console.error("jsonData is undefined or empty");
            }
          } else {
            console.error("workbook.SheetNames is undefined or empty");
          }
        } catch (error) {
          console.error("Error parsing Excel file:", error);
        }
      };

      reader.readAsBinaryString(file);
    }
  };

  const requestDatas = async (transformedData) => {
    try {
      const session = JSON.parse(sessionStorage.getItem("user"));
      const recordId = "some_record_id"; // You need to define or generate this value

      // Iterate over transformedData and handle each row
      for (let i = 0; i < transformedData.length; i++) {
        const row = transformedData[i];

        const response = await axios.post(
          apiUrl,
          {
            crudtype: 1,
            userId: session[0].Value,
            recordid: recordId,
            collectionname: "income",
            data: {
              description: row.description,
              transactionType: row.transactionType,
              accountId: row.accountId,
              bankName: row.bankName,
              amount: row.amount,
              dot: row.dot,
            },
          },
          {
            Authorization: session.token,
          }
        );
        console.log("gichhi:", data.dot);

        if (response.data.status === "PASS") {
          console.log("Data saved Successfully");
          // Assuming fetchIncomeData is defined in your scope
          fetchIncomeData();
        } else {
          console.log("Failed to save data", response.data.message);
        }
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      // Clear any necessary state after processing
      setPage(null);
      setincomeTitle("");
      setTransactionType("");
      setBankName("");
      setAddress("");
      setAmount("");
      setDate("");
    }
  };

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
    const tableColumn = [
      "Transaction Type",
      "Account ID",
      "Bank Name",
      "Description",
      "Amount",
      "Date",
    ];
    const tableRows = [];

    flattenedData.forEach((item) => {
      const { transactionType, accountId, bankName, description, amount, dot } =
        item;
      const rowData = [
        transactionType,
        accountId,
        bankName,
        description,
        amount,
        new Date(dot).toLocaleDateString(),
      ];
      tableRows.push(rowData);
    });
    const handleSaves = async (e) => {
      e.preventDefault();

      try {
        // File upload logic
        let recordId = uuid();
        let fileUploadResponse = null;
        const { data: bankAccountsData } = await axios.get({ apiUrl }); // Adjust the API endpoint accordingly

        // Assuming bankAccountsData is an array of accounts
        const bankAccounts = bankAccountsData;

        if (!editMode) {
          let foundAccount = null;

          // ... (existing code)

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

          if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile);

            // Adjust the endpoint to match your backend API for file upload
            const fileUploadEndpoint = { apiUrl };
            const fileUploadConfig = {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            };

            fileUploadResponse = await axios.post(
              fileUploadEndpoint,
              formData,
              fileUploadConfig
            );

            // Provide feedback to the user upon successful file upload
            console.log("File uploaded successfully");
          }

          // Your existing logic for saving data
          const requestData = await axios.post(
            apiUrl,
            {
              crudtype: 1,
              userId: session[0].Value,
              recordid: recordId,
              collectionname: "income",
              data: {
                description: incomeTitle,
                transactionType: transactionType,
                accountId: foundAccount.accountId,
                bankName: bankName,
                amount: amount,
                dot: new Date(date).toISOString().split("T")[0],
              },
            },
            {
              headers: {
                Authorization: session.token,
              },
            }
          );

          if (requestData.data.status === "PASS") {
            console.log("Data saved successfully");

            fetchIncomeData();
          } else {
            console.log("Failed to save data", requestData.data.message);
          }

          // Access file upload response if needed
          if (fileUploadResponse) {
            console.log("File Upload Response:", fileUploadResponse.data);
          }
        }
      } catch (error) {
        console.error("Error during save:", error.message);
      } finally {
        // Clear the selected file after processing
        setSelectedFile(null);
        setincomeTitle("");
        setTransactionType("");
        setBankName("");
        setAddress("");
        setAmount("");
        setDate("");
      }
    };

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("accountDetails.pdf");
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
    setTransactionType(editRecord.transactionType);
    setincomeTitle(editRecord.description);
    setBankId(editRecord.accountId);
    setBankName(editRecord.bankName);
    setAddress(editRecord.address);
    setAmount(editRecord.amount);
    setDate(editRecord.dot);
    setEditMode(true);
    setEditRecordId(recordId);
  };
  const handleCancelEdit = () => {
    setTransactionType("");
    setBankId("");
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
            transactionType: transactionType,
            description: incomeTitle,
            accountId: bankid,
            amount: amount,
            bankName: bankName,
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
              transactionType: transactionType,
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
        console.log("amount is :", amount);
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
    setTransactionType("");
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
  const filteredData = flattenedData.filter((detail) => {
    const incTypeMatch =
      incTypeFilter === "" || detail.transactionType === incTypeFilter;
    const incTitleMatch =
      incTitleFilter === "" || detail.description.includes(incTitleFilter);
    const accountNoMatch =
      accountNoFilter === "" || detail.accountId.includes(accountNoFilter);
    const bankNameMatch =
      bankNameFilter === "" || detail.bankName.includes(bankNameFilter);
    const amountMatch =
      amountFilter === "" || detail.amount.includes(amountFilter);
    const dateMatch =
      dateFilter === "" ||
      new Date(detail.dot).toISOString().split("T")[0] === dateFilter;

    return (
      incTypeMatch &&
      incTitleMatch &&
      accountNoMatch &&
      bankNameMatch &&
      amountMatch &&
      dateMatch
    );
  });

  return (
    <div className={IncomeCSS.page_container}>
      <div className={IncomeCSS.container}>
        <div className={IncomeCSS.form_container}>
          <h2>{editMode ? "Edit Income Details" : "Income Details"}</h2>
          <div className={IncomeCSS.form_group}>
            <label className={IncomeCSS.label2} htmlFor="incomeTitle">
              Income Title
            </label>
            <input
              type="text"
              id="incomeTitle"
              placeholder="Enter Income Title"
              value={incomeTitle}
              style={{ width: "80%", height: "80%" }}
              onChange={(e) => setincomeTitle(e.target.value)}
            />
          </div>
          <div className={IncomeCSS.form_group}>
            <label htmlFor="transactionType">Income Type</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Rent">Rent</option>
              <option value="Salary">Salary</option>
              <option value="Interest">Interest</option>
              <option value="Profit">Profit</option>
              <option value="Others">Others</option>
            </select>
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
          <div className={IncomeCSS.form_group1}>
            <Link to="/Incomerecords" className={IncomeCSS.btn_2}>
              Income Records
            </Link>
            <label className={IncomeCSS.label2} htmlFor="file"></label>
            <input
              type="file"
              tabIndex={"Upload File"}
              id="file"
              accept=".xlsm"
              className={IncomeCSS.import}
              onChange={handleFileChange}
            />

            <button onClick={generatePDF} className={IncomeCSS.pdfbutton}>
              Export to PDF
            </button>
          </div>
          <div>
            <div className={IncomeCSS.custom_filters}>
              <div
                className={`${IncomeCSS.form_group3}${IncomeCSS.inline_filter}`}
              >
                <select
                  className={IncomeCSS.select_filter}
                  value={incTypeFilter}
                  onChange={(e) => setIncTypeFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Rent">Rent</option>
                  <option value="Salary">Salary</option>
                  <option value="Interest">Interest</option>
                  <option value="Profit">Profit</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div
                className={`${IncomeCSS.form_group} ${IncomeCSS.inline_filter}`}
              >
                <input
                  type="text"
                  placeholder="IncTitle"
                  value={incTitleFilter}
                  onChange={(e) => setIncTitleFilter(e.target.value)}
                />
              </div>
              <div
                className={`${IncomeCSS.form_group} ${IncomeCSS.inline_filter}`}
              >
                <input
                  type="text"
                  placeholder="Acc No"
                  value={accountNoFilter}
                  onChange={(e) => setAccountNoFilter(e.target.value)}
                />
              </div>
              <div
                className={`${IncomeCSS.form_group} ${IncomeCSS.inline_filter}`}
              >
                <input
                  type="text"
                  placeholder="Bank Name"
                  value={bankNameFilter}
                  onChange={(e) => setBankNameFilter(e.target.value)}
                />
              </div>
              <div
                className={`${IncomeCSS.form_group} ${IncomeCSS.inline_filter}`}
              >
                <input
                  type="text"
                  placeholder="Amt"
                  value={amountFilter}
                  onChange={(e) => setAmountFilter(e.target.value)}
                />
              </div>
              <div
                className={`${IncomeCSS.form_group} ${IncomeCSS.inline_filter}`}
              >
                <input
                  type="date"
                  placeholder="Date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>

            <table className={IncomeCSS.table}>
              <thead>
                <tr>
                  <th>Income Type</th>
                  <th>Income Title</th>
                  <th>Account No</th>
                  <th>Bank Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th> Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((detail, idx) => (
                    <tr key={idx} className="pagination-data">
                      <td className={IncomeCSS.td_1}>
                        {detail.transactionType}
                      </td>
                      <td className={IncomeCSS.td_1}>{detail.description}</td>
                      <td className={IncomeCSS.td_1}>{detail.accountId}</td>
                      <td className={IncomeCSS.td_1}>{detail.bankName}</td>
                      <td className={IncomeCSS.td_1}>{detail.amount}</td>
                      <td className={IncomeCSS.td_1}>
                        {new Date(detail.dot).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
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
              rowsPerPageOptions={[4, 6, 7, 8, 9]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormTable;
