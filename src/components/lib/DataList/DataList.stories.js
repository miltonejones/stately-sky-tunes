import React from 'react';
import DataList from './DataList';
 
export default {
 title: 'DataList',
 component: DataList
};
 
const Template = (args) => <DataList {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
