// import React from 'react';
import { styled, Box } from "@mui/material";

const TuneGrid = styled(Box)(({ theme }) => ({
  gap: theme.spacing(2),
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
}));

export default TuneGrid;
