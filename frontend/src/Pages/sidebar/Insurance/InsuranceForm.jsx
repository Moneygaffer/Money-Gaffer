import React, { useEffect, useState } from "react";
import axios from "axios";
import InsuranceCSS from "./Insurance.module.css";

const apiUrl = "https://pfmservices.azurewebsites.net/api/CRUD_irwb?";
const session = JSON.parse(sessionStorage.getItem("user"));
const userIdObj = session && session.Name === "_id" ? session : null;
const userId = userIdObj ? userIdObj.Value : null;

function InsuranceForm() {
  const [insuranceType, setInsuranceType] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [currentSlide, setCurrentSlide] = useState(1);
  const [formVisible,setFormVisible]=useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.post(apiUrl, {
        crudtype: 2,
        recordid: null,
        collectionname: "insurance_templates",
      });
      let temp = JSON.parse(
        response.data.data.replace(/ObjectId\("(\w+)"\)/g, '"$1"')
      );
      console.log("Templates:", response);
      console.log("the data:", temp);
      setTemplates(temp);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGetDetails = () => {
    const selected = templates.find(
      (template) => template.insurancetype === insuranceType
    );
    setSelectedTemplate(selected || null);
    setCurrentSlide(1);
    setFormVisible(true);
  };

  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const renderFields = () => {
    const fields = Object.entries(selectedTemplate.fields)
      .filter(([key]) => !key.startsWith("*"))
      .slice((currentSlide - 1) * 8, currentSlide * 8);

    return fields.map(([key, _], index) => (
      <div key={key} className={InsuranceCSS.form_field}>
        <label htmlFor={key} className={InsuranceCSS.form_label}>
          {key}
        </label>
        <input
          type="text"
          id={key}
          name={key}
          value={formValues[key] || ""}
          onChange={(e) => handleInputChange(key, e.target.value)}
          className={InsuranceCSS.form_input}
        />
      </div>
    ));
  };

  const isLastSlide =
    selectedTemplate &&
    currentSlide ===
      Math.ceil(
        Object.entries(selectedTemplate.fields || {}).filter(
          ([key]) => !key.startsWith("*")
        ).length / 8
      );

  const handleNextSlide = (e) => {
    e.preventDefault();
    const totalSlides = Math.ceil(
      Object.entries(selectedTemplate.fields).filter(
        ([key]) => !key.startsWith("*")
      ).length / 8
    );

    console.log("Current Slide:", currentSlide);
    console.log("Total Slides:", totalSlides);

    if (currentSlide < totalSlides) {
      setCurrentSlide((prevSlide) => {
        console.log("Previous Slide:", prevSlide);
        return prevSlide + 1;
      });
    }
  };

  const handlePrevSlide = (e) => {
    e.preventDefault();
    if (currentSlide > 1) {
      setCurrentSlide((prevSlide) => prevSlide - 1);
    }
  };
  const handleSave=async (e)=>{
    e.preventDefault();
    try{
      const requestData=await axios.post(apiUrl,{
        crudtype:1,
        userId:session[0].Value,
        recordid:null,
        collectionname:"allinsurances",
        data: {
          insuranceType: selectedTemplate.insurancetype, 
          ...formValues, 
        },
      },{
        Authorization:session.token,
      });
      console.log("Saved Data:",requestData)
      console.log("insurance data:",requestData.data);
      setFormValues({});
     
    }
    catch(error){
      console.log("Error", error)
    }


  }
  return (
    <div className={InsuranceCSS.first_div}>
      <div
        className={InsuranceCSS.main_div}
        style={{ display: "flex", alignItems: "center" }}
      >
        <label
          className={InsuranceCSS.form_label}
          htmlFor="insuranceType"
          style={{ marginLeft: "200px", fontSize: "20px" }}
        >
          Enter Insurance Type
        </label>
        <input
          style={{ marginTop: "20px", marginLeft: "20px" }}
          type="text"
          id="insuranceType"
          placeholder="Enter Insurance Type"
          value={insuranceType}
          onChange={(e) => setInsuranceType(e.target.value)}
          className={InsuranceCSS.form_input1}
        />
        <button
          onClick={handleGetDetails}
          style={{ marginLeft: "20px", height: "40px", marginTop: "4px" }}
        >
          Click Here
        </button>
      </div>
      {formVisible && (  
        <form className={InsuranceCSS.ins_form}>
          {selectedTemplate !== null && (
            <div>
              <h2 className={InsuranceCSS.form_heading}>
                Enter Details for {selectedTemplate.insurancetype}:
              </h2>
              <div className={InsuranceCSS.form_fields}>{renderFields()}</div>
              <div className={InsuranceCSS.pagination}>
                <button
                  className={InsuranceCSS.ins_prevbtn}
                  onClick={handlePrevSlide}
                >
                  Previous
                </button>
                <span
                  className={InsuranceCSS.ins_cursld}
                >{`Slide ${currentSlide}`}</span>
                <button
                  className={InsuranceCSS.ins_nextbtn}
                  onClick={handleNextSlide}
                >
                  Next
                </button>
                {isLastSlide && (
                  <button
                    className={InsuranceCSS.ins_savebtn}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default InsuranceForm;