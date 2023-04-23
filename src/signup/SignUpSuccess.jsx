import React from "react";
import { Link } from "react-router-dom";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Typography from "@mui/material/Typography";

const SignUpSuccess = () => {
  return (
    <main>
      <Card
        sx={{
          margin: "1% auto",
          bgcolor: "rgba(255,255,255,0.99)",
          width: { xs: "80%", md: "40%" },
          padding: "5% 5%",
        }}
      >
        <CardContent>
          <Typography variant="h3" component="div" sx={{ fontSize: "2rem" }}>
            Thank you for registering!!!
          </Typography>
          <CheckCircleOutlineIcon
            sx={{
              color: "green",
              width: "10%",
              height: "10%",
              margin: "10px auto",
            }}
          />
          <Typography variant="h5" component="div">
            Click{" "}
            <Link to="/login" className="link-underline">
              here
            </Link>{" "}
            to login.
          </Typography>
        </CardContent>
      </Card>
    </main>
  );
};

export default SignUpSuccess;
