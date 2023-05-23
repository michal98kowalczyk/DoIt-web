import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { Link } from "react-router-dom";
import "./Header.css";

const pages = ["Start", "About", "Functions"];
const pagesPaths = new Map([
  ["Start", "/"],
  ["About", "/description"],
  ["Functions", "/functionalities"],
  ["LogIn", "/login"],
  ["SignUp", "/signup"],
]);
const settings = ["LogIn", "SignUp"];

const HeaderLoggedOut = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  useEffect(() => {}, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (event) => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (event) => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      sx={{
        bgcolor: "rgb(0,0,0,0.08)",
        borderBottom: "2px solid rgb(0,0,0,0.4)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <EventNoteIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Planner
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {/* mobile view */}
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={handleCloseNavMenu}
                  color="black"
                  sx={{ padding: 0 }}
                >
                  <Typography textAlign="center" sx={{ width: "100%" }}>
                    <Link className="nav mobile" to={pagesPaths.get(page)}>
                      {page}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}

              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  sx={{
                    marginBottom: "5px",
                    padding: 0,
                    transition: 0.1,
                    "&:hover": {
                      backgroundColor: "rgb(70, 86, 235)",
                    },
                  }}
                  onClick={handleCloseNavMenu}
                >
                  <Button
                    fullWidth={true}
                    sx={{ backgroundColor: "rgb(0,0,0,0.9)", display: "block" }}
                  >
                    <Link
                      className="settings mobile"
                      to={pagesPaths.get(setting)}
                    >
                      {setting}
                    </Link>
                  </Button>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <EventNoteIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Planner
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "black", display: "block", padding: 0 }}
              >
                <Link className="nav" to={pagesPaths.get(page)}>
                  {page}
                </Link>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
            {settings.map((setting) => (
              <Button
                key={setting}
                data-key={setting}
                onClick={handleCloseUserMenu}
                sx={{
                  my: 2,
                  color: "white",
                  padding: 0,
                  display: "block",
                  backgroundColor: "rgb(0,0,0,0.9)",
                  marginRight: "20px",
                  transition: 0.1,
                  "&:hover": {
                    backgroundColor: "rgb(70, 86, 235)",
                  },
                }}
              >
                <Link className="settings" to={pagesPaths.get(setting)}>
                  {setting}
                </Link>
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default HeaderLoggedOut;
