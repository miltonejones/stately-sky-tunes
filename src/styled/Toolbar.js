// import React from 'react';
import { styled, Box } from "@mui/material";

const Toolbar = styled(Box)(({ theme }) => ({
  display: "flex",
  borderBottom: `solid 1px ${theme.palette.divider}`,
  alignItems: "center",
  backgroundColor: "white",
  zIndex: 3,
  padding: theme.spacing(2),
  position: "fixed",
  top: 0,
  gap: theme.spacing(1),
  left: 0,
  width: '100vw' ,
  '@media screen and (orientation: landscape)': {
     height: 16,
     overflow: 'hidden'
  }
}));

export default Toolbar;
