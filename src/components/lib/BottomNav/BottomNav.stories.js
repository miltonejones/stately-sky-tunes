import React from 'react';
import BottomNav from './BottomNav';
 
export default {
 title: 'BottomNav',
 component: BottomNav
};
 
const Template = (args) => <BottomNav {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
