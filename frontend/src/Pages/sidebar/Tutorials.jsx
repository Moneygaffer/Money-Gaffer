import React from 'react';
import TutorialsCSS from './Tutorials.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = 'https://omnireports.azurewebsites.net/api/CRUD_irwb?';
function Tutorials() {
  const [data, setData] = useState([]);
  const [activeSection, setActiveSection] = useState('insurance');
  const fetchData = async () => {
    try {
      const response = await axios.post(apiUrl, {
        crudtype: 2,
        recordid: null,
        collectionname: 'tutorial',
      });
      let temp = JSON.parse(response.data.data.replace(/ObjectId\("(\w+)"\)/g, '"$1"'));
      setData(temp);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    if (activeSection === 'insurance') {
      return item.topic === 'insurance';
    } else if (activeSection === 'deposit') {
      return item.topic === 'Deposit Accounts';
    }
    return false;
  });
  return (
    <div className={TutorialsCSS.horizontal_scroll_container}>
      <div className={TutorialsCSS.button_containertutorial}>
        <button onClick={() => setActiveSection('insurance')}>Insurance</button>
        <button onClick={() => setActiveSection('deposit')}>Deposit Accounts</button>
      </div>

      <div className={TutorialsCSS.card_container_horizontal}>
        {filteredData.map((item, index) => (
          <div key={index} className={TutorialsCSS.card_tutorial_horizontal}>
            <h2 className={TutorialsCSS.tutorial_heading}>{item.topic}</h2>
            {item.details.map((detail, i) => (
              <div key={i} className={TutorialsCSS.card_tutorial}>
                <h3>{detail.topic}</h3>
                <hr />
                <p>{detail.description}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tutorials;
