import React from "react";
import { Routes, Route } from "react-router-dom";
import PageNotFound from "../pageNotFound/PageNotFound";
import HomeContainer from "../home/HomeContainer";
import UserProfile from "../userProfile/UserProfile";
import Header from "../header/Header";
import Description from "../description/Description";
import Functionalities from "../functionalities/Functionalities";
import LoginPage from "../login/LoginPage";
import SignUpPage from "../signup/SignUpPage";
import Projects from "../projects/Projects";
import Tasks from "../tasks/Tasks";
import Dashboards from "../dashboards/Dashboards";
import Create from "../create/Create";
import SettingsPanel from "../settings/SettingsPanel";
import AdminPanel from "../admin/AdminPanel";
import LogOutPage from "../logout/LogOutPage";
import Footer from "../footer/Footer";

import "./App.css";

const App = () => {
  return (
    <div className="App">
      <Header />
      <div className="wrapper">
        <Routes>
          <Route path="/" element={<HomeContainer />} />
          <Route path="/description" element={<Description />} />
          <Route path="/functionalities" element={<Functionalities />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route path="/projects" element={<Projects />} />
          <Route path="/dashboards" element={<Dashboards />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/settings" element={<SettingsPanel />} />
          <Route path="/logout" element={<LogOutPage />} />
          <Route path="/admin" element={<AdminPanel />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
