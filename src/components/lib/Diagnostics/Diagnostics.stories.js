import React from 'react';
import Diagnostics from './Diagnostics';
 
export default {
 title: 'Diagnostics',
 component: Diagnostics
};
 
const Template = (args) => <Diagnostics {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
