
import React from 'react';
import { styled } from '@mui/material';
import Flex from './Flex';

const Rotation = styled(props => <Flex {...props} />)(({ theme, show }) => ({
  display: show ? "flex" : 'none',
  [theme.breakpoints.down('md')]: {
    '@media screen and (max-width: 800px) and (orientation: landscape)': {
      display: show ? "none" : 'flex'
    } 
  }
}))

export default Rotation;
