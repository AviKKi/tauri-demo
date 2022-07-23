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
  return <ul style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
    <Link to="/counter">Counter</Link>
    <Link to="/reddit">Reddit</Link>
  </ul>
}


const Reddit = () => {
  const [sub, setSub] = useState("")
  const [data, setData] = useState<any>(undefined)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSub(e.target.value)
  const onLoad = () => {
    invoke('get_subreddit', { sub }).then((res: any) => {
      setData(JSON.parse(res))
    })
  }
  const thumbnails = (data && data.data.children.map((ch: any) => ch.data.thumbnail).filter((x: any) => !!x)) || []
  return <div>
    <div>
      <input value={sub} onChange={handleChange} /><button onClick={onLoad}>Load</button>
      {thumbnails.map((t: any) => <img src={t} />)}
    </div>
  </div>
}

function App() {
  return <div>
    <BrowserRouter>
      <Link to="/">All Apps</Link>

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/counter" element={<Counter />} />
        <Route path="/reddit" element={<Reddit />} />
      </Routes>
    </BrowserRouter>
  </div>
  return <Counter />
}

export default App;
