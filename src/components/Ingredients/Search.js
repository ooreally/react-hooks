import React, {useState, useEffect,useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

  const { onFilteredIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect (() => {
    const timer = setTimeout(() => {
        if(enteredFilter === inputRef.current.value) {
          const query = enteredFilter.length === 0 
    ? ''
    : `?orderBy="title"&equalTo="${enteredFilter}"`;
    fetch("https://hooks-010-default-rtdb.firebaseio.com/ingredients.json"+ query)
    .then(response => response.json())
    .then(responseData => {
      const filteredIngredients = [];
      for (const key in responseData) {
        filteredIngredients.push({
          id:key,
          title: responseData[key].title,
          amount: responseData[key].amount
        })
      }
      onFilteredIngredients(filteredIngredients);
    });
    }
  },500);
    return () => {
      clearTimeout(timer);
    }
  }, [enteredFilter, onFilteredIngredients, inputRef]);


  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text"
          ref= {inputRef} 
          value= {enteredFilter}
          onChange= {event => setEnteredFilter(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
