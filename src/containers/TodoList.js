import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TodoItem from './TodoItem'
import { guid } from '../utils'
import './TodoList.css'
import loadingSpinner from '../assets/spinner.gif'

export default function TodoList () {
  const [todos, setTodos] = useState([])
  const [todoInput, setTodoInput] = useState('')
  const [isLoadingAllTodos, setIsLoadingAllTodos] = useState(true)
  const [isAddingNewTodo, setIsAddingNewTodo] = useState(false)

  const handleTodoInput = (e) => {
    setTodoInput(e.target.value)
  }

  useEffect(() => {
    const getTodos = async () => {
      setIsLoadingAllTodos(true)
      await axios.get('https://delight-backend.herokuapp.com/todos')
        .then(res => {
          console.log(res.data)
          setIsLoadingAllTodos(false)
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
      label: todoInput
    }
    if (e.key === 'Enter') {
      setIsAddingNewTodo(true)
      axios.post('https://delight-backend.herokuapp.com/create', newTodo)
        .then(res => {
          setIsAddingNewTodo(false)
          setTodos([...todos, newTodo])
          setTodoInput('')
        })
        .catch(err => {
          setIsAddingNewTodo(false)
          console.log(err)
        })
    }
  }

  return (
    <div>
      <React.Fragment>
        <header className="header">
          <h1>todos</h1>
          <input
            className={`${isAddingNewTodo ? 'new-todo loadingSpinnerAddTodo' : 'new-todo'}`}
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
            { isLoadingAllTodos
              ? <img src={loadingSpinner} alt="loading" className="loadingSpinnerAllTodos" />
              : ''}

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
        </footer>
      </React.Fragment>
    </div>
  )
}
