import React from "react";
import "./Functionalities.css";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";

const Functionalities = () => {
  return (
    <main className="documentation">
      <div className="documentationWrapper">
        <Typography
          variant="h3"
          sx={{ paddingTop: "2%", letterSpacing: "2px" }}
        >
          Documentation
        </Typography>
        <Typography
          variant="h6"
          sx={{ paddingTop: "1%", letterSpacing: "2px" }}
        >
          To access all features you need to be logged in.
        </Typography>
        <div className="documentationItems">
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6">Projects</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                You can create and set up two kind of projects - Kanban and
                Scrum. Project creator is available under "Create" tab, which
                you can find in the main menu (after you log in).
                <br />
                You need to fill all required details like name and available
                task types. There is also possibility to assign users to your
                project. For Scrum you can also add some details about first
                release and sprint.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6">Project details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                In projects tab you can display all projects, which are assigned
                to you. When you click on particular project you can explore all
                tasks and details about the project as well as create new task
                or assign new user.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6">Tasks</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Tasks can be created via "Create" tab, which you can find in the
                main menu (after you log in).
                <br />
                You can choose one of available task type. You need to fill all
                required details like name, status, priority etc. There is also
                possibility to assign directly user, but it's not required. For
                Scrum you can also assign sprint and release date.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6">Task details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Once you have some tasks created you can find them in tasks tab,
                as well as in your user home page (initial screen after log in).
                When you click on task, then task details page is opened and you
                can get more information about this particular task or edit
                them. On the bottom of the page placed is comment section, where
                you can put some additional info for your team members.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6">User settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Users can change their details in user profile, which is
                available in top right corner. They are able to add a profile
                photo. Add some description or change names details.
                <br />
                Users can also change their email or password in user settings,
                which is available in top right corner below the profile.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </main>
  );
};
export default Functionalities;
