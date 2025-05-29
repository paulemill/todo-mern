import { useState, useEffect } from 'react';
import axios from '../axios';

function ToDo() {
  const [todos, setTodos] = useState([]);

  // State to manage the input value for adding new todos
  const [inputValue, setInputValue] = useState('');

  // State to manage the editing mode
  const [editingId, setEditingId] = useState(null); // currently editing todo ID
  const [editText, setEditText] = useState(''); // editable text

  //////////////////////////////////////////////////////////////
  // Fetch Data from MongoDB
  //////////////////////////////////////////////////////////////
  const fetchData = async () => {
    try {
      const response = await axios.get('/todos');
      setTodos(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  //////////////////////////////////////////////////////////////
  // CRUD Operations - Create To Do
  //////////////////////////////////////////////////////////////
  const addToDo = async (text) => {
    try {
      const response = await axios.post('/todos', { text }); // send to MongoDB
      setTodos((prev) => [response.data, ...prev]); // update local state
    } catch (error) {
      console.log(error.message);
    }
  };

  //////////////////////////////////////////////////////////////
  // CRUD Operations - Patch completed status
  //////////////////////////////////////////////////////////////
  const toggleTodo = async (id, currentCompletedStatus) => {
    try {
      const updatedCompletedStatus = !currentCompletedStatus; //
      await axios.patch(`/todos/${id}/toggle`, {
        completed: updatedCompletedStatus, // send completed status to MongoDB
      });
      fetchData(); // Fetch updated data after toggling
    } catch (error) {
      console.log(error.message);
    }
  };

  //////////////////////////////////////////////////////////////
  // CRUD Operations - Delete To Do
  //////////////////////////////////////////////////////////////
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/todos/${id}`); // delete from MongoDB
      setTodos((prev) => prev.filter((todo) => todo._id !== id)); // Remove deleted todo from local state
      fetchData(); // Fetch updated data after deletion
    } catch (error) {
      console.log(error.message);
    }
  };

  //////////////////////////////////////////////////////////////
  // CRUD Operations - Patch / Edit To Do
  //////////////////////////////////////////////////////////////
  const editTodo = async (id, newText) => {
    try {
      await axios.patch(`/todos/${id}`, { text: newText }); // update text in MongoDB
      fetchData(); // Fetch updated data after editing
    } catch (error) {
      console.log(error.message);
    }
  };

  //////////////////////////////////////////////////////////////
  // HANDLING CHANGES
  //////////////////////////////////////////////////////////////

  // Handling input changes
  const handleInputChange = (event) => {
    setInputValue(event.target.value); // Update input value
  };

  // Handling Add button click and form submission
  const handleAddClick = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') {
      alert('Please enter a todo');
      return;
    }

    await addToDo(inputValue);
    setInputValue(''); // Reset input after adding
  };

  console.log('Todos:', todos);

  return (
    <>
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 mt-15">
        📝 Your Todo List
      </h2>

      {/* Form for adding a new todo */}
      <div className="w-full max-w-lg mx-auto mb-8">
        <form
          className="flex items-center bg-white shadow-md rounded-lg p-4"
          onSubmit={handleAddClick}
        >
          <input
            type="text"
            placeholder="Add a new task..."
            value={inputValue}
            onChange={handleInputChange}
            className="flex-grow border-2 border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          />
          <button
            type="submit"
            className="ml-4 px-6 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-all duration-200"
          >
            Add
          </button>
        </form>
      </div>

      {/* Todo list */}
      <ul className="space-y-4 mt-6 px-6 max-w-lg mx-auto">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className={`flex items-center justify-between shadow-xl rounded-xl px-6 py-4 transition-all duration-300 ease-in-out ${
              todo.completed
                ? 'bg-green-100 line-through text-gray-500'
                : 'bg-white'
            }`}
          >
            <div className="flex items-center space-x-4">
              {/* Checkbox to toggle completion status */}
              <input
                type="checkbox"
                className="w-6 h-6 accent-indigo-500 cursor-pointer"
                checked={todo.completed}
                onChange={() => toggleTodo(todo._id, todo.completed)}
              />

              {/* Edit To Do */}
              {/* If editingId matches todo._id, show input field for editing */}
              {/* Otherwise, show the todo text */}
              {editingId === todo._id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={async () => {
                    if (editText.trim() && editText !== todo.text) {
                      await editTodo(todo._id, editText); // WAIT before exiting
                    }
                    setEditingId(null); // Exit editing mode
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      if (editText.trim() && editText !== todo.text) {
                        await editTodo(todo._id, editText); // WAIT before exiting
                      }
                      setEditingId(null); // Exit editing mode
                    } else if (e.key === 'Escape') {
                      setEditingId(null); // Cancel editing
                    }
                  }}
                  className="border rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
                  autoFocus
                />
              ) : (
                <span
                  className={`text-lg ${
                    todo.completed
                      ? 'line-through text-gray-500'
                      : 'text-gray-800'
                  }`}
                >
                  {todo.text}
                </span>
              )}
            </div>

            {/* Edit and Delete buttons */}
            <div className="flex space-x-6 text-2xl">
              <button
                className="hover:text-indigo-500 transition-all cursor-pointer"
                title="Edit"
                onClick={() => {
                  setEditingId(todo._id); // set currently editing ID
                  setEditText(todo.text); // prefill input with current todo text
                }}
              >
                ✏️
              </button>
              <button
                className="hover:text-red-500 transition-all cursor-pointer"
                title="Delete"
                onClick={() => deleteTodo(todo._id)}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ToDo;
