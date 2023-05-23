import React, { useEffect, useState } from "react";
import "./Release.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Tooltip from "@mui/material/Tooltip";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PageLoader from "../loader/PageLoader";
import CustomAlert from "../alert/CustomAlert";

import { useNavigate, useLocation } from "react-router-dom";
import ReleaseForm from "./ReleaseForm";

const ReleaseList = () => {
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [projectId, setProjectId] = useState(undefined);
  const [projectAssignment, setProjectAssignment] = useState(undefined);

  // alert params
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");

  const [releases, setReleases] = useState([]);
  const [releasesNotCompletedFinal, setReleasesNotCompletedFinal] = useState(
    []
  );
  const [releasesCompletedFinal, setReleasesCompletedFinal] = useState([]);

  const [sprints, setSprints] = useState([]);
  const [sprintsToDisplay, setSprintsToDisplay] = useState(new Map());
  const [sprintsToDisplayCompleted, setSprintsToDisplayCompleted] = useState(
    new Map()
  );

  useEffect(() => {
    setProjectId(location.state.projectId);

    if (!user) {
      navigate("/login");
    }
    const getInitialInfo = async () => {
      setIsLoading(true);
      await getProjectAssignmentDetails(location.state.projectId);
      const sprintsData = await getSprints(location.state.projectId);
      const releasesData = await getReleases(
        location.state.projectId,
        sprintsData
      );
      setIsLoading(false);
    };

    getInitialInfo();
  }, []);

  const getProjectAssignmentDetails = (projectId) => {
    const url = `http://localhost:8080/api/v1/assignment/project/${projectId}/user/${user.userId}`;
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
          setProjectAssignment(data);
        }
        return data;
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const getSprints = (projectId) => {
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
        data.sort((a, b) => (b.sprintNumber < a.sprintNumber ? 1 : -1));
        if (data && data.length != 0) {
          console.log("#MK1 sprints ", data);
          setSprints(data);
        }
        return data;
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const getReleases = (projectId, sprintsData) => {
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
        data.sort((a, b) => new Date(a.fixVersion) - new Date(b.fixVersion));
        if (data && data.length != 0) {
          console.log("#MK1 releases ", data);
          setReleases(data);
          prepareSprintsToDisplay(data, sprintsData);
        }
        return data;
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const prepareSprintsToDisplay = (releases, sprintsData) => {
    let releasesNotCompleted = releases.filter((s) => !s.isReleased);
    let releasesCompleted = releases.filter((s) => s.isReleased);
    setReleasesNotCompletedFinal(releasesNotCompleted);
    setReleasesCompletedFinal(releasesCompleted);

    let sprintsNotCompletedMap = new Map();
    let sprintsCompletedMap = new Map();
    for (let r of releasesNotCompleted) {
      let sprintsByRelease = sprintsData.filter((s) => s.release.id === r.id);
      sprintsNotCompletedMap.set(`${r.fixVersion}`, sprintsByRelease);
    }

    for (let r of releasesCompleted) {
      let sprintsByRelease = sprintsData.filter((s) => s.release.id === r.id);
      sprintsCompletedMap.set(`${r.fixVersion}`, sprintsByRelease);
    }

    console.log("sprintsNotCompletedMap ", sprintsNotCompletedMap);
    console.log("sprintsCompletedMap ", sprintsCompletedMap);

    setSprintsToDisplay(sprintsNotCompletedMap);
    setSprintsToDisplayCompleted(sprintsCompletedMap);
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

  const handleReleaseComplete = (releaseId) => {
    console.log("handleReleaseComplete ", releaseId);
    const url = `http://localhost:8080/api/v1/release/complete/${releaseId}`;
    const requestParams = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          handleOpenAlert("success", "Release completed");
          window.location.reload();
        } else {
          handleOpenAlert(
            "error",
            "Release cannot be completed, please review all details and try again"
          );
        }
        return data;
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      });
  };

  const getUnCompletedReleasesView = () => {
    let views = [];
    let keys = sprintsToDisplay.keys();
    let isFirst = true;
    for (let k of keys) {
      let sprintsList = sprintsToDisplay.get(k);
      views.push(createSingleView(k, sprintsList, false, isFirst));
      isFirst = false;
    }
    return views;
  };

  const getCompletedReleasesView = () => {
    let views = [];
    let keys = sprintsToDisplayCompleted.keys();
    let isFirst = true;
    for (let k of keys) {
      let sprintsList = sprintsToDisplayCompleted.get(k);
      views.push(createSingleView(k, sprintsList, true, isFirst));
      isFirst = false;
    }
    return views;
  };

  const createSingleView = (releaseDate, sprintsList, isReleased, isFirst) => {
    let releaseDetails = releases.filter(
      (r) => r.fixVersion === releaseDate
    )[0];
    console.log("releaseDetails ", releaseDetails);
    return (
      <Accordion key={releaseDate}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6">{releaseDate}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: "rgb(245,245,245,0.9)" }}>
          <Box className="releaseActions" sx={{ textAlign: "left" }}>
            <Grid container direction="row" justifyItems="start">
              {!isReleased && isFirst && !releaseDetails.isReleased && (
                <Grid item sx={{ paddingRight: "20px" }}>
                  <Tooltip
                    title="Complete"
                    onClick={() => handleReleaseComplete(releaseDetails.id)}
                    sx={{ cursor: "pointer" }}
                  >
                    <CheckCircleOutlineIcon></CheckCircleOutlineIcon>
                  </Tooltip>
                </Grid>
              )}

              {!isReleased && (
                <Grid item>
                  <ReleaseForm
                    projectId={projectId}
                    isEdit={true}
                    iFixVersion={releaseDetails.fixVersion}
                    releaseId={releaseDetails.id}
                  ></ReleaseForm>
                </Grid>
              )}
            </Grid>
          </Box>

          <Box className="sprints">
            {sprintsList.map((sp, idx) => {
              return (
                <Card key={idx} sx={{ margin: "5px 3% 1px", padding: "2px" }}>
                  <Grid
                    container
                    direction="row"
                    justifyItems="start"
                    sx={{ padding: "10px 20px" }}
                  >
                    <Grid item>
                      <Box>
                        <Typography
                          component="span"
                          sx={{ fontWeight: "bold", padding: "5px 10px" }}
                        >
                          Sprint number:
                        </Typography>
                        <Typography
                          component="span"
                          sx={{ padding: "5px 5px" }}
                        >
                          {sp.sprintNumber}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box>
                        <Typography
                          component="span"
                          sx={{ fontWeight: "bold", padding: "5px 10px" }}
                        >
                          Start date:
                        </Typography>
                        <Typography
                          component="span"
                          sx={{ padding: "5px 5px" }}
                        >
                          {sp.startDate}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box>
                        <Typography
                          component="span"
                          sx={{ fontWeight: "bold", padding: "5px 10px" }}
                        >
                          End date:
                        </Typography>
                        <Typography
                          component="span"
                          sx={{ padding: "5px 5px" }}
                        >
                          {sp.endDate}
                        </Typography>
                      </Box>
                    </Grid>
                    {sp.isActive && (
                      <Grid item>
                        <Box>
                          <Typography
                            component="span"
                            sx={{ fontWeight: "bold", padding: "5px 10px" }}
                          >
                            Status:
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ padding: "5px 5px" }}
                          >
                            Active
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    {sp.isCompleted && (
                      <Grid item>
                        <Box>
                          <Typography
                            component="span"
                            sx={{ fontWeight: "bold", padding: "5px 10px" }}
                          >
                            Status:
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ padding: "5px 5px" }}
                          >
                            Completed
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Card>
              );
            })}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
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
        <main className="releasesList">
          <div className="releasesNotCompleted">
            <Box
              sx={{
                marginTop: "40px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  paddingTop: "1%",
                  letterSpacing: "2px",
                  textAlign: "left",
                  paddingLeft: "2%",
                }}
              >
                UnReleased
              </Typography>
              {!releasesNotCompletedFinal ||
              (releasesNotCompletedFinal &&
                releasesNotCompletedFinal.length === 0) ? (
                <Typography
                  variant="h8"
                  component="div"
                  sx={{
                    paddingTop: "1%",
                    letterSpacing: "2px",
                    textAlign: "left",
                    paddingLeft: "2%",
                  }}
                >
                  You have no release to complete.
                </Typography>
              ) : (
                <Box sx={{ width: "98%", margin: "0 auto" }}>
                  {getUnCompletedReleasesView()}
                </Box>
              )}
            </Box>
          </div>
          <div className="releasesCompleted">
            <Box
              sx={{
                marginTop: "40px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  paddingTop: "1%",
                  letterSpacing: "2px",
                  textAlign: "left",
                  paddingLeft: "2%",
                }}
              >
                Released
              </Typography>
              {!releasesCompletedFinal ||
              (releasesCompletedFinal &&
                releasesCompletedFinal.length === 0) ? (
                <Typography
                  variant="h8"
                  component="div"
                  sx={{
                    paddingTop: "1%",
                    letterSpacing: "2px",
                    textAlign: "left",
                    paddingLeft: "2%",
                  }}
                >
                  You have no release completed
                </Typography>
              ) : (
                <Box sx={{ width: "98%", margin: "0 auto" }}>
                  {getCompletedReleasesView()}
                </Box>
              )}
            </Box>
          </div>
        </main>
      )}
    </>
  );
};

export default ReleaseList;
