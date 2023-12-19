import React, { useState, useEffect } from 'react'
import toDoShape from './todo.js'

const Form = ({ toDoID }) => {
  // this is grabbing the initial shape I made in the task.js file as the default shape for our toDo task, I used the spread operator to make sure it was making a clone that is mutable rather than it editing a shallow copy of the original object.
  const [toDo, setToDo] = useState({ ...toDoShape })
  const [toDoList, setToDoList] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  // have a useeffect to grab the stored toDos 
  useEffect(() => {
    const storedToDos = JSON.parse(localStorage.getItem('toDoList')) || []
    setToDoList(storedToDos)
  }, [])

  // have this useEffect to fire off when the toDo list changes, so we get an updated list in our local storage.
  useEffect(() => {
    localStorage.setItem('toDoList', JSON.stringify(toDoList))
  }, [toDoList])

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limit character count for description to 250 characters
    if (name === 'description' && value.length > 250) {
      return;
    }

    // For select elements, get the selected value
    const selectedValue =
      e.target.type === 'select-one'
        ? e.target.options[e.target.selectedIndex].value
        : value;

    setToDo((prevToDo) => ({ ...prevToDo, [name]: selectedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault()

    //trying to check if the task name exists in the inputs, if they aren't completed, set an error and return out of the function 
    if (!toDo.name || !toDo.description || !toDo.dueDate || !toDo.assignedMember) {
      setErrorMessage('Please fill in all the fields to create this task')
      return
    }
    // check if the todo already exists through the ID we pass into the component
    if (toDoID) {
      const updatedTodoList = toDoList.map((task) => {
        return task.id === toDoID ? toDo : task
      })
      setToDoList(updatedTodoList)
    } else { // add a new task if it doesn't exist already, using the date as an ID.
      const newToDo = { ...toDo, id: Date.now() }
      setToDoList((prevToDoList) => [...prevToDoList, newToDo])
    }
    // reset the todo after submitting the current one, as well as resetting the error.
    setToDo({ ...toDoShape })
    setErrorMessage('')

  }

  // take the ID and remove using filter to remove only that task.
  const handleRemove = (toDoID) => {
    const updatedToDoList = toDoList.filter((task) => task.id !== toDoID)
    setToDoList(updatedToDoList)
  }

  // take the status and update it with the new one, or just leave it.
  const handleToDoStatusChange = (toDoID, newToDoStatus) => {
    const updatedToDoList = toDoList.map((task) => {
      return task.id === toDoID ? { ...task, status: newToDoStatus } : task
    })
    setToDoList(updatedToDoList)
  }

  // render the list 
  const renderToDoList = () => {
    const sortedToDoList = toDoList.sort((a, b) => a.status.localeCompare(b.status))

    return sortedToDoList.map((task) =>
      <div className="todo-container">
        <h2 className="todo-name">{task.name}</h2>
        <h2 className="todo-description">{task.description}</h2>
        <h2 className="todo-dueDate">{task.dueDate}</h2>
        <h2 className="todo-assignedMember">{task.assignedMember}</h2>
        <h2 className="todo-status">{task.status}</h2>
        <button className="in-progress" onClick={() => handleToDoStatusChange(task.id, 'in-progress')}>In progress</button>
        <button className="completed" onClick={() => handleToDoStatusChange(task.id, 'completed')}>Completed</button>
        <button className="review" onClick={() => handleToDoStatusChange(task.id, 'review')}>In Review</button>
        <button className="remove" onClick={() => handleRemove(task.id)}>Remove todo</button>
        <button className="edit">Edit task</button>
      </div>
    )
  }


  return (
    <>
      <form onSubmit={handleSubmit} id="todo-form">
        <label for="name">Todo name: </label>
        <input type="text" name="name" value={toDo.name} onChange={handleChange} required />
        <br />


        <label for="description">Todo description: </label>
        <input type="text" name='description' maxLength="250" value={toDo.description} onChange={handleChange} required />
        <br />

        <label for="dueDate">Todo due date: </label>
        <input type="date" name='dueDate' value={toDo.dueDate} onChange={handleChange} required />
        <br />

        <label for="assignedMember">Todo assignmed member: </label>
        <select name="assignedMember" value={toDo.assignedMember} onChange={handleChange} required>
          <option value="Hugh">Hugh</option>
          <option value="Praseen">Praseen</option>
          <option value="Sylvia">Sylvia</option>
          <option value="Tracey">Tracey</option>
          <option value="Liam">Liam</option>
        </select>
        <br />

        <label for="status">Todo status:</label>
        <select name="status" value={toDo.status} onChange={handleChange} required>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="review">Up for Review</option>
        </select>

        <button type="submit">{toDoID ? 'Edit ToDo' : 'Add ToDo'}</button>
      </form>

      {errorMessage && <section>!!!!{errorMessage}!!!!</section>}


      <div className="toDo-list">
        <h1>Todo: </h1>
        {toDoList.length > 0 ? renderToDoList() : <h3>No tasks yet, try adding some!</h3>}
      </div>
    </>
  )

}

export default Form
