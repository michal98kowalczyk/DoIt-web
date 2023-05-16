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

import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BugReportIcon from "@mui/icons-material/BugReport";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useNavigate, useLocation } from "react-router-dom";

const TasksList = ({ sprint, tasks, projectAssignment }) => {
  console.log("key1 ", sprint);
  console.log("tasks ", tasks);
  console.log("projectAssignment ", projectAssignment);

  const navigate = useNavigate();

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
      {tasks.map((t, idx) => {
        const assigneName =
          t.assignee && `${t.assignee.firstName} ${t.assignee.lastName}`;

        return (
          <Card
            key={`${sprint}-${idx}`}
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
    </>
  );
};

export default TasksList;
