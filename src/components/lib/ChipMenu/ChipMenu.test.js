import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ChipMenu from './ChipMenu';
 
afterEach(() => cleanup());
 
describe('<ChipMenu/>', () => {
 it('ChipMenu mounts without failing', () => {
   render(<ChipMenu />);
   expect(screen.getAllByTestId("test-for-ChipMenu").length).toBeGreaterThan(0);
 });
});

