import React, { useState, useEffect } from "react";
import TutorialsCSS from "./Tutorials.module.css";
import axios from "axios";

const apiUrl = "https://pfmservices.azurewebsites.net/api/CRUD_irwb?";

function Tutorials() {
  const [data, setData] = useState([]);
  const [activeSection, setActiveSection] = useState("insurance");
  const [activeDescription, setActiveDescription] = useState("");
  const [fileInfo, setFileInfo] = useState([]);

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
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const fetchFileData = async () => {
    try {
      const response = await axios.post(apiUrl, {
        crudtype: 2,
        recordid: null,
        collectionname: "fs.files",
      });
      let temp = JSON.parse(
        response.data.data.replace(/ObjectId\("(\w+)"\)/g, '"$1"')
      );
      setFileInfo(temp);
      console.log("videos :",temp);
      console.log("video response:",response)
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchFileData();
  }, []);
  
  

  const filteredData = data.filter((item) => {
    if (activeSection === "insurance") {
      return item.topic === "insurance";
    } else if (activeSection === "deposit") {
      return item.topic === "Deposit Accounts";
    }
    return false;
  });

  const handleButtonClick = async () => {
    // Fetch file data when the button is clicked
    await fetchFileData();
  };

  return (
    <div className={TutorialsCSS.tutorial_container}>
      <div className={TutorialsCSS.tutorial_button}>
        <button
          className={TutorialsCSS.button}
          onClick={() => setActiveSection("insurance")}
        >
          Insurance
        </button>
        <button
          className={TutorialsCSS.button}
          onClick={() => setActiveSection("deposit")}
        >
          Deposit Accounts
        </button>
      </div>

      <div className={TutorialsCSS.tutorial_cards_info}>
        {filteredData.map((item, index) => (
          <div key={index} className="card-box">
            <h2>{item.topic}</h2>
            {item.details.map((detail, i) => (
              <div key={i} className={TutorialsCSS.card_topic}>
                <button
                  className={TutorialsCSS.video}
                  onClick={handleButtonClick}
                >
                  Click Here
                </button>

                <h3
                  onClick={() => setActiveDescription(detail.topic)}
                  className={TutorialsCSS.card_topic_button}
                >
                  {detail.topic}
                </h3>

                {activeDescription === detail.topic && (
                  <p className={TutorialsCSS.tutorial_card_description}>
                    {detail.description}
                  </p>
                )}

                {/* Display file information
                {fileInfo && (
                  <div className={TutorialsCSS.file_info}>
                    <p>File Information:</p>
                    <pre>{JSON.stringify(fileInfo, null, 2)}</pre>
                  </div>
                )} */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tutorials;
