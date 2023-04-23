import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";

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

const UserProfile = () => {
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  // alert params
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [email, setEmail] = useState(user.userEmail || "");
  const [userInfo, setUserInfo] = useState(user.info || "");

  const handleFirstNameChange = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setFirstName(value);
  };

  const handleLastNameChange = (e) => {
    const { value } = e.target;
    setLastName(value);
  };

  const handleUserInfoChange = (e) => {
    const { value } = e.target;
    setUserInfo(value);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const url = `http://localhost:8080/api/v1/user/${user.userId}`;

    const requestParams = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        userInfo: userInfo,
        email: user.userEmail,
      }),
    };

    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          sessionStorage.setItem("user", JSON.stringify(data));
          window.location.reload();
        } else {
          handleOpenAlert("error", data.errorMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        handleOpenAlert("error", error.message);
      })
      .finally(() => setIsLoading(false));
  };

  const editFormBody = (
    <form onSubmit={handleSubmit}>
      <TextField
        data-name="firstName"
        type="text"
        variant="outlined"
        color="primary"
        label="First Name"
        onChange={handleFirstNameChange}
        value={firstName}
        fullWidth
        required
        sx={{ mb: 4 }}
      />
      <TextField
        data-name="lastName"
        type="text"
        variant="outlined"
        color="primary"
        label="Last Name"
        onChange={handleLastNameChange}
        value={lastName}
        fullWidth
        required
        sx={{ mb: 4 }}
      />
      <TextField
        data-name="email"
        type="email"
        variant="outlined"
        color="primary"
        label="Email"
        value={email}
        disabled
        fullWidth
        required
        sx={{ mb: 4 }}
      />
      <TextField
        placeholder="Introduce yourself..."
        value={userInfo}
        onChange={handleUserInfoChange}
        multiline
        minRows={4}
        fullWidth
        sx={{ mb: 4 }}
      />

      {}
      <Button
        variant="outlined"
        type="submit"
        sx={{
          backgroundColor: "rgb(0,0,0,0.9)",
          color: "white",
          letterSpacing: "1px",
          display: "block",
          margin: "10px auto 0 ",
          padding: "10px 20px ",
          "&:hover": {
            backgroundColor: "rgb(70, 86, 235)",
          },
        }}
      >
        Update profile
      </Button>
    </form>
  );

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
      {user && (
        <main className="userProfile">
          <Card
            sx={{
              margin: "1% auto",
              bgcolor: "rgba(255,255,255,0.99)",
              width: { xs: "90%", md: "80%" },
              padding: "5% 5%",
            }}
          >
            <CardContent>
              <Box sx={{ flexGrow: 1 }}>
                <Grid
                  container
                  sx={{
                    justifyContent: { xs: "center", md: "flex-start" },
                    alignItems: { xs: "center", md: "flex-start" },
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={2}
                    container
                    justifyContent="center"
                    sx={{
                      marginBottom: "10px",
                    }}
                  >
                    <Avatar
                      alt={`${user.firstName} ${user.lastName}`}
                      src={user.photoUrl || "/static/images/avatar/2.jpg"}
                      sx={{ width: "10rem", height: "10rem" }}
                    ></Avatar>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={8}
                    container
                    flexDirection="column"
                    alignSelf="flex-end"
                    sx={{
                      margin: "20px auto 20px 30px",
                      height: "100%",
                      justifyContent: { xs: "center", md: "flex-end" },
                      alignItems: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <Typography
                      variant="h3"
                      component="div"
                      sx={{ fontSize: "2rem" }}
                    >
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ fontSize: "1.5rem" }}
                    >
                      {user.username}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                      marginTop: "20px",
                      paddingTop: "20px",
                      borderTop: "2px solid rgb(0, 0, 0)",
                    }}
                  >
                    <Typography component="div">{editFormBody}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </main>
      )}
    </>
  );
};

export default UserProfile;
