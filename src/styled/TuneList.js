// import React from 'react';
import { styled, Box } from "@mui/material";

const TuneList = styled(Box)(({ theme }) => ({
  gap: 0, // theme.spacing(1),
  display: "grid",
  alignItems: "center",
  gridTemplateColumns: "40px 25% 20% 22% 10% 5% 40px 1fr",
}));

export default TuneList;
