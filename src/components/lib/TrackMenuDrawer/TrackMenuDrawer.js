import React from 'react';
import { styled, Box } from '@mui/material';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(4)
}));
 
const TrackMenuDrawer = () => {
 return (
   <Layout data-testid="test-for-TrackMenuDrawer">
     TrackMenuDrawer Component
   </Layout>
 );
}
TrackMenuDrawer.defaultProps = {};
export default TrackMenuDrawer;
