import React from 'react';
import StatePlayer from './StatePlayer';
 
export default {
 title: 'StatePlayer',
 component: StatePlayer
};
 
const Template = (args) => <StatePlayer {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
