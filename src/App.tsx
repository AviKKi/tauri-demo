import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { invoke } from '@tauri-apps/api';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";


const Counter = () => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    invoke('get_count').then((c: any) => setCount(c))
  }, [])
  const inc = () => {
    invoke('update_count', { update: 1 }).then((c: any) => setCount(c))
  }
  const dec = () => {
    invoke('update_count', { update: -1 }).then((c: any) => setCount(c))
  }
  return (
    <div className="App">
      <button onClick={dec}>-</button>
      <input value={count} />
      <button onClick={inc}>+</button>
    </div>
  );
}

const Index = () => {
  return <ul>
    <Link to="/counter">Counter</Link>
  </ul>
}

function App() {
  return <div>
    <BrowserRouter>
      <Link to="/">All Apps</Link>

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/counter" element={<Counter />} />
      </Routes>
    </BrowserRouter>
  </div>
  return <Counter />
}

export default App;
