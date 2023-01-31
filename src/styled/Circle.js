

import { styled, Avatar } from '@mui/material';

const sizes = {
  small: 24,
  medium: 32,
  large: 40
}

const Circle = styled(Avatar)(({ size }) => ({
  width: sizes[size],
  height: sizes[size],
}))

export default Circle;
