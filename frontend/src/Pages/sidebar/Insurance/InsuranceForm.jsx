import React from 'react';
import "./InsuranceForm.css";

const InsuranceForm = ({ type, fields, handleChange, handleSubmit,handleClose }) => {
  const half = Math.ceil(fields.length / 2); 
  const leftFields = fields.slice(0, half); 
  const rightFields = fields.slice(half); 
  const handleBackButtononClick = () => {
    handleClose(); 
  };
  return (
    <div className="form-container1" style={{ width: '1075px' ,marginLeft:'310px', height:'640px', marginTop:'10px'}}>
      <h2>{`Policy Details - ${type}`}</h2>
      <div className="form-sections">
        <div className="form-section">
          {leftFields.map((field) => (
            <div className="form-group1" key={field.id}>
              <label htmlFor={field.id}>{field.label}</label>
              <input
                type={field.type}
                id={field.id}
                value={field.value}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="form-section">
          {rightFields.map((field) => (
            <div className="form-group1" key={field.id}>
              <label htmlFor={field.id}>{field.label}</label>
              <input
                type={field.type}
                id={field.id}
                value={field.value}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="form-group1">
        <button className="button" type="submit" onClick={handleSubmit}>
          Submit
        </button>
        <button className="button" onClick={handleBackButtononClick}>
          Close
        </button>
      </div>
    </div>
    
  );
};

export default InsuranceForm;
