import React from 'react';
import TrackListDrawer from './TrackListDrawer';
 
export default {
 title: 'TrackListDrawer',
 component: TrackListDrawer
};
 
const Template = (args) => <TrackListDrawer {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
