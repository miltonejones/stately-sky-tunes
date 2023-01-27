import React from 'react';
import { styled, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

 
 
const NavLinks = ({ page, href, pageTitle }) => {
  if (!pageTitle) {
    return (
     <Breadcrumbs sx={{m: 2}} aria-label="breadcrumb">
     <Link underline="hover" color="inherit" href="/">
       Home
     </Link> 
     <Typography color="text.primary">{page}</Typography>
   </Breadcrumbs>
    );

  }
 return (
  <Breadcrumbs sx={{m: 2}} aria-label="breadcrumb">
  <Link underline="hover" color="inherit" href="/">
    Home
  </Link>
  <Link
    underline="hover"
    color="inherit"
    href={href}
  >
    {page}
  </Link>
  <Typography color="text.primary">{pageTitle}</Typography>
</Breadcrumbs>
 );
}
NavLinks.defaultProps = {};
export default NavLinks;
