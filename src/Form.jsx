import React, { useState, useEffect } from 'react'
import toDoShape from './todo.js'

const Form = () => {
  const [toDo, setToDo] = useState({ ...toDoShape })
  const [toDoList, setToDoList] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [toDoID, setToDoID] = useState(null)
  const [statusMessage, setStatusMessage] = useState('');


  // this useeffect runs once on load, and will grab our stored todo lists if it exists, or just an empty array if it doesn't
  useEffect(() => {
    const storedToDos = JSON.parse(localStorage.getItem('toDoList')) || []
    setToDoList(storedToDos)
  }, [])

  // this useeffect will set the local storage every time todoList is changed, keeping our storage up to date
  useEffect(() => {
    localStorage.setItem('toDoList', JSON.stringify(toDoList))
  }, [toDoList])

  useEffect(() => {
    if (statusMessage) {
        const timer = setTimeout(() => setStatusMessage(''), 3000); // Clear after 3 seconds
        return () => clearTimeout(timer);
    }
}, [statusMessage]);
// Clear the Status Message
  const handleChange = (e) => {
    // this is destructuring the name and value elements from the inputs, if it's a bit confusing I can change it back to the old way but it should be okay for now.
    const { name, value } = e.target

    // making sure description is under 250 in the change, just in case the html limit doesn't work somehow. Might be redundant? 
    if (name === 'description' && value.length > 250) {
      return
    }


    // I indented this ternury statement to make it look nicer, might ask for feedback on whether this is okay, as I usually don't see these with intenting or put on a different line.
    const selectedValue =
      e.target.type === 'select-one' ?
        e.target.options[e.target.selectedIndex].value
        : value

    setToDo((prevToDo) => ({ ...prevToDo, [name]: selectedValue }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // if there are some fields not filled in (once again, redundency for the HTML required not working, might be redundant but it's nice to have, it caught an error when I didn't have the select box have a default value for team members)
    if (!toDo.name || !toDo.description || !toDo.dueDate || !toDo.assignedMember) {
      setErrorMessage('Please fill in all the fields!')
      return
    }

    // check if we're editing a task, if we are, check if the task id matches the ID in state, if it does, replace that task with the current todo state (edited version)
    if (isEditing) {
      const updatedTodoList = toDoList.map((task) =>
        task.id === toDoID ? toDo : task
      )
      //set the list, then return all the others to defaults so that we can edit properly next time.
      setToDoList(updatedTodoList)
      setIsEditing(false)
      setToDoID(null)
      setToDo({ ...toDoShape })
    } else {
      // if it's not editing, we're creating a new todo~
      const newToDo = { ...toDo, id: Date.now() }
      setToDoList((prevToDoList) => [...prevToDoList, newToDo])
      setToDo({ ...toDoShape })
    }

    setErrorMessage('')
  }

  const handleRemove = (toDoID) => {
    const updatedToDoList = toDoList.filter((task) => task.id !== toDoID)
    setToDoList(updatedToDoList)
  }

  // this maps through our list, and when it finds the task with the ID equal to the one clicked, it'll change it's status to whichever button was clicked ('in progress', 'completed' and 'in review')
  const handleToDoStatusChange = (toDoID, newToDoStatus) => {
    const updatedToDoList = toDoList.map((task) =>
        task.id === toDoID ? { ...task, status: newToDoStatus } : task
    );
    setToDoList(updatedToDoList);

    let message = '';
    switch (newToDoStatus) {
        case 'in-progress':
            message = 'Task set to In Progress';
            break;
        case 'completed':
            message = 'Task completed!';
            break;
        case 'review':
            message = 'Task is now in Review';
            break;
        case 'remove':
            message = 'Task is removed';
            break;
        case 'edit':
            message = 'You can edit the task';
            break;
        default:
            message = '';
            break;
    }
    setStatusMessage(message);
}


  // grab the task we want to edit, and set the current todo to that task. Make sure editing mode is enabled through state, and the ID it set to this current todo's ID.
  const handleEdit = (toDoID) => {
    const taskToEdit = toDoList.find((task) => task.id === toDoID)
    setToDo(taskToEdit)
    setIsEditing(true)
    setToDoID(toDoID)
  }


  const renderToDoList = () => {
    const sortedToDoList = toDoList.sort((a, b) =>
      // stole this code from stackoverflow, but essentially localecompare is checking whether the status is in alphabetical order, maybe try to sort it by "in progress" then "complete" then "in review"? for logic? but leaving for now.
      a.status.localeCompare(b.status)
    )

    return sortedToDoList.map((task, index) => (
      <div className="todo-container" key={Date.now() + index}>
        <h2 className="todo-name">{task.name}</h2>
        <h2 className="todo-description">{task.description}</h2>
        <h2 className="todo-dueDate">{task.dueDate}</h2>
        <h2 className="todo-assignedMember">{task.assignedMember}</h2>
        <h2 className="todo-status">{task.status}</h2>
        <button className="in-progress" onClick={() => handleToDoStatusChange(task.id, 'in-progress')}>In progress</button>
        <button className="completed" onClick={() => handleToDoStatusChange(task.id, 'completed')}>Completed</button>
        <button className="review" onClick={() => handleToDoStatusChange(task.id, 'review')}>In Review</button>
        <button className="remove" onClick={() => handleRemove(task.id)}>Remove todo</button>
        <button className="edit" onClick={() => handleEdit(task.id)}>Edit task</button>
      </div>
    ))
  }

  return (
    <>
      <form onSubmit={handleSubmit} id="todo-form">
        <label htmlFor="name">Todo name: </label>
        <input type="text" name="name" value={toDo.name} onChange={handleChange} required />
        <br />

        <label htmlFor="description">Todo description: </label>
        <input type="text" name="description" maxLength="250" value={toDo.description} onChange={handleChange} required />
        <br />

        <label htmlFor="dueDate">Todo due date: </label>
        <input type="date" name="dueDate" value={toDo.dueDate} onChange={handleChange} required />
        <br />

        <label htmlFor="assignedMember">Todo assigned member: </label>
        <select name="assignedMember" value={toDo.assignedMember} onChange={handleChange} required>
          <option value="">Select a team member</option>
          <option value="Hugh">Hugh</option>
          <option value="Praseen">Praseen</option>
          <option value="Sylvia">Sylvia</option>
          <option value="Tracey">Tracey</option>
          <option value="Liam">Liam</option>
        </select>
        <br />

        <label htmlFor="status">Todo status:</label>
        <select name="status" value={toDo.status} onChange={handleChange} required>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="review">Up for Review</option>
        </select>

        <button type="submit">{isEditing ? 'Edit ToDo' : 'Add ToDo'}</button>
      </form>

      {errorMessage && (
        <section style={{ color: 'red' }}>{errorMessage}</section>
      )}

        {statusMessage && (
            <div className={`status-message status-${statusMessage.toLowerCase().replace(/\s+/g, '-')}`}>
            {statusMessage}
        </div>
        
        )}

      <div className="toDo-list">
        <h1>Todo: </h1>
        {toDoList.length > 0 ? renderToDoList() : <h3>No tasks yet, try adding some!</h3>}
      </div>
    </>
  )
}

export default Form 
