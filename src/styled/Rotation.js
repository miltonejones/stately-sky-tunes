
import React from 'react';
import { styled } from '@mui/material';
import Flex from './Flex';

const Rotation = styled(props => <Flex {...props} />)(({ show }) => ({
  display: show ? "flex" : 'none',
  '@media screen and (orientation: landscape)': {
    display: show ? "none" : 'flex'
  } 
}))

export default Rotation;
