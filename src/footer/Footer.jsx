import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

import CopyrightIcon from "@mui/icons-material/Copyright";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Typography from "@mui/material/Typography";

const githubLink = "https://github.com/michal98kowalczyk";
const linkedIdLink = "https://www.linkedin.com/in/michal98kowalczyk/";
const authorName = "Michał Kowalczyk";

const Footer = () => {
  return (
    <footer>
      <div className="copyrights">
        <CopyrightIcon /> <span>{authorName}</span>
        <Link to={githubLink} target="_blank">
          <GitHubIcon sx={{ color: "aliceblue" }} />
        </Link>
        <Link to={linkedIdLink} target="_blank">
          <LinkedInIcon sx={{ color: "aliceblue" }} />
        </Link>
      </div>
    </footer>
  );
};
export default Footer;
