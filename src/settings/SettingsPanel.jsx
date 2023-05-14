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

const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const SettingsPanel = () => {
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

  const [email, setEmail] = useState(user.userEmail || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const handleOldPasswordChange = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setOldPassword(value);
  };
  const handlePasswordChange = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setNewPassword(value);
  };

  const handlePassword2Change = (e) => {
    const { value } = e.target;
    setNewPassword2(value);
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
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

  const handleSubmitEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const url = `http://localhost:8080/api/v1/email/${user.userId}`;

    const requestParams = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        email: email,
        username: user.username,
      }),
    };

    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        console.log("data ", data);
        if (data.success) {
          sessionStorage.setItem("user", JSON.stringify(data));
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

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    if (!passwordRegex.test(newPassword)) {
      handleOpenAlert(
        "warning",
        "Password should has minimum eight letter, at least one special character, one number, one upper and one lower case!",
        4000
      );
      return;
    }

    setIsLoading(true);
    const url = `http://localhost:8080/api/v1/password/${user.userId}`;

    const requestParams = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        username: user.username,
        oldPassword: oldPassword,
        password: newPassword,
      }),
    };
    console.log(
      JSON.stringify({
        username: user.username,
        oldPassword: oldPassword,
        password: newPassword,
      })
    );
    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        console.log("data ", data);
        if (data.success) {
          sessionStorage.setItem("user", JSON.stringify(data));
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

  const handleUserDelete = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const url = `http://localhost:8080/api/v1/user/${user.userId}`;

    const requestParams = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        username: user.username,
      }),
    };

    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        console.log("data ", data);
        if (data.success) {
          sessionStorage.removeItem("user");
          navigate("/");
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

  const editEmailFormBody = (
    <form onSubmit={handleSubmitEmail}>
      <Grid container sx={{ marginTop: "20px" }}>
        <Grid item xs={10} md={8}>
          <TextField
            data-name="email"
            type="email"
            variant="outlined"
            color="primary"
            label="Email"
            value={email}
            onChange={handleEmailChange}
            required
            fullWidth
            sx={{ mb: 4 }}
          />
        </Grid>
        <Grid
          item
          xs={10}
          md={6}
          container
          justifyContent="center"
          alignItems="center"
          alignContent="flex-start"
        >
          <Button
            variant="outlined"
            type="submit"
            sx={{
              backgroundColor: "rgb(0,0,0,0.9)",
              color: "white",
              letterSpacing: "1px",
              display: "block",
              margin: { xs: "10px auto ", md: "10px auto 0 40px" },
              padding: "10px 60px ",
              "&:hover": {
                backgroundColor: "rgb(70, 86, 235)",
              },
            }}
          >
            Update
          </Button>
        </Grid>
      </Grid>
    </form>
  );

  const editPasswordFormBody = (
    <form onSubmit={handleSubmitPassword}>
      <Grid
        container
        justifyContent="flex-start"
        alignItems="flex-start"
        sx={{ marginTop: "10px" }}
      >
        <Grid item xs={10} md={8}>
          <TextField
            data-name="old-password"
            type="password"
            variant="outlined"
            color="primary"
            label="Previous Password"
            onChange={handleOldPasswordChange}
            value={oldPassword}
            required
            fullWidth
            sx={{ mb: 4 }}
          />
        </Grid>
        <Grid item xs={10} md={8}>
          <TextField
            data-name="password2"
            type="password"
            variant="outlined"
            color="primary"
            label="Confirm Password"
            onChange={handlePasswordChange}
            value={newPassword}
            required
            fullWidth
            sx={{ mb: 4 }}
          />
        </Grid>
        <Grid item xs={10} md={8}>
          <TextField
            data-name="password2"
            type="password"
            variant="outlined"
            color="primary"
            label="Confirm Password"
            onChange={handlePassword2Change}
            value={newPassword2}
            error={
              newPassword && newPassword2 && newPassword !== newPassword2
                ? true
                : false
            }
            helperText={
              newPassword && newPassword2 && newPassword !== newPassword2
                ? "Passwords do not match!"
                : ""
            }
            required
            fullWidth
            sx={{ mb: 4 }}
          />
        </Grid>
        <Grid
          item
          xs={10}
          md={6}
          container
          justifyContent="center"
          alignItems="center"
          alignContent="flex-start"
        >
          <Button
            variant="outlined"
            type="submit"
            sx={{
              backgroundColor: "rgb(0,0,0,0.9)",
              color: "white",
              letterSpacing: "1px",
              display: "block",
              margin: { xs: "10px auto ", md: "10px auto 0 40px" },
              padding: "10px 60px ",
              "&:hover": {
                backgroundColor: "rgb(70, 86, 235)",
              },
            }}
          >
            Change
          </Button>
        </Grid>
      </Grid>
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
          <Typography
            variant="h4"
            sx={{ padding: "5px 10%", textAlign: "left" }}
          >
            Settings
          </Typography>
          <Card
            sx={{
              margin: "1% auto",
              bgcolor: "rgba(255,255,255,0.99)",
              width: { xs: "90%", md: "80%" },
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                sx={{ textAlign: "left", fontSize: "1.5rem" }}
              >
                Update your email address
              </Typography>
              {editEmailFormBody}
            </CardContent>
          </Card>

          <Card
            sx={{
              margin: "1% auto",
              bgcolor: "rgba(255,255,255,0.99)",
              width: { xs: "90%", md: "80%" },
            }}
          >
            <CardContent>
              {" "}
              <Typography
                variant="h5"
                sx={{ textAlign: "left", fontSize: "1.5rem" }}
              >
                Set up new password
              </Typography>
              <Typography
                variant="h6"
                sx={{ textAlign: "left", fontSize: "1rem" }}
              >
                Follow the instructions below
              </Typography>
              {editPasswordFormBody}
            </CardContent>
          </Card>

          <Card
            sx={{
              margin: "1% auto",
              bgcolor: "rgba(255,255,255,0.99)",
              width: { xs: "90%", md: "80%" },
            }}
          >
            <CardContent sx={{ marginBottom: "5%" }}>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography
                    variant="h5"
                    sx={{ textAlign: "left", fontSize: "1.5rem" }}
                  >
                    Delete Account
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ textAlign: "left", fontSize: "1rem" }}
                  >
                    Delete your account and account data
                  </Typography>
                </Grid>
                <Grid item xs={10} md={6}>
                  <Button
                    variant="outlined"
                    type="submit"
                    onClick={handleUserDelete}
                    sx={{
                      backgroundColor: "rgb(0,0,0,0.9)",
                      color: "white",
                      letterSpacing: "1px",
                      display: "block",
                      margin: { xs: "10px auto ", md: "10px auto 0 40px" },
                      padding: "10px 60px ",
                      "&:hover": {
                        backgroundColor: "rgb(70, 86, 235)",
                      },
                    }}
                  >
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </main>
      )}
    </>
  );
};

export default SettingsPanel;
