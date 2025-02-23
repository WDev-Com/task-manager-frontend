import React from "react";
import { AppBar, Box, Toolbar, Typography, IconButton } from "@mui/material";
const Navigation = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="regular">
          <Typography variant="h6" color="inherit" component="div">
            Task Manager
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navigation;
