import React from 'react';
import AutoSelect from './AutoSelect';
 
export default {
 title: 'AutoSelect',
 component: AutoSelect
};
 
const Template = (args) => <AutoSelect {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
