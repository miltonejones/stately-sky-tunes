import React from 'react';
import SearchPage from './SearchPage';
 
export default {
 title: 'SearchPage',
 component: SearchPage
};
 
const Template = (args) => <SearchPage {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
