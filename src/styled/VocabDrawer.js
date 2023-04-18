
import React from 'react';
import { styled, Box, Drawer } from '@mui/material';




// const VocabDrawer = styled(props => <Drawer open anchor="bottom" {...props} />)(({ theme }) => ({

// }))

const VocabDrawer = ({ children, ...props }) => {
  return <Drawer open anchor="bottom" {...props}>
    <Inner>{children}</Inner>
  </Drawer>
}


const Inner = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  fontSize: '0.85rem',
  color: theme.palette.text.secondary,
  position: 'relative',
  '&:before': {
    content: '"😃"',
    position: 'absolute',
    width: 48,
    height: 48,
    top: 10,
    left: 10
  }  
}))

export default VocabDrawer;
