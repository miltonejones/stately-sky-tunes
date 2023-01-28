// import React from 'react';
import { styled, Box } from "@mui/material";

const TuneList = styled(Box)(({ theme }) => ({
  gap: theme.spacing(1),
  display: "grid",
  alignItems: "center",
  gridTemplateColumns: "48px 25% 20% 30% 8% 5% 5% 1fr",
}));

export default TuneList;
