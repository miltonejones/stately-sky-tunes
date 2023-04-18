import React from 'react';
import { Collapse, IconButton, useMediaQuery, useTheme  } from '@mui/material';
import { useSelector } from "../../../machines";
import { Flex, LiteButton, typeIcons } from '../../../styled';


const ChipButton = ({ children, ...props}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); 

  if (isMobile) {
    return <IconButton {...props}>
        {props.startIcon}
    </IconButton>
  }
  return <LiteButton {...props}>{children}</LiteButton>
}
  
const ChipMenu = ({ options, value, onChange }) => { 
  
  const menu = useSelector(onChange);


 return (
    <Flex spacing={1} sx={{m: 2}}> 
 
      {!!(menu.selected || value) && value !== 'music' && <i onClick={menu.handleClose} className="fa-solid fa-xmark"></i>}
 
      {options
        .filter(option => option.value !== 'music')
        .map(option =>  (
        <Collapse 
          orientation="horizontal" 
          in={!value || value === 'music' || value === option.value}
        >

        <ChipButton 
            onClick={() => menu.handleClick(option.value)} 
            variant={option.value === value ? "contained" : "outlined"} 
            startIcon={typeIcons[option.value]}

            rounded 
            size="small"
            color="primary" 
          >{option.label}</ChipButton>


        </Collapse>))}
    </Flex>
 );
}
ChipMenu.defaultProps = {};
export default ChipMenu;
