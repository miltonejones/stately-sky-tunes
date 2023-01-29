import React from 'react';
import { styled, Box, Divider, Typography } from '@mui/material';
import { TuneGrid, InfoCard } from "../../../styled"; 
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(1)
}));
 
const Splash = ({ albums, artists, onAuto }) => {

  if (!albums) return <>loading...</> 


 return (
   <Layout data-testid="test-for-Splash">
 
    <Typography variant="h5" sx={{pl: 2}}>Welcome to Skytunes!</Typography>
    <Divider textAlign="left" sx={{mt: 1}}>Top Albums</Divider>
     <TuneGrid sx={{ m: 2 }}>
        {albums.map((record) => (
          <InfoCard
            onClick={() => onAuto(record.ID, 'album')}
            key={record.ID}
            {...record}
          />
        ))}
      </TuneGrid>
    <Divider textAlign="left">Top Artists</Divider>
     <TuneGrid sx={{ m: 2 }}>
        {artists.map((record) => (
          <InfoCard
          onClick={() => onAuto(record.ID, 'artist')}
            key={record.ID}
            {...record}
          />
        ))}
      </TuneGrid>  
   </Layout>
 );
}
Splash.defaultProps = {};
export default Splash;
