import React, { useState, useEffect ,useRef} from "react";
import axios from "axios";
import IncomerecordCSS from "./Incomerecords.module.css";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const apiUrl = "https://pfmservices.azurewebsites.net/api/CRUD_irwb?";

const Incomerecords = () => {
  const [accountDetails, setAccountDetails] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactionType,setTransactionType]=useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [rowPage, setRowPage] = useState(5);
  const session = JSON.parse(sessionStorage.getItem("user"));
  let sum = 0;

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

  useEffect(() => {
    console.log("filtered data", filteredRecords);
    setAccountDetails(filteredRecords);
    
  }, [filteredRecords]);
  
  //for pdf
  
    // const pdfRef = useRef();
  
    const generatePDF = () => {
      const doc = new jsPDF();
      const tableColumn = [ 'Income Type','Account ID', 'Description', 'Amount', 'Date'];
      const tableRows = [];
    
      {filteredRecords &&
        filteredRecords.map((item, index) =>
          item.accountDetails.map((detail, idx) => {
            const dotDate = new Date(detail.dot);
            const isWithinDateRange =
              dotDate >= new Date(startDate) && dotDate <= new Date(endDate);
            const hasMatchingTitle = detail.transactionType === transactionType;
      
            if (isWithinDateRange && (transactionType === '' || hasMatchingTitle)) {
              const { transactionType, accountId, description, amount, dot } = detail;
              const rowData = [
                transactionType,
                accountId,
                description,
                amount,
                new Date(dot).toLocaleDateString(),
              ];
              tableRows.push(rowData);
            }
          })
        )}
      
    
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
      });
    
      doc.save('accountDetails.pdf');
    };
    
    

  const handleRetrieveDetails = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        apiUrl,
        {
          crudtype: 2,
          recordid: null,
          collectionname: "income",
          userId: session[0].Value,
        },
        { Authorization: session.token }
      );

      const incomeData = parseData(data.data);

      const filteredData = incomeData;

      setFilteredRecords(filteredData);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const moreinfo = () => {
    setRowPage(rowPage + 2);
  };

  return (
    <div className={IncomerecordCSS.page_container}>
      <div className={IncomerecordCSS.container}>
        <div className={IncomerecordCSS.form_container}>
          <h2>Income Records</h2>
          
          <form>
            <div className={IncomerecordCSS.form_group}>
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className={IncomerecordCSS.form_group}>
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className={IncomerecordCSS.form_group}>
              <label htmlFor="transactionType">Income Type</label>
              <select value={transactionType}
              onChange={(e)=>setTransactionType(e.target.value)}>
                <option value="">Select</option>
                <option value="Rent">Rent</option>
           <option value="Salary">Salary</option>
           <option value="Interest">Interest</option>
           <option value="Profit">Profit</option>
           <option value="Others">Others</option>
           </select>
            </div>
            <div className={IncomerecordCSS.form_group}>
              <button
                className={IncomerecordCSS.btn_retrieve}
                onClick={handleRetrieveDetails}
              >
                Retrieve Details
              </button>
            </div>
            <h3 className={IncomerecordCSS.footer}>
              {" "}
              Click above to know how much you have Earned in the given time
              period{" "}
            </h3>
          </form>
        </div>
        <div className={IncomerecordCSS.table_container}>
          <div className={IncomerecordCSS.filtered_records}>
            <div className={IncomerecordCSS.filtered_record_heading}>
            <h3>Filtered Income Records</h3>
          <button onClick={generatePDF}  className={IncomerecordCSS.pdfbutton}>Export to PDF</button>
            </div>
   
            <table>
              <thead>
                <tr>
                  <th>Income Type</th>
                  <th>Income Title</th>
                  <th>Bank Account</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>

  {filteredRecords &&
    filteredRecords.map((item, index) =>
      item.accountDetails.map((detail, idx) => {
        const dotDate = new Date(detail.dot);
        const isWithinDateRange =
          dotDate >= new Date(startDate) && dotDate <= new Date(endDate);
        const hasMatchingTitle = detail.transactionType === transactionType;

        if (isWithinDateRange && (transactionType === '' || hasMatchingTitle)) {
          sum = sum + parseInt(detail.amount);

          return (
            <tr key={idx}>
              <td>{detail.transactionType}</td>
              <td>{detail.description}</td>
              <td>{detail.accountId}</td>
              <td>{detail.amount}</td>
              <td className={IncomerecordCSS.td_1}>
              {new Date(detail.dot).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </td>
            </tr>
          );
        } else {
          return null; 
        }
      })
    )}
  <tr>
    <td colSpan="3">Total:</td>
    <td>{sum}</td>
  </tr>
</tbody>

            </table>
            <button className={IncomerecordCSS.btn_info} onClick={moreinfo}>
              More info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Incomerecords;
