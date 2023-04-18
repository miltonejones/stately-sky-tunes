import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { typeIcons } from '../../../styled';

 

const BottomNav = ({ options }) => {
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

      <BottomNavigationAction label={option.label} icon={typeIcons[option.value]} />
      
        // <Collapse 
        //   orientation="horizontal" 
        //   in={!value || value === 'music' || value === option.value}
        // >

        // <ChipButton 
        //     onClick={() => menu.handleClick(option.value)} 
        //     variant={option.value === value ? "contained" : "outlined"} 
        //     startIcon={typeIcons[option.value]}

        //     rounded 
        //     size="small"
        //     color="primary" 
        //   >{option.label}</ChipButton>


        // </Collapse>
        ))}
 
    </BottomNavigation>
  </Paper>
 );
}
BottomNav.defaultProps = {};
export default BottomNav;
