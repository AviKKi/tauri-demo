import { invoke } from '@tauri-apps/api';
import React, { useEffect, useState } from 'react';
import classes from './todo.module.css'

interface Todo {
  id: number,
  title: string,
  body: string,
  done: boolean
}

function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  function loadTodos() {
    invoke('todos_list').then((t: any) => setTodos(JSON.parse(t)))
  }
  useEffect(loadTodos, [])
  function createTodo(title: string, body: string) {
    invoke('todos_create', { title, body }).then(loadTodos)
  }
  function deleteTodo(id: number) {
    invoke('todos_delete', { id }).then(() => {
      setTodos(todos.filter(t => t.id !== id))
    })
  }

  return { todos, createTodo, deleteTodo }
}


export default function Todo() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const { createTodo, deleteTodo, todos } = useTodos()
  const onBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)
  const onTitleChagne = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
  const handleAddTodo = () => {
    createTodo(title, body)
  }
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.id
    if (!id) return
    deleteTodo(parseInt(id))
  }
  return <div>
    <div className={classes.newForm}>
      <input placeholder='title' value={title} onChange={onTitleChagne} />
      <textarea placeholder='body' value={body} onChange={onBodyChange} />
      <button onClick={handleAddTodo}>Add</button>
    </div>
    <div className={classes.todoCardsWrapper}>
      {todos.map(t => <div className={classes.todoCard} key={t.id}>
        <div>{t.title}</div>
        <div>{t.body}</div>
        <button data-id={t.id} onClick={handleDelete}>Delete</button>
      </div>)}
    </div>
    {JSON.stringify(todos)}
  </div>
}