import React from 'react';
import { styled, Box, Divider, Typography, Stack } from '@mui/material';
import { TuneGrid, InfoCard, Nowrap, Flex } from "../../../styled"; 
import { shuffle } from "../../../util/shuffle"; 
import { usePhoto } from "../../../machines";
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(1)
}));

const Grid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
  gap: theme.spacing(1)
 }));


 const Image = ({ src, backup, ...props}) => {
  const pic = usePhoto(src, backup);
  return <img src={pic.image} {...props} />
 }
 
const Splash = ({ albums, artists, playlists, navigate, onAuto, logo }) => {

  if (!albums) return <>loading...</> 

 
    

 return (
   <Layout data-testid="test-for-Splash">
 
    <Typography variant="h5" sx={{pl: 2}}>Welcome to Skytunes!</Typography>
 
    <Divider textAlign="left" sx={{mt: 1}}>Playlists</Divider>
    <Grid sx={{mt: 1}}>
    {!!playlists && playlists.map(item => (
      <Flex sx={{
        border: 1,
          borderRadius: 2,
        borderColor: 'divider'
      }} 
      onClick={() => navigate(`/list/playlist/${item.listKey}`)}
      spacing={1}>
        <Image style={{
          width: 48,
          height: 48
        }} 
        backup={logo}
        src={item.image}
        alt={item.Title}
        />
        <Stack>
          <Nowrap hover variant="body2" width="calc(20vw - 72px)">{item.Title}</Nowrap>
          <Nowrap muted variant="caption">{item.related.length} tracks</Nowrap>
        </Stack>
        
      </Flex>
    ))}
    </Grid>

    {/* [{playlists?.records?.length}] */}

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
