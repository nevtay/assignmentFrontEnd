import React, { useState, useRef, useCallback } from "react";
import useOnClickOutside from "use-onclickoutside";

import useDoubleClick from "../hooks/useDoubleClick";
import useOnEnter from "../hooks/useOnEnter";

import axios from 'axios'

export default function TodoItem({ todo }) {
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(todo.label)

  const onDelete = async () => { 
    const todoId = todo.id
    await axios.delete(`https://delight-backend.herokuapp.com/delete/${todoId}`)  
    .then(res => {
      console.log(res)
      return res.data
    })
    .catch(err => console.log(err))
  }

  const handleViewClick = useDoubleClick(null, () => setEditing(true));

  const finishedCallback = useCallback(
    () => {
      setEditing(false);
      setLabel(label);
    },
    [todo]
  );

  const onChange = useCallback(event => setLabel(event.target.value), [
    todo.id
  ]);

  const onEnter = useOnEnter(finishedCallback, [todo]);

  const ref = useRef();
  useOnClickOutside(ref, finishedCallback);

  return (
    <li
      onClick={handleViewClick}
      className={`${editing ? "editing" : ""} ${todo.done ? "completed" : ""}`}
    >
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
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
          onChange={onChange}
          onKeyPress={onEnter}
        />
      )}
    </li>
  );
}
