import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import PlaylistDrawer from './PlaylistDrawer';
 
afterEach(() => cleanup());
 
describe('<PlaylistDrawer/>', () => {
 it('PlaylistDrawer mounts without failing', () => {
   render(<PlaylistDrawer />);
   expect(screen.getAllByTestId("test-for-PlaylistDrawer").length).toBeGreaterThan(0);
 });
});

