import React from "react";
import  TutorialsCSS from "./Tutorials.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

const apiUrl = "https://omnireports.azurewebsites.net/api/CRUD_irwb?";
function Tutorials() {
  const item = {
    "Term Insurance": "Term Insurance",
    "Motor Insurance": "Motor Insurance",
    "Health Insurance": "Health Insurance",
    "Critical Insurance": "Critical Insurance",
    "Whole Life Insurance": "Whole Life Insurance",
    "Group Life Insurance": "Group Life Insurance",
    "Property Insurance": "Property Insurance",
    "Unit Linked Insurance": "Unit Linked Insurance",
    "Child Plan Insurance": "Child Plan Insurance",
  };

  const [data, setData] = useState([]);
  const [activeSection, setActiveSection] = useState("insurance");
  const [activeDescription, setActiveDiscription] = useState("");
  const fetchData = async () => {
    try {
      const response = await axios.post(apiUrl, {
        crudtype: 2,
        recordid: null,
        collectionname: "tutorial",
      });
      let temp = JSON.parse(
        response.data.data.replace(/ObjectId\("(\w+)"\)/g, '"$1"')
      );
      setData(temp);
      console.log(data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    if (activeSection === "insurance") {
      return item.topic === "insurance";
    } else if (activeSection === "deposit") {
      return item.topic === "Deposit Accounts";
    }
    return false;
  });
  return (
    <div className={TutorialsCSS.tutorial_container}>
      <div className={TutorialsCSS.tutorial_button}>
        <button  className={TutorialsCSS.button}onClick={() => setActiveSection("insurance")}>Insurance</button>
        <button  className={TutorialsCSS.button}onClick={() => setActiveSection("deposit")}>
          Deposit Accounts
        </button>
      </div>

      <div className={TutorialsCSS.tutorial_cards_info}>
        {filteredData.map((item, index) => (
          <div key={index} className="card-box">
            <h2>{item.topic}</h2>
            {item.details.map((detail, i) => (
              <div key={i} className={TutorialsCSS.card_topic}>
                <h3
                  onClick={() => setActiveDiscription(detail.topic)}
                  className={TutorialsCSS.card_topic_button}
                >
                  {detail.topic}
                </h3>

                {activeDescription === detail.topic && (
                  <p className={TutorialsCSS.tutorial_card_description}>
                    {detail.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tutorials;
