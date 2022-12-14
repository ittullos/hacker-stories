import * as React from 'react'

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1
  }
]

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STORIES':
      return action.payload;
    case 'REMOVE_STORY':
      return state.filter(
        (story) => action.payload.objectID !== story.objectID
); default:
      throw new Error();
  }
};

const getAsyncStories = () =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      2000
)
)

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  )

  React.useEffect(() => {
    localStorage.setItem(key, value)
  }, [value, key])

  return [value, setValue]
}

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'React'
  )
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    []
  )
  const [isLoading, setIsLoading] =React.useState(false)
  const [isError, setIsError] = React.useState(false)

  React.useEffect(() => {
    setIsLoading(true)

    getAsyncStories().then(result => {
      dispatchStories({
        type: 'SET_STORIES',
        payload: result.data.stories
      })
      setIsLoading(false)
    })
    .catch(() => setIsError(true))
  }, [])
  
  const handleRemoveStory = (item) => {  
    dispatchStories({
      type: 'SET_STORIES',
      payload: newStories
    })
  }

  const handleSearch = (event) => { 
    setSearchTerm(event.target.value)
  }

  const searchedStories = stories.filter((story) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div>
      <h1>My Hacker Stories</h1>
      
      <InputWithLabel 
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search: </strong>
      </InputWithLabel>

      <hr />

      {isError && <p>Something went wrong ...</p>}

      {isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List 
          list={searchedStories} 
          onRemoveItem={handleRemoveStory} 
        />
      )}
    </div>
  )
}




const List = ({ list, onRemoveItem }) => {
  return (
    <ul>
      {list.map((item) => (
        <Item 
          key={item.objectID} 
          item={item}
          onRemoveItem={onRemoveItem} 
        />
      ))}
    </ul> 
  )
}

const Item = ({ item, onRemoveItem }) => {
  const handleRemoveItem = () => {
   onRemoveItem(item) 
  }
  return (
    <li>
      <span>
        <a href={item.url}>{item.title} </a>
      </span>
      <span>{item.author} </span>
      <span>{item.num_comments} </span>
      <span>{item.points} </span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </li>
  )
}

const InputWithLabel = ({ 
  id, 
  label, 
  value, 
  type = 'text', 
  onInputChange,
  isFocused,
  children   
}) => {

  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  return (
    <>
      <label htmlFor={id}>{children}</label>
      {/* B */}
      <input ref={inputRef}
             id={id} 
             type={type} 
             value={value}
             autoFocus={isFocused}
             onChange={onInputChange}
      />
    </>
  )
}

export default App