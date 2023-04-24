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

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const ProjectCreator = ({ type, close }) => {
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
  const [userOptions, setUserOptions] = useState([]);

  // form params
  const [isError, setIsError] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [taskType, setTaskType] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    setIsLoading(true);

    getTaskTypesOptions();

    getUsersOptions();

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

  const getUsersOptions = () => {
    const url = "http://localhost:8080/api/v1/users";
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
          let array = data.map((user) => {
            let tmp = {
              id: user.userId,
              label: `${user.firstName} ${user.lastName}`,
              name: user.userEmail,
              key: user.userEmail,
            };
            return tmp;
          });
          setUserOptions(array.sort((a, b) => -b.label.localeCompare(a.label)));
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    setActiveStep(0);
  };

  const handleNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleTaskTypeChange = (event) => {
    const { value } = event.target;
    console.log("handleTaskTypeChange value ", value);
    setTaskType(typeof value === "string" ? value.split(",") : value);
    // On autofill we get a stringified value.
    //   typeof value === 'string' ? value.split(',') : value,
  };

  const handleUserChange = (event, values) => {
    console.log("handleUserChange  event.target values", values);

    console.log("handleUserChange  event.target ", event.target);

    const { value } = event.target;
    console.log("handleUserChange value ", value);
    console.log("userOptions ", userOptions);
    const choice = userOptions.find((u) => u.key === value);
    console.log("choice ", choice);
    setUsers(values.sort((a, b) => -b.label.localeCompare(a.label)));
    // setUsers(
    //   [...users, choice].sort((a, b) => -b.label.localeCompare(a.label))
    // );
    // On autofill we get a stringified value.
    //   typeof value === 'string' ? value.split(',') : value,
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
      label: <Typography variant="h6">Project type</Typography>,
      body: (
        <form>
          <TextField
            data-name="type"
            type="text"
            disabled
            variant="outlined"
            color="primary"
            label="Project type"
            value={type}
            required
            sx={{ width: "80%" }}
          />
        </form>
      ),
    },
    {
      label: <Typography variant="h6">Project name</Typography>,
      body: (
        <form>
          <TextField
            data-name="name"
            type="text"
            variant="outlined"
            color="primary"
            label="Project name"
            onChange={handleNameChange}
            value={projectName}
            required
            error={isError && !projectName}
            helperText={isError ? "Complete this field" : ""}
            sx={{ width: "80%" }}
          />
        </form>
      ),
    },
    {
      label: <Typography variant="h6">Task types</Typography>,
      body: (
        <div>
          <FormControl sx={{ m: 1, width: "80%" }}>
            <InputLabel id="demo-multiple-chip-label">Tasks</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              error={isError && !taskType}
              multiple
              required
              value={taskType}
              onChange={handleTaskTypeChange}
              input={<OutlinedInput id="select-multiple-chip" label="Tasks" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {taskTypeOptions.map((task) => (
                <MenuItem key={task.name} value={task.name}>
                  {task.name}
                </MenuItem>
              ))}
            </Select>
            {isError && !taskType && (
              <FormHelperText>Complete this field</FormHelperText>
            )}
          </FormControl>
        </div>
      ),
    },
    {
      label: <Typography variant="h6">Users</Typography>,
      body: (
        <Autocomplete
          multiple
          value={users}
          onChange={handleUserChange}
          id="checkboxes-tags-demo"
          options={userOptions}
          disableCloseOnSelect
          getOptionLabel={(option) => option.key}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.label} <br />
              {option.key}
            </li>
          )}
          style={{ width: "90%" }}
          renderInput={(params) => {
            console.log("params", params);
            return <TextField {...params} label="Users" placeholder="User" />;
          }}
        />
      ),
    },
  ];

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
          Project Creator
        </Typography>{" "}
        <Card
          variant="outlined"
          sx={{ margin: "1% auto", width: "90%", position: "relative" }}
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
            <Box sx={{ maxWidth: { sx: "90%", md: "60%" }, margin: "0 auto" }}>
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
                    All steps completed - confirm to create project.
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

export default ProjectCreator;
