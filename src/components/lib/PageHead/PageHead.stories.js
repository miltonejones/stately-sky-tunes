import React from 'react';
import PageHead from './PageHead';
 
export default {
 title: 'PageHead',
 component: PageHead
};
 
const Template = (args) => <PageHead {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
