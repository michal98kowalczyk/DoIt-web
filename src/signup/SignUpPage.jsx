import React, { useState } from "react";
import PageLoader from "../loader/PageLoader";
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
import "./SignUpPage.css";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [terms, setTerms] = useState(false);

  const handleFirstNameChange = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setFirstName(value);
  };

  const handleLastNameChange = (e) => {
    const { value } = e.target;
    setLastName(value);
  };

  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setUsername(value);
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
  };

  const handlePassword2Change = (e) => {
    const { value } = e.target;
    setPassword2(value);
  };

  const handleTermsChange = (e) => {
    const { checked } = e.target;
    setTerms(checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("handleSubmit");
    const url = "http://localhost:8080/api/v1/auth/register";
    const requestParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
      }),
    };

    fetch(url, requestParams)
      .then((response) => response.json())
      .then((data) => {
        if (data.isSuccess) {
          sessionStorage.setItem("user", JSON.stringify(data));
          console.log(data);
          console.log(sessionStorage.getItem("user"));
          navigate("/");
          window.location.reload();
        } else {
          console.error("error ", data);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  const signUpFormBody = (
    <form onSubmit={handleSubmit}>
      <Stack
        spacing={2}
        direction={"row"}
        sx={{ marginBottom: 4, display: { xs: "none", md: "flex" } }}
      >
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
        />
      </Stack>

      {/* mobile stack  */}
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
        sx={{ mb: 4, display: { xs: "block", md: "none" } }}
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
        sx={{ mb: 4, display: { xs: "block", md: "none" } }}
      />
      {/* end of mmobile stact */}

      <TextField
        data-name="username"
        type="email"
        variant="outlined"
        color="primary"
        label="Username"
        onChange={handleUsernameChange}
        value={username}
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
        onChange={handleEmailChange}
        value={email}
        fullWidth
        required
        sx={{ mb: 4 }}
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
        sx={{ mb: 4 }}
      />
      <TextField
        data-name="password2"
        type="password"
        variant="outlined"
        color="primary"
        label="Confirm Password"
        onChange={handlePassword2Change}
        value={password2}
        error={password && password2 && password !== password2 ? true : false}
        helperText={
          password && password2 && password !== password2
            ? "Passwords do not match!"
            : ""
        }
        required
        fullWidth
        sx={{ mb: 4 }}
      />
      <FormControlLabel
        sx={{ display: "block" }}
        control={
          <Checkbox
            data-name="terms"
            required
            checked={terms}
            onChange={handleTermsChange}
          />
        }
        label="Agree to Terms and Conditions"
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
          padding: "10px 20px ",
          "&:hover": {
            backgroundColor: "rgb(70, 86, 235)",
          },
        }}
        disabled={isSubmitDisabled}
      >
        Register
      </Button>
    </form>
  );

  return (
    <>
      {isLoading && <PageLoader />}
      <main className="signup">
        <div className="signup-wrapper">
          <div className="signup-form">
            <Card
              sx={{
                margin: "0 auto",
                bgcolor: "rgba(255,255,255,0.8)",
                width: { xs: "80%", md: "60%" },
              }}
            >
              <CardContent>{signUpFormBody}</CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

export default SignUpPage;
