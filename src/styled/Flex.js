

import { styled, Box } from '@mui/material';

const Flex = styled(Box)(({ theme, between, start, base, spacing, bottom }) => ({
  gap: theme.spacing(spacing),
  cursor: 'pointer',
  display: 'flex',
  borderBottom: bottom ? `solid 1px ${theme.palette.divider}` : '',
  alignItems: start ? 'flex-start' : 'center',
  justifyContent: between ? 'space-between' : 'flex-start'
}))

export default Flex;
