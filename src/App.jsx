import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Home } from "./pages/Home"
import Topic from './pages/Topic'


export function App() {
  const LS_CATEGORIES = "flash_categories";
  const LS_CARDS = "flash_cards";


  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/topic/:category" element={<Topic />} />
    </Routes>
  )
}

