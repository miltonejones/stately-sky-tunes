import React from 'react';
import NavLinks from './NavLinks';
 
export default {
 title: 'NavLinks',
 component: NavLinks
};
 
const Template = (args) => <NavLinks {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
