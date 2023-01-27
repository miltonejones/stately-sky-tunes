

import { styled, Box } from '@mui/material';

const Flex = styled(Box)(({ theme, between, spacing, bottom }) => ({
  gap: theme.spacing(spacing),
  cursor: 'pointer',
  display: 'flex',
  borderBottom: bottom ? `solid 1px ${theme.palette.divider}` : '',
  alignItems: 'center',
  justifyContent: between ? 'space-between' : 'center'
}))

export default Flex;
