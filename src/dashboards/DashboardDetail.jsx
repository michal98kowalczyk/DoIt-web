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
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useNavigate, useLocation } from "react-router-dom";
import { common } from "@mui/material/colors";

const DashboardDetails = () => {
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  const location = useLocation();
  const navigate = useNavigate();

  const [projectId, setProjectId] = useState(undefined);
  const [dashboardId, setDashboardId] = useState(undefined);

  const [projectAssignment, setProjectAssignment] = useState(undefined);
  const [usersInProject, setUsersInProject] = useState([]);
  const [availableLabels, setAvailableLabels] = useState([]);

  const [dashboardDetails, setDashboardDetails] = useState(undefined);
  const [projectDetails, setProjectDetails] = useState(undefined);

  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [tasksToDisplay, setTasksToDisplay] = useState([]);

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
      const tasksTmp = await getTasks(location.state.projectId);
      console.log("tasksTmp ", tasksTmp);
      await getUserAssignmentByProject(location.state.projectId);
      await getDashboardDetails(location.state.dashboardId);

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
          setTasksToDisplay(
            data.sort(
              (a, b) =>
                new Date(b.lastModifiedDate) - new Date(a.lastModifiedDate)
            )
          );
          setAvailableLabels([...data.map((t) => t.labels)].flat());
        }
        return data;
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const getUserAssignmentByProject = (projectId) => {
    const url = `http://localhost:8080/api/v1/assignment/project/${projectId}`;
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
          setProjectDetails(data[0].project);

          let array = data.map((pa) => {
            let tmp = {
              id: pa.user.id,
              label: `${pa.user.firstName} ${pa.user.lastName}`,
              name: pa.user.email,
              key: pa.user.email,
            };
            return tmp;
          });
          setUsersInProject(array);
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const getDashboardDetails = (dId) => {
    const url = `http://localhost:8080/api/v1/dashboard/i/${dId}`;
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
          setDashboardDetails(data);
          console.log("da details ", data);
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
      case "Defect":
        return <BugReportOutlinedIcon sx={{ color: "orange" }} />;
      case "Task":
        return <AssignmentIcon sx={{ color: "blue" }} />;
      case "Technical":
        return <AssignmentIcon sx={{ color: "grey" }} />;
      case "Team":
        return <Diversity3OutlinedIcon sx={{ color: "blue" }} />;
      case "Test":
        return <QuizOutlinedIcon sx={{ color: "green" }} />;
      default:
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

  const getTasksByColumn = (c) => {
    console.log("column ", c);
    return tasksToDisplay
      .filter((t) => t.status.toLowerCase() === c.toLowerCase())
      .map((t) => {
        return (
          <Card
            key={t.id}
            sx={{
              margin: "5px auto",
              position: "relative",
            }}
          >
            <Tooltip
              title="Open"
              data-task={t.id}
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
              }}
            >
              <OpenInNewIcon
                onClick={() => navigateToTask(t.id)}
              ></OpenInNewIcon>
            </Tooltip>
            <CardContent sx={{ textAlign: "left" }}>
              <Typography>
                <b>Title:</b> {t.name}
              </Typography>
              <Typography>
                <b>Type:</b>
                <Tooltip title={t.type}>
                  <IconButton>{getTaskIcon(t)}</IconButton>
                </Tooltip>
              </Typography>
              <Typography>
                <b>Status:</b> {t.status}
              </Typography>
              <Typography>
                <b>Priority:</b>

                <Tooltip title={t.priority}>
                  <IconButton>{getPriorityIcon(t)}</IconButton>
                </Tooltip>
              </Typography>
              <Typography>
                <b>Assignee:</b>

                {t.assignee ? (
                  <Tooltip
                    title={`${t.assignee.firstName} ${t.assignee.lastName}`}
                  >
                    <IconButton>
                      <Avatar
                        alt={`${t.assignee.firstName} ${t.assignee.lastName}`}
                        src={t.assignee.photoUrl}
                        sx={{
                          maxWidth: "20px",
                          maxHeight: "20px",
                          fontSize: "0.75rem",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  " - "
                )}
              </Typography>
              <br></br>
              <Typography>
                <b>Description:</b> {t.description}
              </Typography>
            </CardContent>
          </Card>
        );
      });
  };

  const showCurrentSprint = () => {
    setTasksToDisplay(tasks.filter((t) => t.sprint && t.sprint.isActive));
  };

  const clearFilters = () => {
    setTasksToDisplay(tasks);
  };

  const getFilters = () => {
    return projectDetails.projectType === "SCRUM"
      ? getScrumFilters()
      : getKanbanFilters();
  };

  const getScrumFilters = () => {
    return (
      <>
        {getAssigneeFilters()}
        {getLabelFilters()}
        <Box className="sprintFilters">
          Sprints
          <Button onClick={showCurrentSprint}>Current Sprint</Button>
        </Box>
        <Box className="clearFilters">
          <Button onClick={clearFilters}>Clear</Button>
        </Box>
      </>
    );
  };

  const getKanbanFilters = () => {
    return (
      <>
        {getAssigneeFilters()}
        {getLabelFilters()}
        <Box className="clearFilters">
          <Button onClick={clearFilters}>Clear</Button>
        </Box>
      </>
    );
  };

  const getAssigneeFilters = () => {
    return (
      <Box className="assigneeFilters">
        Assignee:
        {usersInProject.map((u) => {
          return (
            <Button key={u.id} onClick={() => filterByAssignee(u.id)}>
              {u.label}
            </Button>
          );
        })}
      </Box>
    );
  };

  const getLabelFilters = () => {
    return (
      <Box className="labelFilters">
        Labels:
        {availableLabels.map((l, idx) => {
          return (
            <Button key={idx} onClick={() => filterByLabel(l)}>
              {l}
            </Button>
          );
        })}
      </Box>
    );
  };

  const filterByLabel = (label) => {
    setTasksToDisplay(
      tasks.filter((t) => t.labels && t.labels.includes(label))
    );
  };

  const filterByAssignee = (assigneeId) => {
    console.log("assigneeId ", assigneeId);
    console.log("tasksToDisplay ", tasksToDisplay);
    setTasksToDisplay(
      tasks.filter((t) => t.assignee && t.assignee.userId === assigneeId)
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
        <main className="dashboardDetails">
          <Card
            sx={{
              margin: "0 auto",
              bgcolor: "rgba(255,255,255,0.8)",
              width: { xs: "98%", md: "95%" },
            }}
          >
            <CardContent>
              {dashboardDetails && (
                <Typography variant="h5">{dashboardDetails.name}</Typography>
              )}
            </CardContent>
            <Box>{projectDetails && getFilters()}</Box>
          </Card>

          <Grid
            container
            flexDirection="row"
            spacing={1}
            sx={{
              margin: "20px auto 100px",
              backgroundColor: "rgb(240,240,240,0.8)",
              width: "95%",
            }}
          >
            {dashboardDetails &&
              dashboardDetails.columns.map((c) => {
                return (
                  <Grid item key={c} xs={12 / dashboardDetails.columns.length}>
                    <Typography>{c}</Typography>

                    {getTasksByColumn(c)}
                  </Grid>
                );
              })}
          </Grid>
        </main>
      )}
    </>
  );
};

export default DashboardDetails;
