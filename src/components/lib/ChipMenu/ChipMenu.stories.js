import React from 'react';
import ChipMenu from './ChipMenu';
 
export default {
 title: 'ChipMenu',
 component: ChipMenu
};
 
const Template = (args) => <ChipMenu {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
