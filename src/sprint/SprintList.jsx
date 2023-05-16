import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
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

import { useNavigate, useLocation } from "react-router-dom";

const SprintList = () => {
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [projectId, setProjectId] = useState(undefined);

  // alert params
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");

  const [sprints, setSprints] = useState([]);
  const [sprintsNotCompletedFinal, setSprintsNotCompletedFinal] = useState([]);
  const [sprintsCompletedFinal, setSprintsCompletedFinal] = useState([]);

  const [tasks, setTasks] = useState([]);
  const [tasksToDisplay, setTasksToDisplay] = useState(new Map());
  const [tasksToDisplayCompleted, setTasksToDisplayCompleted] = useState(
    new Map()
  );

  useEffect(() => {
    setProjectId(location.state.projectId);

    if (!user) {
      navigate("/login");
    }
    const getInitialInfo = async () => {
      setIsLoading(true);
      const sprintsTmp = await getSprints(location.state.projectId);
      await getTasks(location.state.projectId, sprintsTmp);

      setIsLoading(false);
    };

    getInitialInfo();
  }, []);

  const getSprints = (projectId) => {
    const url = `http://localhost:8080/api/v1/sprint/project/${projectId}`;
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
          console.log("sprints ", data);
          setSprints(data);
        }
        return data;
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const getTasks = (projectId, sprintsTmp) => {
    console.log("sprints getTasks ", sprintsTmp);
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
          let tmp = data.filter((t) => t.sprint);
          setTasks(tmp);
          prepareTasksToDisplay(tmp, sprintsTmp);
        }

        return data;
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const prepareTasksToDisplay = (tasksTmp, sprintsTmp) => {
    let sprintsNotCompleted = sprintsTmp.filter((s) => !s.isCompleted);
    let sprintsCompleted = sprintsTmp.filter((s) => s.isCompleted);
    setSprintsNotCompletedFinal(sprintsNotCompleted);
    setSprintsCompletedFinal(sprintsCompleted);

    let tasksNotCompletedMap = new Map();
    let tasksCompletedMap = new Map();
    for (let s of sprintsNotCompleted) {
      let tasksBySprint = tasksTmp.filter((t) => t.sprint.id === s.id);
      tasksNotCompletedMap.set(`Sprint ${s.sprintNumber}`, tasksBySprint);
    }

    for (let s of sprintsCompleted) {
      let tasksBySprint = tasksTmp.filter((t) => t.sprint.id === s.id);
      tasksCompletedMap.set(`Sprint ${s.sprintNumber}`, tasksBySprint);
    }

    console.log("tasksNotCompletedMap ", tasksNotCompletedMap);
    console.log("tasksCompletedMap ", tasksCompletedMap);
    setTasksToDisplay(tasksNotCompletedMap);
    setTasksToDisplayCompleted(tasksCompletedMap);
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

  const getFutureSprintsView = () => {
    return <div>sprints</div>;
  };

  const getCompletedSprintsView = () => {
    return <div>completed sprints</div>;
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
      <main className="sprintList">
        <div className="sprintNotCompleted">
          <Box
            sx={{
              marginTop: "40px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                paddingTop: "1%",
                letterSpacing: "2px",
                textAlign: "left",
                paddingLeft: "2%",
              }}
            >
              Future
            </Typography>
            {!sprintsNotCompletedFinal ||
            (sprintsNotCompletedFinal &&
              sprintsNotCompletedFinal.length === 0) ? (
              <Typography
                variant="h8"
                component="div"
                sx={{
                  paddingTop: "1%",
                  letterSpacing: "2px",
                  textAlign: "left",
                  paddingLeft: "2%",
                }}
              >
                You have no sprints to complete.
              </Typography>
            ) : (
              <Box>{getFutureSprintsView()}</Box>
            )}
          </Box>
        </div>
        <div className="sprintNotCompleted">
          <Box
            sx={{
              marginTop: "40px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                paddingTop: "1%",
                letterSpacing: "2px",
                textAlign: "left",
                paddingLeft: "2%",
              }}
            >
              Completed
            </Typography>
            {!sprintsCompletedFinal ||
            (sprintsCompletedFinal && sprintsCompletedFinal.length === 0) ? (
              <Typography
                variant="h8"
                component="div"
                sx={{
                  paddingTop: "1%",
                  letterSpacing: "2px",
                  textAlign: "left",
                  paddingLeft: "2%",
                }}
              >
                You have no sprints completed
              </Typography>
            ) : (
              <Box>{getCompletedSprintsView()}</Box>
            )}
          </Box>
        </div>
      </main>
    </>
  );
};

export default SprintList;
