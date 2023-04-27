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
        <Link className="footerLinks" to={githubLink} target="_blank">
          <GitHubIcon sx={{ color: "aliceblue", marginTop: "5px" }} />
        </Link>
        <Link className="footerLinks" to={linkedIdLink} target="_blank">
          <LinkedInIcon sx={{ color: "aliceblue", marginTop: "5px" }} />
        </Link>
      </div>
    </footer>
  );
};
export default Footer;
