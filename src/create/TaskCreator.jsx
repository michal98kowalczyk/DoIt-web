import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CloseIcon from "@mui/icons-material/Close";
import FormHelperText from "@mui/material/FormHelperText";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
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

import { useNavigate } from "react-router-dom";

const DEFAULT_STATUS = "New";
const TO_DO_STATUS = "To do";

const PRIORITIES = ["Low", "Medium", "High"];
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const TaskCreator = ({ type, close }) => {
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  // alert params
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");

  const [taskTypeOptions, setTaskTypeOptions] = useState([]);

  const [usersOptions, setUsersOptions] = useState([]);
  const [projectsOptions, setProjectsOptions] = useState([]);
  const [projectsAssignmentData, setProjectsAssignmentData] = useState([]);
  const [priorityOptions, setPriorityOptions] = useState(PRIORITIES);

  const [fixVersionOptions, setFixVersionOptions] = useState([]);
  const [sprintOptions, setSprintOptions] = useState([]);

  // form params
  const [isTitleError, setIsTitleError] = useState(false);
  const [isTaskTypeError, setIsTaskTypeError] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [isKanban, setIsKanban] = useState(false);

  const [taskType, setTaskType] = useState(type ? type : "Task");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const [dueDate, setDueDate] = useState(undefined);
  const [release, setRelease] = useState(undefined);
  const [priority, setPriority] = useState(PRIORITIES[0]);
  const [isPriorityError, setIsPriorityError] = useState(false);
  const [status, setStatus] = useState(
    type === "Task" ? TO_DO_STATUS : DEFAULT_STATUS
  );

  const [sprint, setSprint] = useState("");
  const [storyPoints, setStoryPoints] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    setIsLoading(true);

    getTaskTypesOptions();
    getProjectOptions();

    setIsLoading(false);
  }, []);

  const getTaskTypesOptions = () => {
    const url = "http://localhost:8080/api/v1/tasktype";
    const requestParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length != 0) {
          let array = data.map((task) => {
            let tmp = { id: task.id, label: task.name, name: task.name };
            return tmp;
          });
          setTaskTypeOptions(
            array.sort((a, b) => -b.label.localeCompare(a.label))
          );
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const getProjectOptions = () => {
    const url = `http://localhost:8080/api/v1/assignment/user/${user.userId}`;
    const requestParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length != 0) {
          setProjectsAssignmentData(data);
          let tmpProjects = data.map((pa) => {
            let tmp = {
              id: pa.project.id,
              label: pa.project.name,
              name: pa.project.name,
              key: `${pa.project.id} ${pa.project.name}`,
            };
            return tmp;
          });
          setProjectsOptions(tmpProjects);
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    if (activeStep === 1 && (isTaskTypeError || !projectName)) {
      handleOpenAlert("warning", "To continue you need to choose project!");
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleTaskTypeChange = (event) => {
    const { value } = event.target;
    setTaskType(value);
    setIsTaskTypeError(false);
  };

  const handleProjectChange = async (event) => {
    const { value } = event.target;
    let pa = projectsAssignmentData.filter((p) => p.project.id === value);
    setIsTaskTypeError(false);

    if (pa.length != 0) {
      let t = pa[0].project.availableTaskTypes.find((t) => t.name === taskType);
      setProjectName(value);

      if (t) {
        await getUserAssignmentByProject(value);
        await getSprintsByProject(value);
        setIsKanban(pa[0].project.projectType === "KANBAN");
        setIsTaskTypeError(false);
      } else {
        setIsTaskTypeError(true);
      }
    }
  };

  const getUserAssignmentByProject = (projectId) => {
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
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const getSprintsByProject = (projectId) => {
    const url = `http://localhost:8080/api/v1/sprint/project/${projectId}`;
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

  const handleAssigneeChange = (event, values) => {
    const { value } = event.target;
    const choice = usersOptions.find((u) => u.key === value);
    setAssignee(values);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setIsTitleError(false);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const handleStoryPointsChange = (e) => {
    if (Number(e.target.value) % 1 !== 0) {
      handleOpenAlert("error", "Just integers allowed");
      return;
    }
    setStoryPoints(e.target.value);
  };

  const handleSprintChange = (e) => {
    let sp = sprintOptions.find((s) => s.id === e.target.value);
    setSprint(e.target.value);
  };

  const handleUpload = (e) => {
    let tmp = [...attachments, ...Array.from(e.target.files)];
    let names = tmp.map((f) => f.name);
    let result = tmp.filter((f, p) => names.indexOf(f.name) == p);

    if (result.length > 5) {
      handleOpenAlert("error", "Just 5 attachments allowed");
      return;
    }

    setAttachments(result);
  };

  const addAttachment = (taskId) => {
    if (!attachments || attachments.length === 0) {
      handleOpenAlert("success", "Task created successfully");
      navigate("/");
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

    return fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          handleOpenAlert("success", "Task created successfully");
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

  const handleDeleteAttachment = (e) => {
    const { name } = e.target.dataset;
    setAttachments(attachments.filter((f) => f.name !== name));
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

  const steps = [
    {
      label: <Typography variant="h6">Task type</Typography>,
      body: (
        <div>
          <FormControl sx={{ m: 1, width: "50%" }}>
            <InputLabel id="demo-multiple-chip-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={taskType}
              disabled={!!type}
              label="Task type"
              onChange={handleTaskTypeChange}
            >
              {taskTypeOptions.map((task) => (
                <MenuItem key={task.name} value={task.name}>
                  {task.name}
                </MenuItem>
              ))}
            </Select>
            {isTaskTypeError && (
              <FormHelperText>Complete this field</FormHelperText>
            )}
          </FormControl>
        </div>
      ),
    },
    {
      label: <Typography variant="h6">Project</Typography>,
      body: (
        <div>
          <FormControl sx={{ m: 1, width: "50%" }}>
            <InputLabel id="demo-multiple-chip-label">Project</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={projectName}
              label="Project"
              onChange={handleProjectChange}
            >
              {projectsOptions.map((project) => (
                <MenuItem key={project.key} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
            {isTaskTypeError && (
              <FormHelperText>
                This task type is not supported within this project.
              </FormHelperText>
            )}
          </FormControl>
        </div>
      ),
    },
    {
      label: <Typography variant="h6">Title</Typography>,
      body: (
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
            sx={{ width: "80%" }}
          />
        </form>
      ),
    },
    {
      label: <Typography variant="h6">Description</Typography>,
      body: (
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
      ),
    },
    {
      label: <Typography variant="h6">Assignee</Typography>,
      body: (
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
            return <TextField {...params} label="Users" placeholder="User" />;
          }}
        />
      ),
    },
    {
      label: <Typography variant="h6">Priority</Typography>,
      body: (
        <div>
          <FormControl sx={{ m: 1, width: "80%" }}>
            <InputLabel id="demo-multiple-chip-label">Priority</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={priority}
              label="Priority"
              onChange={handlePriorityChange}
            >
              {priorityOptions.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
            {isPriorityError && (
              <FormHelperText>Complete this field</FormHelperText>
            )}
          </FormControl>
        </div>
      ),
    },
    {
      label: <Typography variant="h6">Sprint</Typography>,
      body: (
        <div>
          <FormControl sx={{ m: 1, width: "50%" }}>
            <InputLabel id="demo-multiple-chip-label">Sprint</InputLabel>
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
            {isKanban && (
              <FormHelperText>Available just for Scrum projects</FormHelperText>
            )}
          </FormControl>
        </div>
      ),
    },
    {
      label: <Typography variant="h6">Story Points</Typography>,
      body: (
        <form>
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
            helperText={isKanban ? "Available just for Scrum projects" : ""}
            sx={{ width: "80%" }}
          />
        </form>
      ),
    },
    {
      label: <Typography variant="h6">Attachments</Typography>,
      body: (
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
      ),
    },
  ];

  const handleSubmit = () => {
    if (!title || title === "") {
      setIsTitleError(true);
      setActiveStep(2);
      return;
    }

    const taskRequest = prepareTaskRequest();
    createTask(taskRequest);
  };

  const prepareTaskRequest = () => {
    const payload = {
      name: title,
      description: description,
      type: taskType,
      status: status,
      priority: String(priority).toUpperCase(),
      project: { id: projectName },
      reporter: { id: user.userId },
    };
    if (assignee && assignee.length !== 0) {
      payload.assignee = { id: assignee.id };
    }
    if (!isKanban) {
      if (sprint) {
        payload.sprint = { id: sprint };
      }
      if (storyPoints) {
        payload.storyPoints = storyPoints;
      }
    }
    return JSON.stringify(payload);
  };

  const createTask = (taskPayload) => {
    const url = "http://localhost:8080/api/v1/task";
    const requestParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: taskPayload,
    };
    setIsLoading(true);
    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        if (!data.errorMessage || data.errorMessage === "") {
          return data.id;
        } else {
          handleOpenAlert("error", data.errorMessage);
          return null;
        }
      })
      .then((taskId) => (taskId !== null ? addAttachment(taskId) : null))
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
      <main className="projectCreator">
        <Typography
          variant="h4"
          sx={{ marginLeft: "20px", marginTop: "20px", letterSpacing: "2px" }}
        >
          Task Creator
        </Typography>{" "}
        <Card
          variant="outlined"
          sx={{ margin: "1% auto 5%", width: "90%", position: "relative" }}
        >
          <CloseIcon
            onClick={close}
            sx={{
              position: "absolute",
              top: "1%",
              right: "1%",
              cursor: "pointer",
            }}
          ></CloseIcon>
          <CardContent>
            <Box
              sx={{
                maxWidth: { sx: "90%", md: "60%" },
                margin: "0 auto",
              }}
            >
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={`${step.label}-${index}`}>
                    <StepLabel>{step.label}</StepLabel>
                    <StepContent>
                      <Typography variant="div">{step.body}</Typography>
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            {index === steps.length - 1 ? "Finish" : "Continue"}
                          </Button>
                          <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Back
                          </Button>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                  <Typography>
                    All steps completed - confirm to create task.
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Create
                      </Button>
                      <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                        Back
                      </Button>
                    </div>
                  </Box>
                </Paper>
              )}
            </Box>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default TaskCreator;
