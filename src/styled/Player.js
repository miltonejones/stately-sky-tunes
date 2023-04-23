
import React from 'react';
import { styled, Card } from '@mui/material';

const Player = styled(({ open, small, theme, ...props }) => <Card elevation={4} {...props}  />)(({ open, small, theme }) => ({
  position: 'fixed',
  bottom:  open ? 'calc(var(--bottom-bar-offset) + var(--bottom-menu-offset))' : -400,
  transition: "all 0.2s linear",
  height: small ? 'var(--player-offset)' : 116,
  width: '100vw',
  left: 0,
  backgroundColor: 'white'
}));

export default Player;
