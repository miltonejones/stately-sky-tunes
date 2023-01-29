// import React from 'react';
import { styled, Button } from "@mui/material";

const LiteButton = styled(Button)(({ rounded }) => ({
  cursor: "pointer",
  borderRadius: rounded ? 20 : 4,
  textTransform: "capitalize",
}));

export default LiteButton;
