import React from 'react';
import { styled, Box, Chip, Collapse } from '@mui/material';
import { useSelector } from "../../../machines";
import { Flex } from "../../../styled";
  
const ChipMenu = ({ options, value, onChange }) => {
  const menu = useSelector(onChange)
 return (
    <Flex spacing={1} sx={{mr: 2}}> 
    {/* [{JSON.stringify(menu.state.value)}]
[{menu.selected}] */}
      {!!menu.selected && <i onClick={menu.handleClose} className="fa-solid fa-xmark"></i>}

      {options
        .filter(option => option.value !== 'music')
        .map(option =>  (
        <Collapse 
          orientation="horizontal" 
          in={!menu.selected || menu.selected === 'music' || menu.selected === option.value}
        >
          <Chip size="small"
            onClick={() => menu.handleClick(option.value)}
            label={option.label} 
            color="primary" 
            variant={option.value === value ? "filled" : "outlined"} 
          />
        </Collapse>))}
    </Flex>
 );
}
ChipMenu.defaultProps = {};
export default ChipMenu;
