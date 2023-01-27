import React from 'react';
import PlaylistDrawer from './PlaylistDrawer';
 
export default {
 title: 'PlaylistDrawer',
 component: PlaylistDrawer
};
 
const Template = (args) => <PlaylistDrawer {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
