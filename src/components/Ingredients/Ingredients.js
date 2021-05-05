import React, {useReducer,useCallback} from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredients, action) =>{
  switch(action.type){
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients,action.ingredients];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error ('Should not get there!');
  }
}

const httpReducer = (currentHttp, action) => {
  switch(action.type){
    case 'SEND':
      return { isloading: true, error: null}
    case 'RESPOSE':
      return { ...currentHttp, isloading: false}
    case 'ERROR':
      return { isloading: false, error: action.ErrorMessage}
    case 'CLEAR':
      return { isloading: false, error: null}
    default :
     throw new Error (`should not get there! `);
  }
  
}
function Ingredients() {
  const [userIngredients,dispatch] = useReducer(ingredientReducer,[])
  //const [userIngredients,setUserIngredients] = useState([]);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {isloading: false , error: null})
  // const [isLoading,setIsLoading] = useState('');
  // const [error,setError] = useState('');
  // useEffect(() => {
  //   fetch("https://hooks-010-default-rtdb.firebaseio.com/ingredients.json")
  //   .then(response => response.json())
  //   .then(responseData => {
  //     const loadedIngredients = [];
  //     for (const key in responseData) {
  //       loadedIngredients.push({
  //         id:key,
  //         title: responseData[key].title,
  //         amont: responseData[key].amount
  //       })
  //     }
  //     setUserIngredients(loadedIngredients);
  //   });
  // }, []);

  const onFilterHandler = useCallback((filteredIngredients) => {
      // setUserIngredients(filteredIngredients)
      dispatch({
        type: 'SET',
        ingredients: filteredIngredients
      });
     // console.log(filteredIngredients)
  },[]);

  const addIngredientHandler = (ingredient) => {
    // setIsLoading(true);
    dispatchHttp({
      type: 'SEND'
    })
    fetch('https://hooks-010-default-rtdb.firebaseio.com/ingredients.json',{
      method: 'POST',
      body: JSON.stringify(ingredient),
      header: {'Content-type' : 'application/json'}
    })
    .then ( response => {
      // setIsLoading(false);
      dispatchHttp({type: 'RESPONSE'})
      return response.json()
    })
    .then (responseData => {
      // setUserIngredients(prevIngredients => [...prevIngredients,
      //   {
      //     id: responseData.name, ...ingredient
      //   }])
      // }
      dispatch({
        type: 'ADD',
        ingredients: { id: responseData.name, ...ingredient }
      })
    }
    )
    .catch ( error => {
      // setError(error.message);
      dispatchHttp({
        type: 'ERROR',
        errorMessage: error.message
    })
    })
    
      
  }
  //console.log(userIngredients);
  
  const removeIngredientHandler = (ingredientId) => {
    dispatchHttp({
      type: 'SEND'
    })
    fetch(`https://hooks-010-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,{
      method: 'DELETE',
  })
  .then (response => {
    dispatchHttp({type: 'RESPONSE'})
    // setUserIngredients( prevIngredients => 
    // prevIngredients.filter(ing => ing.id !== ingredientId )
    dispatch({
      type: 'DELETE',
      id : ingredientId
    })
  }
).catch ( error => {
  dispatchHttp({
    type: 'ERROR',
  errorMessage: error.message})
})
  console.log(userIngredients);
  };

const clearError = () => {
  dispatchHttp({
    type: 'CLEAR'
  })
}
  return (
    <div className="App">

      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient= {addIngredientHandler} loading={httpState.isLoading} />

      <section>
        <Search onFilteredIngredients = {onFilterHandler}/>
        <IngredientList 
        ingredients={userIngredients} 
        onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
