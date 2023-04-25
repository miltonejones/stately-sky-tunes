/**
 * Renders a prompt component with a label and a text field.
 * @param {Object} props - The properties to be passed to the Text Field component.
 * @param {string} props.label - The label of the prompt.
 * @returns {JSX.Element}
 */
import React from 'react';
import { TextField, Stack } from '@mui/material';
import Nowrap from './Nowrap';

const Prompt = ({label, ...props}) => {
  return (
    <Stack spacing={1}>
      <Nowrap small>{label}</Nowrap>
      <TextField size="small" {...props} />
    </Stack>
  );
}

export default Prompt;

//Critique:
//This code is already pretty legible and efficient, with the variable names being descriptive and the code being concise. 
//One possible improvement would be to add default properties for the TextField component to avoid any unnecessary errors related to certain properties being undefined.