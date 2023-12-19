// api logic to go heare
import React, { useState, useEffect } from 'react';
//TypeQuote is functional component
const TypeQuote = () => {
  const [quote, setQuote] = useState([]);
  // handleClick is a function that will called when cliked on the button 
  const handleClick = ()=>{
    //fetchQuote is a async function to fetch api hadling error when not rendering data
    const fetchQuote = async () => {
      try {
        const response = await fetch( 'https://type.fit/api/quotes/');
        const data = await response.json();
          //response.ok will check wether data is loaded or not from api
        if (response.ok) {
          const randomQuoteIndex = Math.floor(Math.random() * data.length)
          const randomQuote = data[randomQuoteIndex]
          randomQuote.author = randomQuote.author.split(',')[0]
           setQuote(randomQuote)
           } else {
          console.error('Error fetching quote:', data.error || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching quote:', error.message);
      }
    };

    fetchQuote(); // calling the function
  };
  // we are using useeffect to render the data and close once we are not using application
  useEffect(()=>{handleClick()},[]); 
  // The return block will display the results to the DOM
  return (
    <div>
      <h2>Quote of the day</h2>
      <p>{quote.text}</p>
      <p>{quote.author}</p>
      <div><button onClick={handleClick}>Qoute</button></div>
    </div>
  );
};

export default TypeQuote;
