import React from 'react';
import TrackMenuDrawer from './TrackMenuDrawer';
 
export default {
 title: 'TrackMenuDrawer',
 component: TrackMenuDrawer
};
 
const Template = (args) => <TrackMenuDrawer {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
