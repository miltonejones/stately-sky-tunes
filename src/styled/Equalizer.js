import React from 'react';
import PropTypes from 'prop-types';
import { styled, Card, Stack, Box } from '@mui/material';
import { createEqBackground } from '../util/createEqBackground';

/**
 * @typedef Coord
 * @property {number} bar_height - the height of the bar in pixels
 */

/**
 * @typedef EqualizerProps
 * @property {Array.<Coord>} coords - an array of objects containing the height of each bar
 * @property {string} width - the width of the equalizer component
 */

/**
 * The Equalizer component displays an equalizer graphic given an array of coordinates.
 * @param {EqualizerProps} props - the props to pass to the Equalizer component
 * @returns {JSX.Element} - the Equalizer component
 */
const Equalizer = ({ coords = [], width = 300, label, ...props }) => {
  const redGradient =
    'linear-gradient(0deg, rgba(2,160,5,1) 0%, rgba(226,163,15,1) 18px, rgba(255,0,42,1) 30px)';

  const Pane = styled(Stack)(({ theme, width }) => ({
    alignItems: 'flex-end',
    height: 48,
    width,
    border: `solid 1px ${theme.palette.divider}`,
    position: 'relative',
  }));

  const bar_width = Math.floor(width / 32)

  return (
    <Box {...props}>
      <Card sx={{ width, mb: 1 }}>
        <Pane direction="row">
          <Box sx={{ position: 'absolute', top: 0, left: 0 }}>
            <img src={createEqBackground(width, label)} alt="Equalizer Background" />
          </Box>
          {coords.map((coord, index) => (
            <Box
              key={`bar-${index}`}
              sx={{
                background: redGradient,
                ml: '1px',
                width: `${bar_width}px`,
                height: Math.abs(coord.bar_height / 4),
              }}
            />
          ))}
        </Pane>
      </Card>
    </Box>
  );
};

Equalizer.propTypes = {
  coords: PropTypes.arrayOf(
    PropTypes.shape({
      bar_height: PropTypes.number.isRequired,
    })
  ),
  width: PropTypes.string,
};

export default Equalizer;

// Critiques:
// - The createEqBackground function is imported but never used.
// - The default height of 48 for the Pane could be made into a default prop
// - The hardcoded values for color (red) and gradient could be replaced with default props.