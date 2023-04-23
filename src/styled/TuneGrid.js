// import React from 'react';
import { styled, Box } from "@mui/material";

const TuneGrid = styled(Box)(({ theme }) => ({
  gap: theme.spacing(2),
  
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
  [theme.breakpoints.down('md')]: { 
    gridTemplateColumns: "1fr 1fr",
    gap: theme.spacing(1),
  },
  '@media screen and (max-width: 800px) and (orientation: landscape)': {
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
  }
}));

export default TuneGrid;
