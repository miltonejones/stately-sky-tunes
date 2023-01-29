import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import SearchPage from './SearchPage';
 
afterEach(() => cleanup());
 
describe('<SearchPage/>', () => {
 it('SearchPage mounts without failing', () => {
   render(<SearchPage />);
   expect(screen.getAllByTestId("test-for-SearchPage").length).toBeGreaterThan(0);
 });
});

