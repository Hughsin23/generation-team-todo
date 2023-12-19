import React, { useState, useEffect } from 'react'
import todoShape from './todo.js'

const Form = ({ toDoID }) => {
  // this is grabbing the initial shape I made in the task.js file as the default shape for our toDo task, I used the spread operator to make sure it was making a clone that is mutable rather than it editing a shallow copy of the original object.
  const [toDo, setToDo] = useState({ ...toDoShape })
  const [toDoList, setToDoList] = usestate([])
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
        task.id === toDoID ? toDo : task
      })
      setToDoList(updatedTodoList)
    } else { // add a new task if it doesn't exist already, using the date as an ID.
      const newToDo = { ...toDo, id: Date.now() }
      setToDoList((prevToDoList) => [...prevToDoList, newToDo])
    }
    // reset the todo after submitting the current one, as well as resetting the error.
    setToDo({ ...todoShape })
    setErrorMessage('')

  }


}