import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import SmallPlayer from './SmallPlayer';
 
afterEach(() => cleanup());
 
describe('<SmallPlayer/>', () => {
 it('SmallPlayer mounts without failing', () => {
   render(<SmallPlayer />);
   expect(screen.getAllByTestId("test-for-SmallPlayer").length).toBeGreaterThan(0);
 });
});

