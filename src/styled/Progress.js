
import React from 'react';
import { styled, Slider } from '@mui/material';

const Progress = styled(props => <Slider {...props} min={0} max={100} />)(
  ({ theme }) => ({
    padding: '0px !important',  
    width: "100%"
}))

export default Progress;
 