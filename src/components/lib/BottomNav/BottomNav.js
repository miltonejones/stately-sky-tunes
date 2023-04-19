import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'; 

 

const BottomNav = ({ children, options, onClick }) => {
  const [value, setValue] = React.useState(0);
 return (
  <Paper sx={{ position: 'fixed', 
    backgroundColor: 'white',
    bottom: 0, left: 0, right: 0,
    zIndex: 100 }} elevation={3}>
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
    >

      {options
        .filter(option => option.value !== 'music')
        .map(option =>  (
          <BottomNavigationAction onClick={() => onClick(option.target)} label={option.label} icon={option.icon} />
        ))}

        <BottomNavigationAction icon={children} label="Settings" />
 
    </BottomNavigation>
  </Paper>
 );
}
BottomNav.defaultProps = {};
export default BottomNav;
