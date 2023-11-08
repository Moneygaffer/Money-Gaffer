import React, { useState } from 'react';
import cardsCSS from './Cards.module.css';

const StyledBox = ({ visible }) => {
  return(
  <div className={cardsCSS.styled_box_container}> 
  {visible && (
    <div className={cardsCSS.styled_box}>
      {/* Add your advanced styling here */}
    </div>
  ) 
}
</div>);
};

const Cards = () => {
  const [activeCard, setActiveCard] = useState(null);

  const handleClick = (index) => {
    setActiveCard((prevActiveCard) => (prevActiveCard === index ? null : index));
  };

  return (
    <div>
      <StyledBox visible={activeCard !== null} />

      <div className={cardsCSS.card_container}>
        <div
          className={cardsCSS.cardss}
          onClick={() => handleClick(0)}
          style={{ cursor: 'pointer' }}>
          <h2 className={cardsCSS.h2}>Monthly Income</h2>
          <p className={cardsCSS.p}>
            <b>₹{40000}</b>
          </p>
        </div>
        <div
          className={cardsCSS.cardss}
          onClick={() => handleClick(1)}
          style={{ cursor: 'pointer' }}
        >
          <h2 className={cardsCSS.h2}>Monthly Expenses</h2>
          <p className={cardsCSS.p}>
            <b>₹{300000}</b>
          </p>
        </div>
        <div
          className={cardsCSS.cardss}
          onClick={() => handleClick(2)}
          style={{ cursor: 'pointer' }}
        >
          <h2 className={cardsCSS.h2}>Monthly Savings</h2>
          <p className={cardsCSS.p}>
            <b>₹{8000}</b>
          </p>
        </div>
        <div
          className={cardsCSS.cardss}
          onClick={() => handleClick(3)}
          style={{ cursor: 'pointer' }}
        >
          <h2 className={cardsCSS.h2}>Net Worth</h2>
          <p className={cardsCSS.p}>
            <b>₹{8000}</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cards;