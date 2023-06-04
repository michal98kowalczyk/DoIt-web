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
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import FormHelperText from "@mui/material/FormHelperText";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

import PageLoader from "../loader/PageLoader";
import CustomAlert from "../alert/CustomAlert";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";

const DashboardForm = ({ isKanban, projectId, isEdit }) => {
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
  const [projectInfo, setProjectInfo] = useState(undefined);

  const [columnsOptions, setColumnsOptions] = useState([]);
  const [usersOptions, setUsersOptions] = useState([]);

  const [filterOptions, setFilterOptions] = useState(
    isKanban ? ["ASSIGNEE", "LABEL"] : ["ASSIGNEE", "LABEL", "RELEASE"]
  );

  const [name, setName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    const getInitialInfo = async () => {
      setIsLoading(true);
      await getProjectInfo();
      setIsLoading(false);
    };

    getInitialInfo();
  }, []);

  const getProjectInfo = () => {
    const url = `http://localhost:8080/api/v1/project/${projectId}`;
    const requestParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    console.log("projectId ", projectId);
    return fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        setProjectInfo(data);
        setOptions(data);
        console.log("project info ", data);
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const setOptions = (data) => {
    let taskStatusesTmp = data.availableTaskTypes.map((t) =>
      t.availableTaskStatuses.map((s) => s.name)
    );
    console.log("setColumnsOptions ", [...new Set(taskStatusesTmp.flat())]);
    setColumnsOptions([...new Set(taskStatusesTmp.flat())]);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    console.log("handleSave");
    if (!name || columns.length === 0) {
      handleOpenAlert("error", "Complete all fields");
      return;
    }
    createDashboard();
  };

  const navigateToDashboards = () => {
    navigate("/dashboards");
  };

  const createDashboard = () => {
    const url = `http://localhost:8080/api/v1/dashboard`;
    const dashboardPayload = {
      name: name,
      project: {
        id: projectId,
      },
      columns: columns,
    };
    console.log("dashboardPayload ", dashboardPayload);
    const requestParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(dashboardPayload),
    };

    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        console.log("dashboard created ", data);
        if (data.id) {
          console.log("navigate");
          handleOpenAlert("success", "Dashboard created");
          navigateToDashboards();
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

  const handleColumnChange = (event) => {
    const { value } = event.target;
    setColumns(value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
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
          title={isEdit ? "Edit Dashboard" : "Create Dashboard"}
          onClick={handleClickOpen}
          sx={{ cursor: "pointer" }}
        >
          {isEdit ? <Button>Edit</Button> : <AddIcon></AddIcon>}
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
            {isEdit ? "Edit Dashboard" : "Create Dashboard"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ padding: "10px 10px", marginTop: "10px" }}>
              <TextField
                data-name="name"
                type="text"
                variant="outlined"
                color="primary"
                label="Name"
                onChange={handleNameChange}
                value={name}
                required
                sx={{ width: "80%" }}
              />
              <FormControl sx={{ marginTop: "10px", width: "80%" }}>
                <InputLabel id="demo-multiple-chip-label">Columns</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  required
                  value={columns}
                  onChange={handleColumnChange}
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Columns" />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {columnsOptions.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Be careful - sequence is important
                </FormHelperText>
              </FormControl>
            </Box>
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

export default DashboardForm;
