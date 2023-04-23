/**
 * A drawer component for displaying vocabulary words and definitions.
 * @param {Object} props - The props object that includes the children to be displayed and other optional properties.
 * @param {boolean} [props.open=false] - Whether or not the drawer is open.
 * @param {string} [props.anchor="bottom"] - The position on the screen where the drawer will be anchored.
 * @returns {JSX.Element}
 */
import React from 'react';
import { styled, Box, Drawer } from '@mui/material'; 

const VocabDrawer = ({ children, open = false, anchor = "bottom", ...otherProps }) => {
  return (
    <Drawer open={open} anchor={anchor} {...otherProps}>
      <Inner>{children}</Inner>
    </Drawer>
  );
}

const Inner = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2,2,2,4),
  fontSize: '0.85rem',
  color: theme.palette.text.secondary,
  position: 'relative',
  '&:before': {
    content: '"😃"',
    position: 'absolute',
    width: 72,
    height: 72,
    top: 16,
    left: 10
  }  
}));

export default VocabDrawer;
 