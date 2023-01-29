import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import AutoSelect from './AutoSelect';
 
afterEach(() => cleanup());
 
describe('<AutoSelect/>', () => {
 it('AutoSelect mounts without failing', () => {
   render(<AutoSelect />);
   expect(screen.getAllByTestId("test-for-AutoSelect").length).toBeGreaterThan(0);
 });
});

