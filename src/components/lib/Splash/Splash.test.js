import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Splash from './Splash';
 
afterEach(() => cleanup());
 
describe('<Splash/>', () => {
 it('Splash mounts without failing', () => {
   render(<Splash />);
   expect(screen.getAllByTestId("test-for-Splash").length).toBeGreaterThan(0);
 });
});

