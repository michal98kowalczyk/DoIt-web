import React from "react";
import { Link } from "react-router-dom";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
const LogOutPage = () => {
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
          <Typography variant="h3" component="div" sx={{ fontSize: "1.5rem" }}>
            <Typography
              variant="h3"
              component="span"
              sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
            >
              All done!!!{" "}
            </Typography>
            Have a nice day!
          </Typography>
          <Typography variant="h5" component="div">
            A bit more to do?{" "}
            <Button
              variant="outlined"
              sx={{
                backgroundColor: "rgb(0,0,0,0.9)",
                color: "white",
                letterSpacing: "1px",
                display: "block",
                margin: "10px auto 0 ",
                padding: "5px 10px ",
                "&:hover": {
                  backgroundColor: "rgb(70, 86, 235)",
                },
              }}
            >
              <Link to="/login" className="settings">
                Login
              </Link>
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </main>
  );
};

export default LogOutPage;
