import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Home } from "./pages/Home"
import Topic from './pages/Topic'
import AddCard from './pages/Addcard';


export function App() {



  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/topic/:category" element={<Topic />} />
       <Route path="/add/:category" element={<AddCard />} />
    </Routes>
  )
}

