import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageLoader from "../loader/PageLoader";
import CustomAlert from "../alert/CustomAlert";
import ReleaseForm from "../release/ReleaseForm";
import SprintForm from "../sprint/SprintForm";
import DashboardForm from "../dashboards/DashboardForm";

import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BugReportIcon from "@mui/icons-material/BugReport";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useNavigate, useLocation } from "react-router-dom";

const DashboardDetails = () => {
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  const location = useLocation();
  const navigate = useNavigate();

  const [projectId, setProjectId] = useState(undefined);
  const [dashboardId, setDashboardId] = useState(undefined);

  const [projectAssignment, setProjectAssignment] = useState(undefined);
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [tasksToDisplay, setTasksToDisplay] = useState(new Map());

  const [isLoading, setIsLoading] = useState(false);
  // alert params
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    setProjectId(location.state.projectId);
    setDashboardId(location.state.dashboardId);

    if (!user) {
      navigate("/login");
    }
    const getInitialInfo = async () => {
      setIsLoading(true);
      await getTasks(location.state.projectId);

      setIsLoading(false);
    };

    getInitialInfo();
  }, []);

  const getTasks = (projectId, tmpAssignemnt) => {
    const url = `http://localhost:8080/api/v1/task/project/${projectId}`;
    const requestParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    return fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length != 0) {
          const sprintsTmp = data
            .filter((t) => t.sprint && !t.sprint.isCompleted)
            .map((t) => t.sprint)
            .sort((t1, t2) => t1.sprintNumber < t2.sprintNumber);
          setSprints(sprintsTmp);
          setTasks(
            data.sort(
              (a, b) =>
                new Date(b.lastModifiedDate) - new Date(a.lastModifiedDate)
            )
          );
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const handleOpenAlert = (
    severity = "error",
    message = "error",
    time = 2000
  ) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, time);
  };

  const handleBackToProjects = (e) => {
    navigate("/projects");
  };

  const navigateToReleases = (e) => {
    navigate("/releases", { state: { projectId: projectId } });
  };

  const navigateToSprints = (e) => {
    navigate("/sprints", { state: { projectId: projectId } });
  };

  const navigateToTask = (taskId) => {
    navigate("/task", { state: { taskId: taskId } });
  };

  const getTaskIcon = (t) => {
    switch (t.type) {
      case "Story":
        return <HistoryEduIcon sx={{ color: "green" }} />;
      case "Bug":
        return <BugReportIcon sx={{ color: "red" }} />;
      case "Task":
        return <AssignmentIcon sx={{ color: "blue" }} />;
    }
  };
  const getPriorityIcon = (t) => {
    switch (t.priority) {
      case "LOW":
        return <KeyboardArrowDownIcon sx={{ color: "blue" }} />;
      case "MEDIUM":
        return <MenuIcon sx={{ color: "#c36a2c" }} />;
      case "HIGH":
        return <KeyboardArrowUpIcon sx={{ color: "red" }} />;
    }
  };

  return (
    <>
      {showAlert && (
        <CustomAlert
          severity={alertSeverity}
          handleCloseAlert={setShowAlert}
          message={alertMessage}
        />
      )}
      {isLoading && <PageLoader />}
      {!isLoading && (
        <main className="dashboardDetails">
          <Card
            sx={{
              margin: "0 auto",
              bgcolor: "rgba(255,255,255,0.8)",
              width: { xs: "98%", md: "95%" },
            }}
          >
            <CardContent>
              dashboard details projectid:{projectId} dId:{dashboardId}
            </CardContent>
          </Card>
        </main>
      )}
    </>
  );
};

export default DashboardDetails;
