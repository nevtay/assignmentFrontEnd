import React, { useState, useEffect } from "react";
import axios from 'axios'
import TodoItem from "./TodoItem";
import { guid } from '../utils'

export default function TodoList() {
  const [todos, setTodos] = useState([])
  const [todoInput, setTodoInput] = useState("")

  const handleTodoInput = (e) => {
    setTodoInput(e.target.value)
  }

  useEffect(() => {
    const getTodos = async() => { 
      await axios.get('https://delight-backend.herokuapp.com/todos')
      .then(res => {
        console.log(res.data)
        setTodos(res.data)
      })
      .catch(err => console.log(err))
    }
    getTodos()
  }, [])

  const submitTodo = (e) => {
    const newTodo = {
      id: guid(),
      done: false,
      label: todoInput,
    }
    if (e.key === 'Enter') {
    axios.post('https://delight-backend.herokuapp.com/create', newTodo)
    .then(res => {
      console.log(res)
      setTodos([...todos, newTodo])
      setTodoInput("")
    })
    .catch(err => console.log(err))
    }
  }

  return (
    <React.Fragment>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          type="text"
          onKeyDown={submitTodo}
          value={todoInput}
          onChange={handleTodoInput}
          />
      </header>

      <section className="main">
        <input
          id="toggle-all"
          type="checkbox"
          className="toggle-all"
        />
        <label htmlFor="toggle-all" />
        <ul className="todo-list">
          {todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} todos={todos} setTodos={setTodos} />
          ))
          }
        </ul>
      </section>

      <footer className="footer">
        <span className="todo-count">
          <strong>{todos.length}</strong> items total
        </span>
        <ul className="filters">
          <li>
            {/* <NavLink exact={true} to="/" activeClassName="selected"> */}
              All
            {/* </NavLink> */}
          </li>
          <li>
            {/* <NavLink to="/active" activeClassName="selected"> */}
              Active
            {/* </NavLink> */}
          </li>
          <li>
            {/* <NavLink to="/completed" activeClassName="selected"> */}
              Completed
            {/* </NavLink> */}
          </li>
        </ul>
        {/* {anyDone && (
          <button className="clear-completed" onClick={onClearCompleted}>
            Clear completed
          </button>
        )} */}
      </footer>
    </React.Fragment>
  );
}
