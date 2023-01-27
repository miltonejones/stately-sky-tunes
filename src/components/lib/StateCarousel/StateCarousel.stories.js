import React from 'react';
import StateCarousel from './StateCarousel';
 
export default {
 title: 'StateCarousel',
 component: StateCarousel
};
 
const Template = (args) => <StateCarousel {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
