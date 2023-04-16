import React from 'react';
import { Routes, Route } from "react-router-dom";
import PageNotFound from '../pageNotFound/PageNotFound';
import Home from '../home/Home';
import UserProfile from '../userProfile/UserProfile';
import Header from '../header/Header';
import './App.css';

const  App = () => {

  

  return (
    <div className="App">
      <Header/>
      <div className="wrapper">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
