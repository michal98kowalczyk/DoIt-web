import React, { useEffect, useState } from "react";
import "./Sprint.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Tooltip from "@mui/material/Tooltip";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PageLoader from "../loader/PageLoader";
import CustomAlert from "../alert/CustomAlert";
import TasksList from "../tasks/TasksList";

import { useNavigate, useLocation } from "react-router-dom";
import SprintForm from "./SprintForm";

const SprintList = () => {
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [projectId, setProjectId] = useState(undefined);
  const [projectAssignment, setProjectAssignment] = useState(undefined);

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
      await getProjectAssignmentDetails(location.state.projectId);

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
        data.sort((a, b) => (b.sprintNumber < a.sprintNumber ? 1 : -1));
        if (data && data.length != 0) {
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

  const getProjectAssignmentDetails = (projectId) => {
    const url = `http://localhost:8080/api/v1/assignment/project/${projectId}/user/${user.userId}`;
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
          setProjectAssignment(data);
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
    let views = [];
    let keys = tasksToDisplay.keys();
    let isFirst = true;
    for (let k of keys) {
      let tList = tasksToDisplay.get(k);
      views.push(createSingleView(k, tList, false, isFirst));
      isFirst = false;
    }
    return views;
  };

  const getCompletedSprintsView = () => {
    let views = [];
    let keys = tasksToDisplayCompleted.keys();
    let isFirst = true;
    for (let k of keys) {
      let tList = tasksToDisplayCompleted.get(k);
      views.push(createSingleView(k, tList, true, isFirst));
      isFirst = false;
    }
    return views;
  };

  const createSingleView = (sprintTmp, tasksArray, isCompleted, isFirst) => {
    let sprintNumber = sprintTmp.split(" ")[1];
    let sprintDetails = sprints.filter(
      (s) => Number(s.sprintNumber) === Number(sprintNumber)
    )[0];
    return (
      <Accordion key={sprintTmp}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6">{sprintTmp}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: "rgb(245,245,245,0.9)" }}>
          <Box className="sprintDetails" sx={{ textAlign: "left" }}>
            <Grid container direction="row" justifyItems="start">
              <Grid item>
                <Box>
                  <Typography
                    component="span"
                    sx={{ fontWeight: "bold", padding: "5px 10px" }}
                  >
                    Start date:
                  </Typography>
                  <Typography component="span" sx={{ padding: "5px 5px" }}>
                    {sprintDetails.startDate}
                  </Typography>
                </Box>{" "}
              </Grid>
              <Grid item>
                <Box>
                  <Typography
                    component="span"
                    sx={{ fontWeight: "bold", padding: "5px 10px" }}
                  >
                    End date:
                  </Typography>
                  <Typography component="span" sx={{ padding: "5px 5px" }}>
                    {sprintDetails.endDate}
                  </Typography>
                </Box>
              </Grid>

              <Grid item>
                <Box>
                  <Typography
                    component="span"
                    sx={{ fontWeight: "bold", padding: "5px 10px" }}
                  >
                    Fix Version:
                  </Typography>
                  <Typography component="span" sx={{ padding: "5px 5px" }}>
                    {sprintDetails.release.fixVersion}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box className="sprintActions" sx={{ textAlign: "left" }}>
            <Grid container direction="row" justifyItems="start">
              {!isCompleted && isFirst && !sprintDetails.isActive && (
                <Grid item sx={{ paddingRight: "20px" }}>
                  <Tooltip
                    title="Start Sprint"
                    onClick={() => handleSprintStart(sprintDetails.id)}
                    sx={{ cursor: "pointer" }}
                  >
                    <PlayCircleFilledWhiteIcon></PlayCircleFilledWhiteIcon>
                  </Tooltip>
                </Grid>
              )}

              {!isCompleted && isFirst && sprintDetails.isActive && (
                <Grid item sx={{ paddingRight: "20px" }}>
                  <Tooltip
                    title="Complete Sprint"
                    onClick={() => handleSprintComplete(sprintDetails.id)}
                    sx={{ cursor: "pointer" }}
                  >
                    <CheckCircleOutlineIcon></CheckCircleOutlineIcon>
                  </Tooltip>
                </Grid>
              )}

              {!isCompleted && (
                <Grid item>
                  <SprintForm
                    projectId={projectId}
                    isEdit={true}
                    iStartDate={sprintDetails.startDate}
                    iEndDate={sprintDetails.endDate}
                    releaseId={sprintDetails.release.id}
                    sprintId={sprintDetails.id}
                  ></SprintForm>
                </Grid>
              )}
            </Grid>
          </Box>

          <Box className="tasks">
            <TasksList
              sprint={sprintTmp}
              projectAssignment={projectAssignment}
              tasks={tasksArray}
            ></TasksList>
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  const handleSprintStart = (sprintId) => {
    const url = `http://localhost:8080/api/v1/sprint/start/${sprintId}`;
    const requestParams = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          handleOpenAlert("success", "Sprint started");
          window.location.reload();
        }
        return data;
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const handleSprintComplete = (sprintId) => {
    const url = `http://localhost:8080/api/v1/sprint/complete/${sprintId}`;
    const requestParams = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          handleOpenAlert("success", "Sprint completed");
          window.location.reload();
        }
        return data;
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
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
                <Box sx={{ width: "98%", margin: "0 auto" }}>
                  {getFutureSprintsView()}
                </Box>
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
                <Box sx={{ width: "98%", margin: "0 auto" }}>
                  {getCompletedSprintsView()}
                </Box>
              )}
            </Box>
          </div>
        </main>
      )}
    </>
  );
};

export default SprintList;
