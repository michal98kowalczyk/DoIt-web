import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import {
  TextField,
  Button,
  Container,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import PageLoader from "../loader/PageLoader";
import CustomAlert from "../alert/CustomAlert";

import "./Create.css";

import { useNavigate } from "react-router-dom";
import ProjectCreator from "./ProjectCreator";
import TaskCreator from "./TaskCreator";

const projectOptions = ["Kanban", "Scrum"];
const taskOptions = ["Task", "Bug", "Story"];
const Create = () => {
  const [isLoading, setIsLoading] = useState(false);
  // alert params

  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");

  const [choiceName, setChoiceName] = useState(undefined);
  const [choiceType, setChoiceType] = useState(undefined);

  const handleChooseOption = (e) => {
    const { name, type } = e.target.dataset;
    setChoiceName(name);
    setChoiceType(type);
  };

  const handleCloseCreator = () => {
    setChoiceName(undefined);
    setChoiceType(undefined);
  };

  const displayChoice = () => {
    switch (choiceType) {
      case "project":
        return <ProjectCreator type={choiceName} close={handleCloseCreator} />;
      case "task":
        return <TaskCreator type={choiceName} close={handleCloseCreator} />;
    }
  };

  const projectsToDisplay = (
    <>
      {" "}
      <Typography variant="h4" sx={{ marginLeft: "20px", marginTop: "20px" }}>
        Projects
      </Typography>
      <Grid container>
        {projectOptions.map((option) => (
          <Grid key={option} item xs={12} md={12 / (projectOptions.length * 2)}>
            <Paper
              data-name={option}
              data-type="project"
              onClick={handleChooseOption}
              elevation={1}
              sx={{
                padding: "20px 40px",
                margin: "20px 20px",
                cursor: "pointer",
                transition: ".2",
                letterSpacing: "2px",
                fontWeight: "bolder",
                "&:hover": {
                  backgroundColor: "rgb(250,250,250)",
                  border: "1px solid rgb(37, 129, 250)",
                },
              }}
            >
              <AddIcon
                data-name={option}
                data-type="project"
                sx={{ dispaly: "inline-flex", verticalAlign: "top" }}
              ></AddIcon>{" "}
              <span data-name={option} data-type="project">
                {option}
              </span>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );

  const tasksToDisplay = (
    <>
      {" "}
      <Typography variant="h4" sx={{ marginLeft: "20px", marginTop: "10px" }}>
        Tasks
      </Typography>
      <Grid container>
        {taskOptions.map((option) => (
          <Grid key={option} item xs={12} md={12 / (taskOptions.length * 2)}>
            <Paper
              data-name={option}
              data-type="task"
              onClick={handleChooseOption}
              elevation={1}
              sx={{
                padding: "20px 40px",
                margin: "20px 20px",
                cursor: "pointer",
                transition: ".2",
                letterSpacing: "2px",
                fontWeight: "bolder",
                "&:hover": {
                  backgroundColor: "rgb(250,250,250)",
                  border: "1px solid rgb(37, 129, 250)",
                },
              }}
            >
              <AddIcon
                data-name={option}
                data-type="task"
                sx={{ dispaly: "inline-flex", verticalAlign: "top" }}
              ></AddIcon>{" "}
              <span data-name={option} data-type="task">
                {option}
              </span>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );

  const optionsToDisplay = (
    <main className="createOptions">
      <Box sx={{ marginLeft: "5%" }}>
        {projectsToDisplay}
        {tasksToDisplay}
      </Box>
    </main>
  );

  return <>{choiceName && choiceType ? displayChoice() : optionsToDisplay}</>;
};

export default Create;
