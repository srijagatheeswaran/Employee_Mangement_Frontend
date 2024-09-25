import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './components/login';
import './App.css';
import Register from "./components/Register";
import Profile from "./components/Profile";
import Details from "./components/empDetails";
import Calendar from "./components/Calendar";

function App() {
  return <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/profile/profile_Details' element={<Details />} />
        <Route path='/profile/Calendar' element={<Calendar />} />
      </Routes>
    </BrowserRouter>
  </>
}

export default App;
