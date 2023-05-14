import React, { useEffect, useState } from "react";
import "./Projects.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
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
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tooltip from "@mui/material/Tooltip";
import PageLoader from "../loader/PageLoader";
import CustomAlert from "../alert/CustomAlert";
import LaunchIcon from "@mui/icons-material/Launch";
import PlaylistAddSharpIcon from "@mui/icons-material/PlaylistAddSharp";
import InputAdornment from "@mui/material/InputAdornment";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  // alert params
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");

  const [projects, setProjects] = useState([]);
  const [projectAssignment, setProjectAssignment] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectsFiltered, setProjectsFiltered] = useState([]);

  useEffect(() => {
    console.log("user ", user);
    if (!user) {
      navigate("/login");
    }
    const getInitialInfo = async () => {
      setIsLoading(true);

      await getProjects();
      await getProjectAssignment();

      setIsLoading(false);
    };

    getInitialInfo();
  }, []);

  const getProjects = () => {
    console.log("getProjects");

    const url = `http://localhost:8080/api/v1/project`;
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
          let tmp = data.sort((a, b) => -b.name.localeCompare(a.name));
          console.log(tmp);
          setProjects(tmp);
          setProjectsFiltered(tmp);
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const getProjectAssignment = () => {
    const url = `http://localhost:8080/api/v1/assignment/user/${user.userId}`;
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
          console.log("projectassignments ", data);
          setProjectAssignment(data);
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

  const handleProjectOpen = (projectId) => {
    navigate("/project", { state: { projectId: projectId } });
  };

  const handleProjectJoin = (projectId) => {
    handleOpenAlert("success", "Your request has been sent");
    console.log("join ", projectId);
  };

  const handleProjectDelete = (projectId) => {
    console.log("delete project ", projectId);
  };

  const isAssignedToProject = (p) => {
    const pa = projectAssignment.find((pa) => pa.project.id === p.id);
    return !!pa;
  };

  const handleProjectSearch = (e) => {
    const { value } = e.target;
    setProjectName(value);
    console.log("name ", value);
    let filtered = projects.filter((p) => p.name.includes(value));
    console.log("filtered ", filtered);
    setProjectsFiltered(filtered);
  };

  const handleClearSearch = (e) => {
    setProjectName("");
    setProjectsFiltered(projects);
  };

  const inputProp = {
    endAdornment: (
      <InputAdornment
        sx={{ cursor: "pointer" }}
        position="end"
        onClick={handleClearSearch}
      >
        <ClearSharpIcon />
      </InputAdornment>
    ),
  };

  const projectsListToDisplay = (
    <div>
      <Paper sx={{ marginTop: "1%" }}>
        {projectsFiltered.map((p, idx) => {
          return (
            // <ListItem sx={{ borderBottom: borderBtmStyle, cursor:"pointer" }}>
            //   <ListItemText primary={p.name} />
            // </ListItem>
            <Accordion key={idx}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon onClick={handleProjectOpen} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h6">{p.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container>
                  <Grid item xs={12} md={3}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: "bolder" }}>
                        Type:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {p.projectType ? p.projectType : ""}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: "bolder" }}>
                        Owner:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {p.owner
                          ? `${p.owner.firstName} ${p.owner.lastName}`
                          : ""}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box>
                      {isAssignedToProject(p) ? (
                        <Tooltip
                          title="Open"
                          onClick={() => handleProjectOpen(p.id)}
                          sx={{ cursor: "pointer" }}
                        >
                          <LaunchIcon />
                        </Tooltip>
                      ) : (
                        <Tooltip
                          title="Join"
                          onClick={() => handleProjectJoin(p.id)}
                          sx={{ cursor: "pointer" }}
                        >
                          <PlaylistAddSharpIcon />
                        </Tooltip>
                      )}
                    </Box>
                  </Grid>
                </Grid>

                {p.owner.id === user.userId && (
                  <Box sx={{ marginTop: "10px" }}>
                    <Button
                      variant="outlined"
                      type="submit"
                      data-project={p.id}
                      onClick={() => handleProjectDelete(p.id)}
                      sx={{ color: "black", borderColor: "black" }}
                    >
                      <Tooltip title="Delete">
                        <DeleteIcon />
                      </Tooltip>
                    </Button>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Paper>
    </div>
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
      <main className="projectsList">
        <div className="projectsListWrapper">
          <Typography
            variant="h6"
            sx={{ paddingTop: "1%", letterSpacing: "2px" }}
          >
            Explore projects
          </Typography>
          <Box>
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              value={projectName}
              onChange={handleProjectSearch}
              InputProps={projectName !== "" ? inputProp : {}}
            />
          </Box>
          {!projectsFiltered ||
          (projectsFiltered && projectsFiltered.length === 0) ? (
            <div>No projects found</div>
          ) : (
            projectsListToDisplay
          )}
        </div>
      </main>
    </>
  );
};

export default Projects;
