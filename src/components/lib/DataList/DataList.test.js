import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import DataList from './DataList';
 
afterEach(() => cleanup());
 
describe('<DataList/>', () => {
 it('DataList mounts without failing', () => {
   render(<DataList />);
   expect(screen.getAllByTestId("test-for-DataList").length).toBeGreaterThan(0);
 });
});

