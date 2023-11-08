import React, { useState } from 'react';
import DetailsCSS from './Details.module.css';

function Details() {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    'Bank Accounts',
    'Income',
    'Expense',
    'Savings',
    'Loans',
    'Insurance',
  ];

  const dropdownOptions = {
    'Bank Accounts': ['SBI', 'HDFC', 'ICICI', 'BOI'],
    'Income': [
      'Total Income:  {}',
      
    ],
    'Expense': [
      'Total Expense: {}',
      
    ],
    'Savings': ['Total Savings:{ }','saving Sources:{ }'],
    'Loans': ['Total Loan: { }', 'Types of Loans : { }'],
    'Insurance': ['Total Insurance: {}', 'Insurance Types: {}'],
  };

  const handleOptionClick = (option) => {
    if (selectedOption === option) {
      setSelectedOption(null);
    } else {
      setSelectedOption(option);
    }
  };

  return (
    <div className={DetailsCSS.containers}>
  <div className={DetailsCSS.options_box}>
    {options.map((option, index) => (
      <div
        key={index}
        className={`${DetailsCSS.option} ${selectedOption === option ? 'active' : ''}`}
        onClick={() => handleOptionClick(option)}
      >
        {option}
      </div>
    ))}
  </div>
  <div className={DetailsCSS.dropdowns}>
    {selectedOption && dropdownOptions[selectedOption].length > 0 && (
      <ul>
        {dropdownOptions[selectedOption].map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    )}
  </div>
</div>
  )};


export default Details;