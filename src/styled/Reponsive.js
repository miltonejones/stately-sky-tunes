/**
 * Responsive component that hides content on screens smaller than 'md' breakpoint
 * @component
 * @param {Object} theme - MUI theme object
 */

import { styled } from '@mui/material';
import Flex from './Flex';


const Responsive = styled(props => <Flex {...props} />)(({ theme, show }) => ({
  cursor: 'pointer',
  display: !show ? 'flex' : 'none',
  [theme.breakpoints.down('md')]: {
    display: show ? 'flex' : 'none'
  }
}))

export default Responsive;
 