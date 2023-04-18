import React from 'react';
import { styled, Box, Divider, Typography, Stack } from '@mui/material';
import { TuneGrid, InfoCard, Nowrap, Flex } from "../../../styled"; 
// import { shuffle } from "../../../util/shuffle"; 
import { usePhoto } from "../../../machines";
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(1)
}));

const Grid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
  gap: theme.spacing(1),
  [theme.breakpoints.down('md')]: { 
    gridTemplateColumns: "1fr 1fr",
  }
 }));

 const GridWrapper = styled(props => <TuneGrid {...props} />)(({ theme }) => ({
  margin: theme.spacing(2), 
  [theme.breakpoints.down('md')]: { 
    margin: 0
  }
 }));

 const Caption = styled(props => <Nowrap {...props} />)(({ theme }) => ({
  width: `calc(20vw - 72px)`, 
  [theme.breakpoints.down('md')]: { 
    width: `calc(40vw - 42px)`, 
  }
 }));


 const Image = ({ src, backup, ...props}) => {
  const pic = usePhoto(src, backup);
  return <img src={pic.image} alt={pic.image} {...props} />
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
          <Caption hover variant="body2">{item.Title}</Caption>
          <Nowrap muted variant="caption">{item.related.length} tracks</Nowrap>
        </Stack>
        
      </Flex>
    ))}
    </Grid>

    {/* [{playlists?.records?.length}] */}

    <Divider textAlign="left" sx={{mt: 1}}>Top Albums</Divider>
     <GridWrapper>
        {albums.map((record) => (
          <InfoCard
            onClick={() => onAuto(record.ID, 'album')}
            key={record.ID}
            {...record}
          />
        ))}
      </GridWrapper>
    <Divider textAlign="left">Top Artists</Divider>
     <GridWrapper>
        {artists.map((record) => (
          <InfoCard
          onClick={() => onAuto(record.ID, 'artist')}
            key={record.ID}
            {...record}
          />
        ))}
      </GridWrapper>  
   </Layout>
 );
}
Splash.defaultProps = {};
export default Splash;
