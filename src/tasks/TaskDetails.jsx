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
import CloseIcon from "@mui/icons-material/Close";
import FormHelperText from "@mui/material/FormHelperText";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Link } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";

import PageLoader from "../loader/PageLoader";
import CustomAlert from "../alert/CustomAlert";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BugReportIcon from "@mui/icons-material/BugReport";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useNavigate, useLocation } from "react-router-dom";
import LinkedTaskForm from "./LinkedTaskForm";
import AttachmentForm from "./AttachmentForm";

const DEFAULT_STATUS = "New";
const TO_DO_STATUS = "To do";

const PRIORITIES = ["Low", "Medium", "High"];
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const TaskDetails = () => {
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [taskId, setTaskId] = useState(undefined);
  const [taskData, setTaskData] = useState(undefined);
  const [isEdit, setIsEdit] = useState(false);

  // alert params
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");

  const [fixVersionOptions, setFixVersionOptions] = useState([]);
  const [sprintOptions, setSprintOptions] = useState([]);

  // form params
  const [isTitleError, setIsTitleError] = useState(false);
  const [isTaskTypeError, setIsTaskTypeError] = useState(false);

  const [isKanban, setIsKanban] = useState(false);
  const [usersOptions, setUsersOptions] = useState([]);
  const [taskTypeStatuses, setTaskTypeStatuses] = useState([]);

  const [taskType, setTaskType] = useState(undefined);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [attachmentsToSave, setAttachmentsToSave] = useState([]);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentToSave, setCommentToSave] = useState("");

  const [dueDate, setDueDate] = useState(undefined);
  const [release, setRelease] = useState(undefined);
  const [priority, setPriority] = useState(undefined);
  const [isPriorityError, setIsPriorityError] = useState(false);
  const [status, setStatus] = useState("");
  const [labels, setLabels] = useState([]);
  const [labelTmp, setLabelTmp] = useState("");

  const [sprint, setSprint] = useState("");
  const [storyPoints, setStoryPoints] = useState(0);

  useEffect(() => {
    setTaskId(location.state.taskId);

    if (!user) {
      navigate("/login");
    }
    const getInitialInfo = async () => {
      setIsLoading(true);
      let data = await getTaskDetails(location.state.taskId);
      await getComments(location.state.taskId);
      await getAttachments(location.state.taskId);
      await getSprintOptions(data.project.id);

      await getUserAssignmentByProject(data.project.id, data);
      setIsLoading(false);
    };

    getInitialInfo();
  }, []);

  const getTaskDetails = (id) => {
    const url = `http://localhost:8080/api/v1/task/${id}`;
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
        console.log("data ", data);
        setTaskData(data);
        setOptions(data);
        return data;
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const getSprintOptions = (id) => {
    const url = `http://localhost:8080/api/v1/sprint/project/${id}`;
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
          let array = data.map((sp) => {
            let tmp = {
              id: sp.id,
              label: `${sp.sprintNumber} ${sp.startDate} - ${sp.endDate}`,
              name: `${sp.sprintNumber} ${sp.startDate} - ${sp.endDate}`,
              number: sp.sprintNumber,
              key: `${sp.sprintNumber} ${sp.startDate}-${sp.endDate}-${sp.projectId}=${sp.createdDate}`,
            };
            return tmp;
          });

          setSprintOptions(
            array.sort((a, b) => (a.number > b.number ? 1 : -1))
          );
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const getUserAssignmentByProject = (projectId, taskDataTmp) => {
    const url = `http://localhost:8080/api/v1/assignment/project/${projectId}`;
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
          let array = data.map((pa) => {
            let tmp = {
              id: pa.user.id,
              label: `${pa.user.firstName} ${pa.user.lastName}`,
              name: pa.user.email,
              key: pa.user.email,
            };
            return tmp;
          });
          setUsersOptions(
            array.sort((a, b) => -b.label.localeCompare(a.label))
          );
          if (taskDataTmp.assignee) {
            setAssignee(
              array.filter((a) => a.id === taskDataTmp.assignee.id)[0]
            );
          }
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const getComments = (id) => {
    const url = `http://localhost:8080/api/v1/comment/task/${id}`;
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
        setComments(
          data.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate))
        );
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const getAttachments = (id) => {
    const url = `http://localhost:8080/api/v1/file/task/${id}`;
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
        console.log("files ", data);
        if (data && data.length !== 0) {
          setAttachments(data);
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const setOptions = (data) => {
    setSprint(data.sprint ? data.sprint.id : undefined);

    let taskStatusesTmp = data.project.availableTaskTypes
      .filter((f) => f.name === data.type)
      .map((t) => t.availableTaskStatuses.map((s) => s.name));
    console.log("taskStatusesTmp ", [...new Set(taskStatusesTmp.flat())]);
    setTaskTypeStatuses([...new Set(taskStatusesTmp.flat())]);

    setIsKanban(data.project.projectType === "KANBAN");
    setTitle(data.name);
    setDescription(data.description);
    setTaskType(data.type);
    setStatus(data.status);
    console.log(
      "capitalizeFirstLetter(data.priority) ",
      capitalizeFirstLetter(data.priority)
    );
    setPriority(capitalizeFirstLetter(String(data.priority)));
    setLabels(data.labels);
    setStoryPoints(data.storyPoints);
    setDueDate(dayjs(data.dueDate));
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
  }

  const getTaskIcon = () => {
    switch (taskData.type) {
      case "Story":
        return <HistoryEduIcon sx={{ color: "green" }} />;
      case "Bug":
        return <BugReportIcon sx={{ color: "red" }} />;
      case "Defect":
        return <BugReportOutlinedIcon sx={{ color: "orange" }} />;
      case "Task":
        return <AssignmentIcon sx={{ color: "blue" }} />;
      case "Technical":
        return <AssignmentIcon sx={{ color: "grey" }} />;
      case "Team":
        return <Diversity3OutlinedIcon sx={{ color: "blue" }} />;
      case "Test":
        return <QuizOutlinedIcon sx={{ color: "green" }} />;
      default:
        return <AssignmentIcon sx={{ color: "blue" }} />;
    }
  };

  const getPriorityIcon = () => {
    switch (taskData.priority) {
      case "LOW":
        return <KeyboardArrowDownIcon sx={{ color: "blue" }} />;
      case "MEDIUM":
        return <MenuIcon sx={{ color: "#c36a2c" }} />;
      case "HIGH":
        return <KeyboardArrowUpIcon sx={{ color: "red" }} />;
    }
  };

  const addAttachments = (e) => {
    let tmp = [...attachmentsToSave, ...Array.from(e.target.files)];
    let names = tmp.map((f) => f.name);
    let result = tmp.filter((f, p) => names.indexOf(f.name) === p);

    if (result.length + attachments.length - attachmentsToDelete.length > 5) {
      handleOpenAlert("error", "Just 5 attachments allowed");
      return;
    }

    setAttachmentsToSave(result);
  };

  const handleDeleteAttachment = (id) => {
    console.log("handleDeleteAttachment ", id);
    const url = `http://localhost:8080/api/v1/file/${id}`;
    const requestParams = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        console.log("deleted ", data);
        if (data) {
          handleOpenAlert("success", "File deleted");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setIsTitleError(false);
  };

  const handleLabelTmpChange = (e) => {
    setLabelTmp(e.target.value);
  };
  const handleLabelsBlur = (e) => {
    console.log("handleLabelsBlur ", e);
    if (labelTmp === "" || labels.includes(labelTmp)) {
      return;
    }
    setLabels([...labels, labelTmp]);
    setLabelTmp("");
  };

  const handleDeleteLabel = (l) => {
    console.log("handleDeleteLabel ", l);
    setLabels(labels.filter((tmp) => tmp !== l));
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSprintChange = (e) => {
    let sp = sprintOptions.find((s) => s.id === e.target.value);
    setSprint(e.target.value);
  };

  const handleStoryPointsChange = (e) => {
    if (Number(e.target.value) % 1 !== 0) {
      handleOpenAlert("error", "Just integers allowed");
      return;
    }
    setStoryPoints(e.target.value);
  };

  const handleAddCommentChange = (e) => {
    setCommentToSave(e.target.value);
  };

  const handleAddComment = () => {
    if (commentToSave === "") {
      return;
    }
    setIsLoading(true);
    const commentPayload = {
      body: commentToSave,
      author: { id: user.userId },
      task: { id: taskId },
    };

    const url = `http://localhost:8080/api/v1/comment`;
    const requestParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(commentPayload),
    };

    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        console.log("handleAddComment data ", data);
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      })
      .finally(() => {
        setIsLoading(false);
        window.location.reload();
      });
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleSaveTaskDetails = () => {
    console.log("handleSaveTaskDetails");
    const taskUpdatePayload = prepareTaskUpdatePayload();

    const url = `http://localhost:8080/api/v1/task`;
    const requestParams = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: taskUpdatePayload,
    };

    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        console.log("handleSaveTaskDetails data ", data);
        if (data.id) {
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      })
      .finally(() => {
        setIsLoading(false);
        setIsEdit(false);
      });
  };

  const prepareTaskUpdatePayload = () => {
    let day = dueDate.$D < 10 ? `0${dueDate.$D}` : `${dueDate.$D}`;
    let month =
      dueDate.$M + 1 < 10 ? `0${dueDate.$M + 1}` : `${dueDate.$M + 1}`;
    let year = dueDate.$y;
    let dueDateFinal = `${year}-${month}-${day}`;

    let payload = {
      id: taskId,
      name: title,
      description: description,
      status: status,
      priority: priority.toUpperCase(),
      labels: labels,
      dueDate: dueDateFinal,
    };

    if (!isKanban) {
      payload.storyPoints = storyPoints;
      if (sprint) {
        payload.sprint = { id: sprint };
      }
    }
    if (assignee) {
      payload.assignee = { id: assignee.id };
    }

    console.log("payload ", payload);
    return JSON.stringify(payload);
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

  const handleAssigneeChange = (event, values) => {
    const { value } = event.target;
    const choice = usersOptions.find((u) => u.key === value);
    console.log("values ", values);
    setAssignee(values);
  };

  const handleDueDataChange = (date) => {
    setDueDate(date);
  };

  const navigateToTask = (taskId) => {
    if (!taskId) {
      return;
    }
    navigate("/task", { state: { taskId: taskId } });
  };

  const addRelatedTask = () => {
    console.log("addRelatedTask");
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
      {!isLoading && taskData && (
        <Card
          sx={{
            width: "90%",
            margin: "20px auto 100px",
            paddingLeft: "30px",
            textAlign: "left",
          }}
        >
          <CardContent>
            <Grid container>
              <Grid item xs={6}>
                {!isEdit && (
                  <Box>
                    <Typography variant="h6">
                      <b>Summary: </b>
                      {taskData.name}
                    </Typography>
                    <Typography variant="h6">
                      <b>Type: </b>
                      {taskData.type} {getTaskIcon()}
                    </Typography>
                    <Typography variant="h6">
                      <b>Status: </b>
                      {taskData.status}
                    </Typography>
                    <Typography variant="h6">
                      <b>Priority: </b>
                      {capitalizeFirstLetter(taskData.priority)}{" "}
                      {getPriorityIcon()}
                    </Typography>
                    <Typography variant="h6">
                      <b>Labels: </b>
                      {taskData.labels.length === 0 ? (
                        "-"
                      ) : (
                        <Grid container>
                          {labels.map((l) => (
                            <Grid
                              key={l}
                              item
                              xs={4}
                              sx={{
                                position: "relative",
                                margin: "10px 10px",
                                borderRadius: "50px",
                                backgroundColor: "rgb(240,240,240,0.8)",
                              }}
                            >
                              <MenuItem value={l}>{l}</MenuItem>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </Typography>
                    {!isKanban && (
                      <Typography variant="h6">
                        <b>Fix version: </b>
                        {taskData.sprint &&
                          taskData.sprint.release &&
                          taskData.sprint.release.fixVersion}
                      </Typography>
                    )}
                    {!isKanban && (
                      <Typography variant="h6">
                        <b>Story points: </b>
                        {taskData.storyPoints}
                      </Typography>
                    )}
                  </Box>
                )}
                {isEdit && (
                  <Box>
                    <form>
                      <TextField
                        data-name="title"
                        type="text"
                        variant="outlined"
                        color="primary"
                        label="Title"
                        onChange={handleTitleChange}
                        value={title}
                        required
                        error={isTitleError}
                        helperText={isTitleError ? "Complete this field" : ""}
                        sx={{ width: "80%", marginTop: "5px" }}
                      />

                      <FormControl sx={{ width: "80%", marginTop: "5px" }}>
                        <InputLabel id="demo-multiple-chip-label">
                          Status
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={status}
                          label="Status"
                          onChange={handleStatusChange}
                        >
                          {taskTypeStatuses.map((p) => (
                            <MenuItem key={p} value={p}>
                              {p}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl sx={{ width: "80%", marginTop: "5px" }}>
                        <InputLabel id="demo-multiple-chip-label">
                          Priority
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={priority}
                          label="Priority"
                          onChange={handlePriorityChange}
                        >
                          {PRIORITIES.map((p) => (
                            <MenuItem key={p} value={p}>
                              {p}
                            </MenuItem>
                          ))}
                        </Select>
                        {isPriorityError && (
                          <FormHelperText>Complete this field</FormHelperText>
                        )}
                      </FormControl>

                      <FormControl sx={{ width: "80%", marginTop: "5px" }}>
                        <TextField
                          data-name="Labels"
                          type="text"
                          variant="outlined"
                          color="primary"
                          label="Labels"
                          onChange={handleLabelTmpChange}
                          onBlur={handleLabelsBlur}
                          value={labelTmp}
                          sx={{ marginTop: "5px" }}
                        />
                        {labels.length !== 0 && (
                          <Grid container>
                            {labels.map((l) => (
                              <Grid
                                key={l}
                                item
                                xs={4}
                                sx={{
                                  position: "relative",
                                  margin: "10px 10px",
                                  borderRadius: "50px",
                                  backgroundColor: "rgb(240,240,240,0.8)",
                                }}
                              >
                                <MenuItem value={l}>{l}</MenuItem>
                                <CloseIcon
                                  sx={{
                                    cursor: "pointer",
                                    position: "absolute",
                                    top: "15%",
                                    right: "5%",
                                  }}
                                  onClick={() => handleDeleteLabel(l)}
                                ></CloseIcon>
                              </Grid>
                            ))}
                          </Grid>
                        )}
                      </FormControl>
                      {!isKanban && (
                        <TextField
                          data-name="title"
                          type="number"
                          variant="outlined"
                          color="primary"
                          label="Story Points"
                          onChange={handleStoryPointsChange}
                          InputProps={{
                            inputProps: { min: 0, max: 21, step: "1" },
                          }}
                          value={storyPoints}
                          disabled={isKanban}
                          helperText={
                            isKanban ? "Available just for Scrum projects" : ""
                          }
                          sx={{ width: "80%", marginTop: "5px" }}
                        />
                      )}
                    </form>
                  </Box>
                )}
              </Grid>
              <Grid item xs={5}>
                {!isEdit && (
                  <>
                    <Typography variant="h6">
                      <b>Assignee: </b>
                      {taskData.assignee
                        ? `${taskData.assignee.firstName} ${taskData.assignee.lastName}`
                        : "-"}
                    </Typography>
                    <Typography variant="h6">
                      <b>Reporter: </b>
                      {taskData.reporter
                        ? `${taskData.reporter.firstName} ${taskData.reporter.lastName}`
                        : "-"}
                    </Typography>
                    <Typography variant="h6">
                      <b>Due date: </b>
                      {taskData.dueDate}
                    </Typography>
                  </>
                )}
                {!isKanban && !isEdit && (
                  <Typography variant="h6" sx={{ marginTop: "50px" }}>
                    <b>Sprint: </b>
                    {taskData.sprint && taskData.sprint.sprintNumber}
                  </Typography>
                )}
                {isEdit && (
                  <Box>
                    <Autocomplete
                      value={assignee}
                      onChange={handleAssigneeChange}
                      id="checkboxes-tags-demo"
                      options={usersOptions}
                      getOptionLabel={(option) => {
                        if (!option || option.length === 0) {
                          return "";
                        }
                        return option.key;
                      }}
                      style={{ width: "90%" }}
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            label="Users"
                            placeholder="User"
                          />
                        );
                      }}
                    />

                    <Box sx={{ marginTop: "5px", width: "90%" }}>
                      <DatePicker
                        label="Due date"
                        value={dueDate}
                        onChange={handleDueDataChange}
                        format="DD-MM-YYYY"
                        minDate={dayjs(new Date().toISOString())}
                        sx={{ width: "100%" }}
                      />
                    </Box>
                    {!isKanban && (
                      <FormControl sx={{ marginTop: "5px", width: "90%" }}>
                        <InputLabel id="demo-multiple-chip-label">
                          Sprint
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={sprint}
                          label="Sprint"
                          disabled={isKanban}
                          onChange={handleSprintChange}
                        >
                          {sprintOptions.map((sp) => (
                            <MenuItem key={sp.key} value={sp.id}>
                              {sp.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                )}
              </Grid>
              <Grid item xs={1}>
                <Box sx={{ marginTop: "40px" }}>
                  {!isEdit && <Button onClick={handleEdit}>Edit</Button>}
                  {isEdit && (
                    <Button onClick={handleSaveTaskDetails}>Save</Button>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                {!isEdit && (
                  <Box
                    sx={{
                      marginTop: "20px",
                      padding: "10px 20px",
                      borderTop: "1px solid rgb(0,0,0,0.8)",
                    }}
                  >
                    <Typography component="div">
                      <b>Description: </b>
                    </Typography>
                    <Typography component="div">
                      {taskData.description}
                    </Typography>
                  </Box>
                )}

                {isEdit && (
                  <Box>
                    <Typography variant="h6">Description</Typography>

                    <form>
                      <TextField
                        data-name="description"
                        type="text"
                        variant="outlined"
                        color="primary"
                        label="Description"
                        onChange={handleDescriptionChange}
                        value={description}
                        placeholder="Description"
                        multiline
                        rows={4}
                        sx={{ width: "80%" }}
                      />
                    </form>
                  </Box>
                )}
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  borderTop: "1px solid rgb(0,0,0,0.8)",
                  position: "relative",
                }}
              >
                <LinkedTaskForm
                  projectId={taskData.project.id}
                  taskId={taskData.id}
                  blockedBy={taskData.blockedBy}
                ></LinkedTaskForm>
                <Typography
                  component="div"
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    if (!taskData.clonedFrom) return;
                    navigateToTask(taskData.clonedFrom.id);
                  }}
                >
                  <b>Cloned from: </b>
                  {taskData.clonedFrom && taskData.clonedFrom.name}
                </Typography>
                <Typography component="div">
                  <b>Blocked by: </b>
                  {taskData.blockedBy.map((b) => {
                    return (
                      <Typography
                        key={`${b.id}-${b.name}`}
                        component="div"
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          navigateToTask(b.id);
                        }}
                      >
                        {b.name}
                      </Typography>
                    );
                  })}
                </Typography>
              </Grid>
              <Grid item xs={6}></Grid>

              <Grid
                item
                xs={6}
                sx={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  borderTop: "1px solid rgb(0,0,0,0.8)",
                  position: "relative",
                }}
              >
                <AttachmentForm
                  count={attachments.length}
                  taskId={taskId}
                ></AttachmentForm>
                <Typography component="div">
                  <b>Attachments: </b>
                  {attachments && attachments.length !== 0 ? (
                    <div>
                      {attachments.map((file) => {
                        return (
                          <div key={file.name}>
                            <InsertDriveFileIcon />{" "}
                            <Link to={file.url}>{file.name} </Link>
                            <CloseIcon
                              sx={{ cursor: "pointer" }}
                              data-name={file.name}
                              onClick={() => handleDeleteAttachment(file.id)}
                            ></CloseIcon>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    undefined
                  )}
                </Typography>
              </Grid>
              <Grid item xs={6}></Grid>

              <Grid
                item
                xs={6}
                sx={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  borderTop: "1px solid rgb(0,0,0,0.8)",
                }}
              >
                <Typography component="div">
                  <b>Comments: </b>
                  {comments && comments.length !== 0 ? (
                    <Box
                      sx={{
                        padding: "5px 10px",
                        backgroundColor: "rgb(240,240,240,0.8)",
                      }}
                    >
                      {comments.map((comment) => {
                        return (
                          <Box
                            key={comment.id}
                            sx={{
                              marginTop: "2px",
                              borderTop: "1px solid white",
                            }}
                          >
                            {comment.body}
                            <Box sx={{ fontSize: "0.75rem" }}>
                              <span>
                                Author:{" "}
                                {`${comment.author.firstName} ${comment.author.lastName}`}
                              </span>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    undefined
                  )}
                  <form>
                    <TextField
                      data-name="Commment"
                      type="text"
                      variant="outlined"
                      color="primary"
                      label="Add Comment"
                      onChange={handleAddCommentChange}
                      value={commentToSave}
                      sx={{ width: "60%", marginTop: "5px" }}
                    />
                    {commentToSave !== "" && (
                      <Button onClick={handleAddComment}>Add</Button>
                    )}
                  </form>
                </Typography>
              </Grid>
              <Grid item xs={6}></Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default TaskDetails;
