import React from "react";
import "todomvc-app-css/index.css";
import Footer from "../components/Footer";
import TodoList from "../containers/TodoList";

export default function App() {
  return (
  <>
    <div className="todoapp">
      <TodoList />
    </div>
    <Footer />
  </>
  );
}
