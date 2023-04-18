import React from 'react';
import SmallPlayer from './SmallPlayer';
 
export default {
 title: 'SmallPlayer',
 component: SmallPlayer
};
 
const Template = (args) => <SmallPlayer {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
