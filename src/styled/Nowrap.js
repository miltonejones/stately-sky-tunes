
// import React from 'react';
import { styled, Typography } from '@mui/material';
// import { blue } from '@mui/material/colors';

const Nowrap = styled(Typography)(( { theme, width, odd, bold, hover } ) => ({
  cursor: hover ? 'pointer' : 'default',
  fontWeight:  bold ? 600 : 400,
  // backgroundColor: odd ? blue[50] : 'white',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width:  width || '100%',
  '&:hover': {
    textDecoration: hover ? 'underline' : 'none'
  }
}))

export default Nowrap;
