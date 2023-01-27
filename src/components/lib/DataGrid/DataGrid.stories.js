import React from 'react';
import DataGrid from './DataGrid';
 
export default {
 title: 'DataGrid',
 component: DataGrid
};
 
const Template = (args) => <DataGrid {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
