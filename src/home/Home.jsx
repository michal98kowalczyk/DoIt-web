import React, { useState, useEffect } from "react";
import PageLoader from "../loader/PageLoader";
import "./Home.css";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

import { Link } from "react-router-dom";

const timelineItemStyle = { color: "black", fontWeight: "bolder" };

const timeline = (
  <Timeline
    position="alternate"
    sx={{ position: "absolute", bottom: "3%", right: "15%" }}
  >
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot variant="outlined" />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={timelineItemStyle}>Requirements</TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot variant="outlined" sx={timelineItemStyle} />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={timelineItemStyle}>Design</TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot variant="outlined" />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={timelineItemStyle}>Implementation</TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot variant="outlined" />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={timelineItemStyle}>Verification</TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot variant="outlined" />
      </TimelineSeparator>
      <TimelineContent sx={timelineItemStyle}>Maintenance</TimelineContent>
    </TimelineItem>
  </Timeline>
);

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const homeBody = (
    <main className="home">
      <div className="wrapperHome">
        <section className="image">{timeline}</section>
        <div className="join">
          <Typography
            variant="h4"
            sx={{
              mr: 2,
              fontFamily: "monospace",
              letterSpacing: ".1rem",
              color: "inherit",
              paddingBottom: "10px",
              marginBottom: "10px",
              textDecoration: "none",
            }}
          >
            The best project management tool
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mr: 2,
              fontFamily: "monospace",
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Want to drive efficiency across your organization? Planer is
            flexible and easy for all teams to use, so you can deliver quality
            work together, faster.
          </Typography>

          <Box sx={{ textAlign: "center" }}>
            <Button
              sx={{
                my: 2,
                color: "white",
                padding: 0,
                display: "inline-block",
                textAlign: "center",
                backgroundColor: "rgb(0,0,0,0.9)",
                marginTop: "20px",
                transition: 0.1,
                "&:hover": {
                  backgroundColor: "rgb(70, 86, 235)",
                },
              }}
            >
              <Link className="joinUs" to="/signup">
                Join us!
              </Link>
            </Button>
          </Box>
        </div>
      </div>
    </main>
  );

  return <>{isLoaded ? homeBody : <PageLoader />}</>;
};
export default Home;
