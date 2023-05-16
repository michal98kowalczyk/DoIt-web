import React, { useEffect, useState } from "react";
import "./Projects.css";
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

import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BugReportIcon from "@mui/icons-material/BugReport";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useNavigate, useLocation } from "react-router-dom";

const ProjectDetails = () => {
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  const location = useLocation();
  const navigate = useNavigate();

  const [projectId, setProjectId] = useState(undefined);
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
    if (!user) {
      navigate("/login");
    }
    const getInitialInfo = async () => {
      setIsLoading(true);

      const tmpAssignemnt = await getProjectAssignmentDetails(
        location.state.projectId
      );
      await getTasks(location.state.projectId, tmpAssignemnt);

      setIsLoading(false);
    };

    getInitialInfo();
  }, []);

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

          prepareTasksToDisplay(data, sprintsTmp, tmpAssignemnt);
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const prepareTasksToDisplay = (tasksTmp, sprintsTmp, tmpAssignemnt) => {
    if (!tmpAssignemnt) {
      return;
    }
    let tmp = new Map();
    if (tmpAssignemnt.project.projectType === "KANBAN") {
      tmp.set("Backlog", tasksTmp);
    } else {
      for (let s of sprintsTmp) {
        let tasksBySprint = tasksTmp.filter(
          (t) => t.sprint && t.sprint.id === s.id
        );
        tmp.set(`Sprint ${s.sprintNumber}`, tasksBySprint);
      }
      let backlog = tasksTmp.filter((t) => !t.sprint);
      tmp.set("Backlog", backlog);
    }

    setTasksToDisplay(tmp);
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

  const scrumActions = (
    <>
      <Box>
        <Button
          variant="text"
          type="submit"
          onClick={() => navigateToReleases()}
          sx={{
            color: "black",
            borderColor: "black",
            textDecoration: "underline",
          }}
        >
          Releases
        </Button>
        <ReleaseForm projectId={projectId}></ReleaseForm>
        <Button
          variant="text"
          type="submit"
          onClick={() => navigateToSprints()}
          sx={{
            color: "black",
            borderColor: "black",
            textDecoration: "underline",
            marginLeft: "30px",
          }}
        >
          Sprints
        </Button>
        <SprintForm projectId={projectId}></SprintForm>
      </Box>
    </>
  );
  const kanbanActions = <></>;

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

  const getTasksListView = () => {
    let views = [];
    let keys = tasksToDisplay.keys();
    for (let k of keys) {
      let tList = tasksToDisplay.get(k);
      views.push(createSingleView(k, tList));
    }
    return views;
  };

  const createSingleView = (key, tList) => {
    return (
      <Box key={key}>
        <Typography
          key={key}
          variant="h5"
          sx={{ marginTop: "1%", paddingLeft: "3%" }}
        >
          {key}
        </Typography>
        {tList.map((t, idx) => {
          const assigneName =
            t.assignee && `${t.assignee.firstName} ${t.assignee.lastName}`;

          return (
            <Card
              key={`${key}-${idx}`}
              sx={{ margin: "5px 3% 1px", padding: "2px" }}
            >
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={1} sx={{ textAlign: "center" }}>
                  <Box>{getTaskIcon(t)}</Box>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="h7">{t.name}</Typography>
                </Grid>
                <Grid item xs={8} sx={{ textAlign: "right" }}>
                  <Grid item>
                    <Box>
                      <Tooltip title={`Priority ${t.priority.toLowerCase()}`}>
                        {getPriorityIcon(t)}
                      </Tooltip>
                    </Box>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={1}
                  sx={{ textAlign: "right" }}
                  container
                  direction="row"
                >
                  <Grid item>
                    {projectAssignment.project.projectType === "SCRUM" && (
                      <Box>
                        <Tooltip title="Story points">
                          <IconButton sx={{ fontSize: "0.75rem" }}>
                            SP:{t.storyPoints}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Grid>
                  {t.assignee && (
                    <Grid item>
                      <Tooltip title={assigneName}>
                        <IconButton>
                          <Avatar
                            sx={{
                              maxWidth: "20px",
                              maxHeight: "20px",
                              fontSize: "0.75rem",
                            }}
                            alt={assigneName}
                            src="/static/images/avatar/2.jpg"
                          />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  )}
                </Grid>

                <Grid
                  item
                  xs={1}
                  sx={{
                    textAlign: "right",
                    paddingRight: "3px",
                    cursor: "pointer",
                  }}
                >
                  <Tooltip title="Open" data-task={t.id}>
                    <OpenInNewIcon
                      onClick={() => navigateToTask(t.id)}
                    ></OpenInNewIcon>
                  </Tooltip>
                </Grid>
              </Grid>
            </Card>
          );
        })}
      </Box>
    );
  };

  const taskList = (
    <Box sx={{ marginBottom: "100px" }}>{getTasksListView()}</Box>
  );

  const notFound = (
    <Box>
      <Typography variant="h6" sx={{ textAlign: "center" }}>
        Your backlog is empty.
      </Typography>
    </Box>
  );

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
      <main className="projectDetails">
        <Card
          sx={{
            margin: "0 auto",
            bgcolor: "rgba(255,255,255,0.8)",
            width: { xs: "98%", md: "95%" },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              paddingLeft: "5%",
              marginTop: "20px",
              textAlign: "left",
              position: "relative",
            }}
          >
            <ArrowBackIcon
              onClick={handleBackToProjects}
              sx={{
                position: "absolute",
                top: "1%",
                left: "1%",
                cursor: "pointer",
              }}
            ></ArrowBackIcon>
            {projectAssignment && projectAssignment.project.name}
          </Typography>
          <CardContent>
            {projectAssignment &&
            projectAssignment.project.projectType === "SCRUM" &&
            projectAssignment.accessLevel === "MANAGE"
              ? scrumActions
              : kanbanActions}
          </CardContent>
        </Card>

        {tasks.length === 0 ? notFound : taskList}
      </main>
    </>
  );
};

export default ProjectDetails;
