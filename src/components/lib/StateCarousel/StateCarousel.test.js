import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import StateCarousel from './StateCarousel';
 
afterEach(() => cleanup());
 
describe('<StateCarousel/>', () => {
 it('StateCarousel mounts without failing', () => {
   render(<StateCarousel />);
   expect(screen.getAllByTestId("test-for-StateCarousel").length).toBeGreaterThan(0);
 });
});

