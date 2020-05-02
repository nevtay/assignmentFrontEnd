import React, { useState, useRef } from "react";
import useOnClickOutside from "use-onclickoutside";

import useDoubleClick from "../hooks/useDoubleClick";

import axios from 'axios'

export default function TodoItem({ todo, todos, setTodos }) {
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(todo.label)
  const [isDone, setIsDone] = useState(todo.done)

  const handleSetLabel = (e) => {
    setLabel(e.target.value)
  }

  const handleSetIsDone = async (e) => {
    setIsDone(!isDone)
    await axios.post(`https://delight-backend.herokuapp.com/update`, {
        id: todo.id,
        done: !isDone,
        label: label
      })  
    .then(res => {
      console.log(res.data)
    })
    .catch(err => console.log(err))
  }

  const ref = useRef();
  const wrapperRef = useRef()
  useOnClickOutside(wrapperRef, () => {
    if (editing) {
      setEditing(false)
    }
  })

  const onEnter = async (e) => {
    if (e.key === 'Enter') {
      setLabel(e.target.value)
      setEditing(false)
      await axios.post(`https://delight-backend.herokuapp.com/update`, {
        id: todo.id,
        label: label
      })  
    .then(res => console.log(res.data))
    .catch(err => console.log(err))
    }
  }

  const onDelete = async () => { 
    const todoId = todo.id
    await axios.delete(`https://delight-backend.herokuapp.com/delete/${todoId}`)  
    .then(res => {
       setTodos(todos.filter(todo => todo.id !== todoId))
    })
    .catch(err => console.log(err))
  }

  const handleViewClick = useDoubleClick(null, () => setEditing(true));

  return (
    <li
    ref={wrapperRef}  
    onClick={handleViewClick}
    className={`${editing ? "editing" : ""} ${isDone ? "completed" : ""}`}
    >
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          defaultChecked={isDone}
          onClick={(e) => handleSetIsDone(e)}
        />
        <label>{label}</label>
        <button 
        className="destroy" 
        onClick={onDelete} 
        />
      </div>
      {editing && (
        <input
          ref={ref}
          type="text"
          className="edit"
          value={label}
          onChange={handleSetLabel}
          onKeyPress={onEnter}
        />
        )}
    </li>
  );
}
