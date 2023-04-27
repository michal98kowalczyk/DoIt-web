import React from "react";
import "./Description.css";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

const Description = () => {
  return (
    <main className="aboutUs">
      <div className="aboutUsWrapper">
        <Typography
          variant="h6"
          sx={{ paddingTop: "10%", letterSpacing: "2px" }}
        >
          About us
        </Typography>
        <Typography
          variant="h2"
          sx={{ paddingTop: "2%", letterSpacing: "2px" }}
        >
          Planner
        </Typography>
        <Typography
          variant="h5"
          sx={{ paddingTop: "2%", letterSpacing: "2px" }}
        >
          Project management tool created for purpose of master degree thesis
          about project management methodologies like Scrum and Kanban.
        </Typography>
        <Typography
          variant="h6"
          sx={{ paddingTop: "1%", letterSpacing: "2px" }}
        >
          Feel free to verify this app.
        </Typography>
        <Typography
          variant="h6"
          sx={{ paddingTop: "1%", letterSpacing: "2px" }}
        >
          To explore available functionalities please refer to{" "}
          <Link className="documentationLink" to="/functionalities">
            documentation
          </Link>
          .
        </Typography>
        <Typography
          variant="h5"
          sx={{ paddingTop: "1%", letterSpacing: "2px" }}
        >
          Thank you!
        </Typography>
      </div>
    </main>
  );
};
export default Description;
