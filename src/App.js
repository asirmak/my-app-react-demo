import './App.css';
import { BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import NavBar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import User from './components/User/User';
import React from 'react';
import Auth from './components/Auth/Auth';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <NavBar></NavBar>
        <Routes>
          <Route path ="/" element={<Home />}></Route>
          <Route path = "/users/:userId" element = {<User />}></Route>
          <Route path ="/auth" element={ localStorage.getItem("currentUser") !== null ? <Navigate  to="/"/> : <Auth/>}
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;