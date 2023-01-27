
// import React from 'react';
import { styled, Typography } from '@mui/material';

const Nowrap = styled(Typography)(( { width,  bold, hover } ) => ({
  cursor: hover ? 'pointer' : 'default',
  fontWeight:  bold ? 600 : 400,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width:  width || '100%',
  '&:hover': {
    textDecoration: hover ? 'underline' : 'none'
  }
}))

export default Nowrap;
