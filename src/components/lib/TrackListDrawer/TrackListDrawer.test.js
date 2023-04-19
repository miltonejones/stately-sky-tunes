import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import TrackListDrawer from './TrackListDrawer';
 
afterEach(() => cleanup());
 
describe('<TrackListDrawer/>', () => {
 it('TrackListDrawer mounts without failing', () => {
   render(<TrackListDrawer />);
   expect(screen.getAllByTestId("test-for-TrackListDrawer").length).toBeGreaterThan(0);
 });
});

