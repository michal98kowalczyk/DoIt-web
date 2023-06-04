import React, { useEffect, useState } from "react";
import "./Dashboards.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import FormHelperText from "@mui/material/FormHelperText";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Grid from "@mui/material/Grid";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import PageLoader from "../loader/PageLoader";
import CustomAlert from "../alert/CustomAlert";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";

const Dashboards = () => {
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  // alert params
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");

  const [dashboards, setDashboards] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectsMap, setProjectsMap] = useState(new Map());

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    const getInitialInfo = async () => {
      setIsLoading(true);
      await getDashboards();
      setIsLoading(false);
    };

    getInitialInfo();
  }, []);

  const getDashboards = () => {
    const url = `http://localhost:8080/api/v1/dashboard/${user.userId}`;
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
          console.log("Dashboards ", data);
          setDashboards(data);
          setData(data);
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const setData = (data) => {
    let projectIds = new Set();

    let projectsTmp = data.map((d) => {
      projectIds.add(d.project.id);
      return d.project;
    });
    let result = [];
    for (let p of projectsTmp) {
      console.log("p ", p);
      if (projectIds.has(p.id)) {
        result.push(p);
        projectIds.delete(p.id);
      }
    }
    setProjects(result);
  };

  const navigateToDashboard = (id, projectId) => {
    console.log("navigate to dashboard ", id);
    navigate("/dashboard", {
      state: { dashboardId: id, projectId: projectId },
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

  const getProjectView = (p) => {
    return (
      <Accordion key={p.id}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6">{p.name}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: "rgb(245,245,245,0.9)" }}>
          {dashboards
            .filter((d) => d.project.id === p.id)
            .map((d, idx) => {
              console.log("#d ", d);
              return (
                <Grid
                  key={d.id}
                  container
                  sx={{
                    padding: "10px 20px",
                    "&:hover": { backgroundColor: "rgb(250,250,250,0.9)" },
                  }}
                >
                  <Grid item>
                    <Typography component="div">
                      {idx + 1}. {d.name}
                    </Typography>{" "}
                  </Grid>
                  <Grid item>
                    <Tooltip
                      title="Open"
                      data-dashboard={d.id}
                      sx={{ cursor: "pointer" }}
                    >
                      <OpenInNewIcon
                        onClick={() => navigateToDashboard(d.id, d.project.id)}
                      ></OpenInNewIcon>
                    </Tooltip>
                  </Grid>
                </Grid>
              );
            })}
        </AccordionDetails>
      </Accordion>
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
        <main className="dashboardsList">
          {projects.map((p) => getProjectView(p))}
        </main>
      )}
    </>
  );
};

export default Dashboards;
