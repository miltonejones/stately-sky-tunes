import React from 'react';
import { BottomNavigation, Drawer, BottomNavigationAction, Paper, Box, styled } from '@mui/material'; 
import { Rotation, Logo, Flex, Nowrap, Spacer } from '../../../styled';

const Nav = styled(Paper)(({ theme }) => ({
  position: 'fixed', 
  backgroundColor: '#ebebeb',
  bottom: 'var(--bottom-bar-offset)',  
  left: 0, right: 0,
  zIndex: 100,
  '@media screen and (max-width: 800px) and (orientation: landscape)': {
     display: 'none'
  }
}))

const NavigationAction = ({ label, icon, ...props}) => {
  return <Flex spacing={1} sx={{m: 1 }} {...props}>
   {icon} {label}
  </Flex>
}

const BottomNav = ({ children, logo, title, options, onClick }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
 return (
  <>
  
  <Rotation sx={{ ml: 2 }}>

  <Logo onClick={() => setOpen(true)}  src={logo} alt="sky-tunes" />
 
  </Rotation>

  <Drawer anchor="left" open={open} onClose={() => setOpen(!open)}>

      <Flex spacing={1} sx={{p: 1, mb: 1, mt: 2,  }}>

      <Logo onClick={() => setOpen(!1)}  src={logo} alt="sky-tunes" />
 
      <Nowrap  small bold>{title}</Nowrap>
      <Spacer />
        <i onClick={() => setOpen(!1)} className="fa-solid fa-xmark"></i>

      </Flex>

    <Box sx={{ p: 1, width: '30vw'}}>

    {options
        .filter(option => option.value !== 'music')
        .map(option =>  (
          <NavigationAction onClick={() => onClick(option.target)} label={option.label} icon={option.icon} />
        ))}


        <NavigationAction label="Settings" icon={children} />
    </Box>
  </Drawer>


  <Nav elevation={3}>
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
  </Nav></>
 );
}
BottomNav.defaultProps = {};
export default BottomNav;
