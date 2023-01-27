import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import PageHead from './PageHead';
 
afterEach(() => cleanup());
 
describe('<PageHead/>', () => {
 it('PageHead mounts without failing', () => {
   render(<PageHead />);
   expect(screen.getAllByTestId("test-for-PageHead").length).toBeGreaterThan(0);
 });
});

