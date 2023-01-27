import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import StatePlayer from './StatePlayer';
 
afterEach(() => cleanup());
 
describe('<StatePlayer/>', () => {
 it('StatePlayer mounts without failing', () => {
   render(<StatePlayer />);
   expect(screen.getAllByTestId("test-for-StatePlayer").length).toBeGreaterThan(0);
 });
});

