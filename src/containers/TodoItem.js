import React, { useCallback, useRef, useState } from "react";
import axios from 'axios'



export default function TodoItem({ todo }) {
  // const onDelete = await
  return (
    <li>
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          // checked={todo.done}
          // onChange={onDone}
          // autoFocus={true}
        />
        <label>{todo.label}</label>
        <button 
        className="destroy" 
        // onClick={onDelete} 
        />
      </div>
      {/* {editing && (
        <input
          ref={ref}
          className="edit"
          value={todo.label}
          onChange={onChange}
          onKeyPress={onEnter}
        />
      )} */}
    </li>
  );
}
