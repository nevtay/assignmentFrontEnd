/* eslint-disable react/prop-types */
import React, { useState, useRef } from 'react'
import useOnClickOutside from 'use-onclickoutside'

import useDoubleClick from '../hooks/useDoubleClick'

import axios from 'axios'

export default function TodoItem ({ todo, todos, setTodos }) {
  const [isEditing, setIsEditing] = useState(false)
  const [todoText, setTodoText] = useState(todo.label)
  const [isDone, setIsDone] = useState(todo.done)

  // updates todoText
  const handleSetLabel = (e) => {
    setTodoText(e.target.value)
  }

  // updates database whenever a todo's done state is toggled
  const handleSetIsDone = async (e) => {
    setIsDone(!isDone)
    await axios.post('https://delight-backend.herokuapp.com/update', {
      id: todo.id,
      done: !isDone,
      label: todoText
    })
      .then(res => console.log(res.data))
      .catch(err => console.log(err))
  }

  // if a todo is in the state of being edited, clicking outside of the todo allows user to undo all changes
  const ref = useRef()
  const wrapperRef = useRef()
  useOnClickOutside(wrapperRef, () => {
    if (isEditing) {
      setTodoText(todo.label)
      setIsEditing(false)
    }
  })

  // handles how a todo is saved
  // when the "enter" key is pressed, the edited todo is compared against its previous version
  // if previous todo is the same as edited todo, hitting "enter" does not send a POST request
  // if old todo is different from edited todo, hitting "enter" sends a POST request which updates the database
  // regardless of the outcome, hitting the "enter" key sets the "editing" state back to false
  const handleTodoEdit = async (e) => {
    console.log(e.key)
    if (e.key === 'Enter') {
      if (e.target.value === todo.label) {
        setTodoText(todo.label)
        setIsEditing(false)
      } else {
        setTodoText(e.target.value)
        setIsEditing(false)
        await axios.post('https://delight-backend.herokuapp.com/update', {
          id: todo.id,
          label: todoText
        })
          .then(res => console.log(res.data))
          .catch(err => console.log(err))
      }
    }
  }

  // deletes the todo from the parent state and the database
  const onDelete = async () => {
    const todoId = todo.id
    await axios.delete(`https://delight-backend.herokuapp.com/delete/${todoId}`)
      .then(res => {
        setTodos(todos.filter(todo => todo.id !== todoId))
      })
      .catch(err => console.log(err))
  }

  // enables double-clicking to trigger editing state on a todo
  // this hook was already here prior to being forked
  const handleViewClick = useDoubleClick(null, () => setIsEditing(true))

  return (
    <li
      ref={wrapperRef}
      onClick={handleViewClick}
      className={`${isEditing ? 'editing' : ''} ${isDone ? 'completed' : ''}`}
    >
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          defaultChecked={isDone}
          onClick={(e) => handleSetIsDone(e)}
        />
        <label>{todoText}</label>
        <button
          className="destroy"
          onClick={onDelete}
        />
      </div>
      {isEditing && (
        <input
          ref={ref}
          type="text"
          className="edit"
          value={todoText}
          onChange={handleSetLabel}
          onKeyDown={handleTodoEdit}
        />
      )}
    </li>
  )
}
