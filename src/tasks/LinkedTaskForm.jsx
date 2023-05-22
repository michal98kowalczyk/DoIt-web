import React, { useEffect, useState } from "react";
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
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";

import PageLoader from "../loader/PageLoader";
import CustomAlert from "../alert/CustomAlert";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const LinkedTaskForm = ({ projectId, taskId, blockedBy }) => {
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = React.useState(false);

  // alert params
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");

  const [blockedByTasks, setBlockedByTasks] = useState(
    blockedBy ? blockedBy : []
  );
  const [tasksOptions, setTasksOptions] = useState([]);
  const [action, setAction] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    const getInitialInfo = async () => {
      setIsLoading(true);
      await getTasksOptions(projectId);
      setIsLoading(false);
    };

    getInitialInfo();
  }, []);

  const getTasksOptions = (projectId) => {
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
          console.log("tasks options ", data);
          setTasksOptions(data);
        }
        return data;
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const setLinkedTasks = () => {
    const url = `http://localhost:8080/api/v1/task/blocked/${taskId}`;
    console.log(
      "blocked By ",
      blockedByTasks.map((t) => t.id)
    );
    const requestParams = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(blockedByTasks.map((t) => t.id)),
    };

    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        console.log("blocked  ", data);
        if (data) {
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const cloneIssue = () => {
    const url = `http://localhost:8080/api/v1/task/clone/${taskId}`;
    const userPayload = { id: user.userId };
    console.log("userPayload ", userPayload);
    const requestParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(userPayload),
    };

    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          console.log("data.id ", data.id);
          navigateToTask(data.id);
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const navigateToTask = (id) => {
    navigate("/task", { state: { taskId: id } });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    console.log("action ", action);
    if (action === "clone") {
      cloneIssue();
    } else {
      setLinkedTasks();
    }
  };

  const handleChange = (date) => {
    console.log("handleChange");
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

  const handleActionChange = (event) => {
    setAction(event.target.value);
  };

  const handleBlockedByChange = (e, values) => {
    console.log("handleBlockedByChange ", values);
    setBlockedByTasks(values);
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
      <>
        <Tooltip
          title={"Link issue"}
          onClick={handleClickOpen}
          sx={{
            position: "absolute",
            top: "1%",
            right: "1%",
            cursor: "pointer",
          }}
        >
          {<AddIcon></AddIcon>}
        </Tooltip>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ padding: "30px 50px" }}
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{ borderBottom: "1px solid rgba(0,0,0,0.5)" }}
          >
            {"Link issue"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ padding: "10px 10px", marginTop: "10px" }}>
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  Action
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={action}
                  onChange={handleActionChange}
                >
                  <FormControlLabel
                    value="clone"
                    control={<Radio />}
                    label="Clone"
                  />
                  <FormControlLabel
                    value="addBlocked"
                    control={<Radio />}
                    label="Add Blocked By"
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            {action === "addBlocked" && (
              <Box sx={{ padding: "10px 10px", marginTop: "10px" }}>
                <Typography variant="h6">Choose blocked by issues</Typography>
                <Autocomplete
                  multiple
                  value={blockedByTasks}
                  onChange={handleBlockedByChange}
                  id="checkboxes-tags-demo"
                  options={tasksOptions}
                  disableCloseOnSelect
                  getOptionLabel={(option) => `${option.id}-${option.name}`}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.name}
                    </li>
                  )}
                  style={{ width: "90%" }}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        label="Tasks"
                        placeholder="blocked by"
                      />
                    );
                  }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} autoFocus>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </>
  );
};

export default LinkedTaskForm;
