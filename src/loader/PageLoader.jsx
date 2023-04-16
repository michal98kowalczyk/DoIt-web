import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const PageLoader = () => {
  return (
    <Box
      sx={{
        display: "block",
        position: "absolute",
        backgroundColor: "rgb(200,200,200,0.1)",
        width: "100vw",
        height: "100vh",
        lineHeight: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default PageLoader;
