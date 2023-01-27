import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import NavLinks from './NavLinks';
 
afterEach(() => cleanup());
 
describe('<NavLinks/>', () => {
 it('NavLinks mounts without failing', () => {
   render(<NavLinks />);
   expect(screen.getAllByTestId("test-for-NavLinks").length).toBeGreaterThan(0);
 });
});

