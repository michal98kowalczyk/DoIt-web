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

import PageLoader from "../loader/PageLoader";
import CustomAlert from "../alert/CustomAlert";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";

const SprintForm = ({ projectId }) => {
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

  const [fixVersion, setFixVersion] = useState(dayjs(new Date().toISOString()));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    const getInitialInfo = async () => {
      setIsLoading(true);

      setIsLoading(false);
    };

    getInitialInfo();
  }, []);

  const createSprint = () => {
    const url = `http://localhost:8080/api/v1/sprint`;
    const payload = getSprintPayload();
    const requestParams = {
      method: "POST",
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
          handleOpenAlert("success", "Created");
          handleClose();
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const getSprintPayload = () => {
    let day = fixVersion.$D < 10 ? `0${fixVersion.$D}` : `${fixVersion.$D}`;
    let month =
      fixVersion.$M + 1 < 10 ? `0${fixVersion.$M + 1}` : `${fixVersion.$M + 1}`;
    let year = fixVersion.$y;
    let dateOfRelease = `${year}-${month}-${day}`;
    console.log("release datee ", dateOfRelease);
    const payload = {
      fixVersion: dateOfRelease,
      project: { id: projectId },
      isReleased: false,
    };
    console.log("payload ", payload);

    return JSON.stringify(payload);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    console.log("save sprint");
  };

  const handleChange = (date) => {
    setFixVersion(date);
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
      <>
        <Tooltip
          title="Create Sprint"
          onClick={handleClickOpen}
          sx={{ cursor: "pointer" }}
        >
          <AddIcon></AddIcon>
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
            {"Create Sprint"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ padding: "10px 10px", marginTop: "10px" }}>
              <DatePicker
                label="Fix version"
                value={fixVersion}
                onChange={handleChange}
                format="DD-MM-YYYY"
                minDate={dayjs(new Date().toISOString())}
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
    </>
  );
};

export default SprintForm;
