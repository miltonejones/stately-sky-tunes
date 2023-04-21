
import { styled, Paper } from '@mui/material';

const Bureau = styled(Paper)(({ open }) => ({
  position: "fixed",
  bottom: open ? 'var(--bottom-bar-offset)' : "-234vh",
  transition: "bottom 0.2s linear",
  left: 0,
  width: "100vw",
}));

export default Bureau;
