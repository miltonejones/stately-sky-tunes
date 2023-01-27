import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import DataGrid from './DataGrid';
 
afterEach(() => cleanup());
 
describe('<DataGrid/>', () => {
 it('DataGrid mounts without failing', () => {
   render(<DataGrid />);
   expect(screen.getAllByTestId("test-for-DataGrid").length).toBeGreaterThan(0);
 });
});

