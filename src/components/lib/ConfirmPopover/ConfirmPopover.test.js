import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ConfirmPopover from './ConfirmPopover';
 
afterEach(() => cleanup());
 
describe('<ConfirmPopover/>', () => {
 it('ConfirmPopover mounts without failing', () => {
   render(<ConfirmPopover />);
   expect(screen.getAllByTestId("test-for-ConfirmPopover").length).toBeGreaterThan(0);
 });
});

