import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TodoItem from './TodoItem'
import { guid } from '../utils'
import './TodoList.css'
import loadingSpinner from '../assets/spinner.gif'

export default function TodoList () {
  const [displayedTodos, setDisplayedTodos] = useState([])
  const [newTodoText, setNewTodoText] = useState('')
  const [isLoadingAllTodos, setIsLoadingAllTodos] = useState(true)
  const [isAddingNewTodo, setIsAddingNewTodo] = useState(false)

  // sets newTodoInput
  const handleTodoInput = (e) => {
    setNewTodoText(e.target.value)
  }

  // automatically fetches all todos from database whenever page renders
  useEffect(() => {
    const getTodos = async () => {
      setIsLoadingAllTodos(true)
      await axios.get('https://delight-backend.herokuapp.com/todos')
        .then(res => {
          console.log(res.data)
          setIsLoadingAllTodos(false)
          setDisplayedTodos(res.data)
        })
        .catch(err => console.log(err))
    }
    getTodos()
  }, [])

  // creates a new object to be handled by Express middleware
  const submitTodo = (e) => {
    const newTodo = {
      id: guid(),
      done: false,
      label: newTodoText
    }
    // if enter key is pressed:
      // 1. displays loading spinner and sends POST request
      // 2. pushes the new todo object to setTodos array
    if (e.key === 'Enter') {
      setIsAddingNewTodo(true)
      axios.post('https://delight-backend.herokuapp.com/create', newTodo)
        .then(res => {
          setIsAddingNewTodo(false)
          setDisplayedTodos([...displayedTodos, newTodo])
          setNewTodoText('')
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
            value={newTodoText}
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

            {displayedTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} todos={displayedTodos} setTodos={setDisplayedTodos} />
            ))
            }
          </ul>
        </section>

        <footer className="footer">
          <span className="todo-count">
            <strong>{displayedTodos.length} {displayedTodos.length === 1 ? "item" : "items"} total</strong>
          </span>
        </footer>
      </React.Fragment>
    </div>
  )
}
