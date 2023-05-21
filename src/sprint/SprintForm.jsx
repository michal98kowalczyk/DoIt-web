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
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import PageLoader from "../loader/PageLoader";
import CustomAlert from "../alert/CustomAlert";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";

const SprintForm = ({
  projectId,
  iStartDate,
  iEndDate,
  releaseId,
  isEdit,
  sprintId,
}) => {
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

  const [releaseOptions, setReleaseOptions] = useState([]);

  const [startDate, setStartDate] = useState(
    iStartDate ? dayjs(iStartDate) : dayjs(new Date().toISOString())
  );
  const [endDate, setEndDate] = useState(
    iEndDate ? dayjs(iEndDate) : dayjs(new Date().toISOString())
  );
  const [release, setRelease] = useState(releaseId ? releaseId : []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    const getInitialInfo = async () => {
      setIsLoading(true);
      await getReleaseOptions();
      setIsLoading(false);
    };

    getInitialInfo();
  }, []);

  const getReleaseOptions = () => {
    const url = `http://localhost:8080/api/v1/release/project/${projectId}`;
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
        if (data.length !== 0) {
          setReleaseOptions(data.filter((r) => !r.isReleased));
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const createSprint = () => {
    const url = `http://localhost:8080/api/v1/sprint`;
    const payload = getSprintPayload();

    const requestParams = {
      method: isEdit ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: payload,
    };

    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          handleOpenAlert("success", isEdit ? "Updated" : "Created");
          handleClose();
          if (isEdit) {
            window.location.reload();
          }
        } else if (data.errorMessage) {
          handleOpenAlert("error", data.errorMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const getSprintPayload = () => {
    let startDateFinal = getStartDateFinal();
    let endDateFinal = getEndDateFinal();

    const payload = {
      project: { id: projectId },
      release: { id: release },
      startDate: startDateFinal,
      endDate: endDateFinal,
      isActive: false,
      isCompleted: false,
    };
    if (isEdit) {
      payload.id = sprintId;
    }
    return JSON.stringify(payload);
  };

  const getStartDateFinal = () => {
    let day = startDate.$D < 10 ? `0${startDate.$D}` : `${startDate.$D}`;
    let month =
      startDate.$M + 1 < 10 ? `0${startDate.$M + 1}` : `${startDate.$M + 1}`;
    let year = startDate.$y;
    let startDateFinal = `${year}-${month}-${day}`;
    return startDateFinal;
  };

  const getEndDateFinal = () => {
    let day = endDate.$D < 10 ? `0${endDate.$D}` : `${endDate.$D}`;
    let month =
      endDate.$M + 1 < 10 ? `0${endDate.$M + 1}` : `${endDate.$M + 1}`;
    let year = endDate.$y;
    let endDateFinal = `${year}-${month}-${day}`;
    return endDateFinal;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    console.log("release ", release);
    if (!release || release.length === 0) {
      handleOpenAlert("error", "Choose fix version");
      return;
    }
    createSprint();
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleReleaseChange = (event) => {
    const { value } = event.target;
    setRelease(value);
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
        <>
          <Tooltip
            title={isEdit ? "Edit Sprint" : "Create Sprint"}
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
              {isEdit ? "Edit Sprint" : "Create Sprint"}
            </DialogTitle>
            <DialogContent>
              <FormControl
                sx={{ width: "100%", padding: "10px 10px", marginTop: "10px" }}
              >
                <InputLabel id="demo-multiple-chip-label">
                  Fix version
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={release}
                  label="Fix version"
                  onChange={handleReleaseChange}
                >
                  {releaseOptions.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.fixVersion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ padding: "10px 10px", marginTop: "10px" }}>
                <DatePicker
                  label="Start date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  format="DD-MM-YYYY"
                  minDate={dayjs(new Date().toISOString())}
                />
              </Box>
              <Box sx={{ padding: "10px 10px", marginTop: "10px" }}>
                <DatePicker
                  label="End date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  format="DD-MM-YYYY"
                  minDate={startDate}
                />
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
      )}
    </>
  );
};

export default SprintForm;
