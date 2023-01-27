import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Diagnostics from './Diagnostics';
 
afterEach(() => cleanup());
 
describe('<Diagnostics/>', () => {
 it('Diagnostics mounts without failing', () => {
   render(<Diagnostics />);
   expect(screen.getAllByTestId("test-for-Diagnostics").length).toBeGreaterThan(0);
 });
});

