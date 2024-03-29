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
import SignUpSuccess from "../signup/SignUpSuccess";
import Projects from "../projects/Projects";
import ProjectDetails from "../projects/ProjectDetails";
import Tasks from "../tasks/Tasks";
import TaskDetails from "../tasks/TaskDetails";

import Dashboards from "../dashboards/Dashboards";
import DashboardDetail from "../dashboards/DashboardDetail";

import Create from "../create/Create";
import SettingsPanel from "../settings/SettingsPanel";
import AdminPanel from "../admin/AdminPanel";
import LogOutPage from "../logout/LogOutPage";
import Footer from "../footer/Footer";
import ReleaseList from "../release/ReleaseList";
import SprintList from "../sprint/SprintList";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import "./App.css";

const App = () => {
  return (
    <div className="App">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="headerWrapper">
          <Header />
        </div>
        <div className="appWrapper">
          <Routes>
            <Route path="/" element={<HomeContainer />} />
            <Route path="/description" element={<Description />} />
            <Route path="/functionalities" element={<Functionalities />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/registered" element={<SignUpSuccess />} />

            <Route path="/projects" element={<Projects />} />
            <Route path="/project" element={<ProjectDetails />} />
            <Route path="/releases" element={<ReleaseList />} />
            <Route path="/sprints" element={<SprintList />} />

            <Route path="/dashboards" element={<Dashboards />} />
            <Route path="/dashboard" element={<DashboardDetail />} />

            <Route path="/tasks" element={<Tasks />} />
            <Route path="/task" element={<TaskDetails />} />

            <Route path="/create" element={<Create />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/settings" element={<SettingsPanel />} />
            <Route path="/logout" element={<LogOutPage />} />
            <Route path="/admin" element={<AdminPanel />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
        <div className="footerWrapper">
          <Footer />
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default App;
