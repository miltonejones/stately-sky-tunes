import React from 'react';
import { Collapse } from '@mui/material';
import { useSelector } from "../../../machines";
import { Flex, LiteButton, typeIcons } from '../../../styled';
  
const ChipMenu = ({ options, value, onChange }) => {
  const menu = useSelector(onChange)
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
        <LiteButton 
            rounded 
            size="small"
            startIcon={typeIcons[option.value]}
            onClick={() => menu.handleClick(option.value)} 
            color="primary" 
            variant={option.value === value ? "contained" : "outlined"} 
          >{option.label}  </LiteButton>
        </Collapse>))}
    </Flex>
 );
}
ChipMenu.defaultProps = {};
export default ChipMenu;
