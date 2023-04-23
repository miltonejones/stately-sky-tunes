
import React from 'react';
import { styled, Avatar } from '@mui/material';



const Logo = styled(Avatar)(( { theme }) => ({ 
  
  [theme.breakpoints.down('md')]: { 
    width: 24,
    height: 24
  }
}));


export default Logo;
