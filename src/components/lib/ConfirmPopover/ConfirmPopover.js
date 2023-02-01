import React from 'react';
import { styled, Box } from '@mui/material';
import { useMenu } from "../../../machines";
import { Typography, Stack, Divider, TextField, Button,  Popover } from '@mui/material';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(4)
}));
 
const ConfirmPopover = ( { onChange, message, prompt, caption, children }) => {
  const menu = useMenu(onChange);
  const { handleClick, handleClose, anchorEl, send } = menu;
 return (
   <>
    <Box onClick={handleClick}>{children}</Box>
   <Popover anchorEl={anchorEl} open={!!anchorEl} onClose={() => send('close')}>
      <Stack sx={{p: 2,  maxWidth: 600,  minWidth: 400}}>
        <Typography>{message}</Typography>
        {!!caption && <Typography variant="caption" color="error" sx={{fontWeight: 600}}>{caption}</Typography>}
        {!!prompt && <TextField size="small" value={prompt} onChange={e => send({
          type: 'CHANGE',
          value: e.target.value
        })}/>}
        <Divider sx={{width: '100%', m: t => t.spacing(1,0)}} />
        <Stack direction="row" sx={{ justifyContent: 'flex-end'}}>
          <Button onClick={() => send('close')}>cancel</Button>
          <Button variant="contained" onClick={handleClose(prompt || true)}>okay</Button>
        </Stack>
      </Stack>
   </Popover>
   </>
 );
}
ConfirmPopover.defaultProps = {};
export default ConfirmPopover;
