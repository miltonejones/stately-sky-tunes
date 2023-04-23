/**
 * A higher order component that returns a styled MUI Box component with flex display
 * @function
 * @param {Object} props - The component props for customization
 * @param {string} [props.between] - If defined, justify content to space between
 * @param {string} [props.start] - If defined, align items to flex start
 * @param {string} [props.base] - Base style properties
 * @param {number} [props.spacing=0] - The spacing between child elements
 * @param {boolean} [props.bottom=false] - Include a solid border on the bottom
 * @returns {JSX.Element} - A styled MUI Box component
 */

import { styled, Box } from '@mui/material';

const Flex = styled(Box)(({ theme, between, start, base, spacing = 0, bottom }) => ({
  gap: theme.spacing(spacing),
  cursor: 'pointer',
  display: 'flex',
  borderBottom: bottom ? `solid 1px ${theme.palette.divider}` : '',
  alignItems: start ? 'flex-start' : 'center',
  justifyContent: between ? 'space-between' : 'flex-start',
  ...base
}));

export default Flex;
 