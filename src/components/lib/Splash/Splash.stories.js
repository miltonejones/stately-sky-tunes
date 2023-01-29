import React from 'react';
import Splash from './Splash';
 
export default {
 title: 'Splash',
 component: Splash
};
 
const Template = (args) => <Splash {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
