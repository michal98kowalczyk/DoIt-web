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
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PageLoader from "../loader/PageLoader";
import CustomAlert from "../alert/CustomAlert";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AttachmentForm = ({ count, taskId }) => {
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

  const [attachments, setAttachments] = useState([]);

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
    addAttachment();
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

  const handleUpload = (e) => {
    let tmp = [...attachments, ...Array.from(e.target.files)];
    let names = tmp.map((f) => f.name);
    let result = tmp.filter((f, p) => names.indexOf(f.name) == p);

    if (result.length + count > 5) {
      handleOpenAlert("error", "Just 5 attachments allowed");
      return;
    }

    setAttachments(result);
  };

  const handleDeleteAttachment = (e) => {
    const { name } = e.target.dataset;
    setAttachments(attachments.filter((f) => f.name !== name));
  };

  const addAttachment = () => {
    if (!attachments || attachments.length === 0) {
      return;
    }
    setIsLoading(true);
    const url = "http://localhost:8080/api/v1/files";
    let data = new FormData();
    for (let i = 0; i < attachments.length; i++) {
      data.append("files", attachments[i]);
    }
    data.append("user", user.userId);
    data.append("task", taskId);

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          navigate("/");
        } else {
          handleOpenAlert("error", data);
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
          title={"Upload"}
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
            {"Upload files"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ padding: "10px 10px", marginTop: "10px" }}>
              <div>
                {attachments && attachments.length !== 0 ? (
                  <div>
                    {attachments.map((file) => {
                      return (
                        <div key={file.name}>
                          <InsertDriveFileIcon /> {file.name}{" "}
                          <CloseIcon
                            sx={{ cursor: "pointer" }}
                            data-name={file.name}
                            onClick={handleDeleteAttachment}
                          ></CloseIcon>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  undefined
                )}
                <Button
                  variant="contained"
                  component="label"
                  sx={{ marginTop: "5px" }}
                >
                  Upload File
                  <input type="file" onChange={handleUpload} hidden multiple />
                </Button>
              </div>
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

export default AttachmentForm;
