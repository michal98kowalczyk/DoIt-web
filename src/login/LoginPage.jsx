import React, { useState } from "react";
import PageLoader from "../loader/PageLoader";
import CustomAlert from "../alert/CustomAlert";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {
  TextField,
  Button,
  Container,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

const LoginPage = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  // alert params
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
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
    const url = "http://localhost:8080/api/v1/auth/authenticate";
    const requestParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };

    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        console.log("data ", data);
        if (data.success) {
          sessionStorage.setItem("user", JSON.stringify(data));
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

  const loginFormBody = (
    <form onSubmit={handleSubmit}>
      <TextField
        data-name="email"
        type="email"
        variant="outlined"
        color="primary"
        label="Email"
        onChange={handleEmailChange}
        value={email}
        fullWidth
        required
        sx={{ mb: 4, width: { xs: "90%", md: "55%" } }}
      />
      <TextField
        data-name="password"
        type="password"
        variant="outlined"
        color="primary"
        label="Password"
        onChange={handlePasswordChange}
        value={password}
        required
        fullWidth
        sx={{ mb: 4, width: { xs: "90%", md: "55%" } }}
      />

      <Button
        variant="outlined"
        type="submit"
        sx={{
          backgroundColor: "rgb(0,0,0,0.9)",
          color: "white",
          letterSpacing: "1px",
          display: "block",
          margin: "10px auto 0 ",
          padding: "10px 40px ",
          "&:hover": {
            backgroundColor: "rgb(70, 86, 235)",
          },
        }}
      >
        Login
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

      <main className="login">
        <div className="login-wrapper">
          <div className="login-form">
            <Card
              sx={{
                margin: "0 auto",
                bgcolor: "rgba(255,255,255)",
                width: { xs: "80%", md: "60%", padding: "30px" },
              }}
            >
              <Typography
                variant="h4"
                component="div"
                sx={{ paddingTop: "30px", marginTop: "20px" }}
              >
                Welcome to Planer
              </Typography>
              <Typography variant="h6" component="div" sx={{}}>
                To get started, please sign in
              </Typography>
              <CardContent>{loginFormBody}</CardContent>
              <Typography
                variant="h9"
                component="div"
                sx={{ paddingBottom: "30px", marginTop: "20px" }}
              >
                Don't have an account?{" "}
                <Link to="/signup" className="link-underline">
                  Sign up
                </Link>{" "}
              </Typography>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
