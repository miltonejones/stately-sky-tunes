import React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

const NavLinks = ({ page, href, pageTitle, navigate }) => {
  if (!pageTitle) {
    return (
      <Breadcrumbs sx={{ m: 2 }} aria-label="breadcrumb">
        <Link underline="hover" color="inherit" onClick={() => navigate('/')}>
          Home
        </Link>
        <Typography color="text.primary">{page}</Typography>
      </Breadcrumbs>
    );
  }
  return (
    <Breadcrumbs sx={{ m: 2 }} aria-label="breadcrumb">
      <Link underline="hover" color="inherit"  onClick={() => navigate('/')}>
        Home
      </Link>
      <Link underline="hover" color="inherit"  onClick={() => navigate(href)}>
        {page}
      </Link>
      <Typography color="text.primary">{pageTitle}</Typography>
    </Breadcrumbs>
  );
};
NavLinks.defaultProps = {};
export default NavLinks;
