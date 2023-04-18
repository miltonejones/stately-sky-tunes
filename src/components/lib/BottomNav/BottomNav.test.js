import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import BottomNav from './BottomNav';
 
afterEach(() => cleanup());
 
describe('<BottomNav/>', () => {
 it('BottomNav mounts without failing', () => {
   render(<BottomNav />);
   expect(screen.getAllByTestId("test-for-BottomNav").length).toBeGreaterThan(0);
 });
});

