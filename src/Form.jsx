import React, { useState, useEffect } from 'react'
import toDoShape from './todo.js'

const Form = ({ toDoID }) => {
  // this is grabbing the initial shape I made in the task.js file as the default shape for our toDo task, I used the spread operator to make sure it was making a clone that is mutable rather than it editing a shallow copy of the original object.
  const [toDo, setToDo] = useState({ ...toDoShape })
  const [toDoList, setToDoList] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  // have a useeffect to grab the stored toDos 
  useEffect(() => {
    const storedtoDos = JSON.parse(localStorage.getItem('toDoList')) || []
    setToDoList(storedtoDos)
  }, [])

  // have this useEffect to fire off when the toDo list changes, so we get an updated list in our local storage.
  useEffect(() => {
    localStorage.setItem('toDoList', JSON.stringify(toDoList))
  }, [toDoList])

  const handleChange = (e) => {
    // grab the name and value of the toDo from the form, destructuring like this neatens things up, but I can put it in the old way it people like the look of that better.
    const { toDoName, toDoValue } = e.target

    setToDo((prevtoDo) => ({ ...prevtoDo, [toDoName]: toDoValue }))
  }

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

  const handleToDoStatusChange = (toDoID, newToDoStatus) => {
    const updatedToDoList = toDoList.map((task) => {
      return task.id === toDoID ? { ...task, status: newToDoStatus } : task
    })
    setToDoList(updatedToDoList)
  }

  const renderToDoList = () => {
    const sortedToDoList = toDoList.sort((a, b) => a.status.localeCompare(b.status))

    return sortedToDoList.map((task) => {
      <div className="todo-container">
        <h2 className="todo-name">{task.toDoName}</h2>
        <h2 className="todo-description">{task.toDoDescription}</h2>
        <h2 className="todo-dueDate">{task.dueDate}</h2>
        <h2 className="todo-assignedMember">{task.assignedMember}</h2>
        <h2 className="todo-status">{task.toDoStatus}</h2>
        <button className="in-progress" onClick={() => handleToDoStatusChange(task.id, 'in-progress')}></button>
        <button className="completed" onClick={() => handleToDoStatusChange(task.id, 'completed')}></button>
        <button className="review" onClick={() => handleToDoStatusChange(task.id, 'review')}></button>
        <button className="remove" onClick={() => handleRemove(task.id)}></button>
      </div>
    })
  }


  return (
    <>
      <form action="" id="todo-form">
        <label for="name">Todo name: </label>
        <input type="text" name="name" value={toDo.toDoName} onChange={handleChange} required />
        <br />


        <label for="description">Todo description: </label>
        <input type="text" name='description' />
        <br />

        <label for="due-date">Todo due date: </label>
        <input type="text" name='due-date' />
        <br />

        <label for="member">Todo assignmed member: </label>
        <input type="text" name='member' />
        <br />

        <label for="status">Todo status:</label>
        <select name="status">
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="review">Up for Review</option>
        </select>
      </form>

    </>
  )

}