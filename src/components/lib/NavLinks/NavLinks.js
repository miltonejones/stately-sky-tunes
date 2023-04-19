import React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { styled } from '@mui/material';

const L = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary, 
  [theme.breakpoints.down('md')]: {  
    fontSize: '0.8rem'
  }
}))

const NavLinks = ({ page, href, pageTitle, navigate }) => {
  if (!pageTitle) {
    return (
      <Breadcrumbs sx={{ m: 2 }} aria-label="breadcrumb">
        <L underline="hover" color="inherit" onClick={() => navigate('/')}>
          Home
        </L>
        <L color="text.primary">{page}</L>
      </Breadcrumbs>
    );
  }
  return (
    <Breadcrumbs sx={{ m: 2 }} aria-label="breadcrumb">
      <L underline="hover" color="inherit"  onClick={() => navigate('/')}>
        Home
      </L>
      <L underline="hover" color="inherit"  onClick={() => navigate(href)}>
        {page}
      </L>
      <L color="text.primary">{pageTitle}</L>
    </Breadcrumbs>
  );
};
NavLinks.defaultProps = {};
export default NavLinks;
