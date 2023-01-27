import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import TrackMenuDrawer from './TrackMenuDrawer';
 
afterEach(() => cleanup());
 
describe('<TrackMenuDrawer/>', () => {
 it('TrackMenuDrawer mounts without failing', () => {
   render(<TrackMenuDrawer />);
   expect(screen.getAllByTestId("test-for-TrackMenuDrawer").length).toBeGreaterThan(0);
 });
});

