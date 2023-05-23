import React, { useEffect, useState } from "react";
import "./Home.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Tooltip from "@mui/material/Tooltip";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BugReportIcon from "@mui/icons-material/BugReport";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PageLoader from "../loader/PageLoader";
import CustomAlert from "../alert/CustomAlert";

import { useNavigate, useLocation } from "react-router-dom";

const UserHome = () => {
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);

  // alert params
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    const getInitialInfo = async () => {
      setIsLoading(true);
      await getTasksAssigned();
      setIsLoading(false);
    };

    getInitialInfo();
  }, []);

  const getTasksAssigned = () => {
    console.log("getTasksAssigned userId ", user.userId);
    const url = `http://localhost:8080/api/v1/task/assignee/${user.userId}`;
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
          let projectsData = [
            ...new Map(data.map((t) => [t["project"].id, t])).values(),
          ];
          projectsData = projectsData.map((t) => t.project);
          console.log("#MK1 projectsData ", projectsData);

          console.log("#MK1 tasks ", data);
          setTasks(data);
          setProjects(projectsData);
        }
        return data;
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

  const navigateToTask = (taskId) => {
    navigate("/task", { state: { taskId: taskId } });
  };

  const navigateToProject = (projectId) => {
    navigate("/project", { state: { projectId: projectId } });
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

  const getSingleTaskView = (t) => {
    return (
      <Card
        key={`${t.name}-${t.id}`}
        sx={{ margin: "5px 3% 1px", padding: "2px" }}
      >
        <Grid container direction="row" justifyContent="left" alignItems="left">
          <Grid item xs={1} sx={{ textAlign: "center" }}>
            <Box>{getTaskIcon(t)}</Box>
          </Grid>
          <Grid item xs={1}>
            <Box>
              <Tooltip title={`Priority ${t.priority.toLowerCase()}`}>
                {getPriorityIcon(t)}
              </Tooltip>
            </Box>
          </Grid>
          <Grid item xs={10} onClick={() => navigateToTask(t.id)}>
            <Typography
              variant="h7"
              sx={{
                marginLeft: "30px",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t.name}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    );
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
        <main className="userHome">
          <Box sx={{ width: "90%", margin: "20px auto", textAlign: "left" }}>
            {tasks.length === 0 && (
              <Box>You have no tasks assigned. Enjoy your coffee.</Box>
            )}
            {projects.map((p, idx) => (
              <Accordion key={p.id} defaultExpanded={idx === 0}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography
                    variant="h6"
                    onClick={() => navigateToProject(p.id)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {p.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ backgroundColor: "rgb(245,245,245,0.9)" }}
                >
                  <Box className="" sx={{ textAlign: "left" }}>
                    {tasks
                      .filter((t) => t.project.id === p.id)
                      .map((t) => getSingleTaskView(t))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </main>
      )}
    </>
  );
};

export default UserHome;
