
import React from 'react';
import { 
  Card,
  Typography,
  CardMedia,
  CardContent, 
  Badge,
  Stack,
} from '@mui/material';

import  { Nowrap } from '.'
import { usePhoto } from '../machines';
const DEFAULT_IMAGE =  'https://www.sky-tunes.com/assets/default_album_cover.jpg';
const InfoCard =  ({ 
    Thumbnail, 
    image, 
    albumImage, 
    TrackCount, 
    Title, 
    artistName, 
    Genre, 
    Name, 
    size = 160, 
    ...track 
  }) => {

  const pic = usePhoto(Thumbnail || albumImage || image,  DEFAULT_IMAGE)

  return (
   <Card  {...track}
    sx={{ cursor: 'pointer', width: 'calc(22vw - 72px)' }}
  >  
  
  <CardMedia
      component="img"
      sx={{ borderRadius: 2, width: '100%', aspectRatio: "1 / 1"}}
      width="100%"
      height="auto" 
      image={pic.image}
      alt={Name}
    /> 
  
    <CardContent sx={{ p: t => t.spacing(1) + ' !important' }}>
      {/* {JSON.stringify(Object.keys(model))} */}
      <Stack>
      <Nowrap
        bold
        variant="body2" 
        color="text.primary"
      >
        {Name || Genre || Title} 
      </Nowrap>
      
     {!!TrackCount && !artistName && <Nowrap
        bold
        variant="caption" 
        color="text.secondary"
      >
        {TrackCount} tracks 
      </Nowrap>}
     {!!artistName && <Nowrap
        bold
        variant="caption" 
        color="text.secondary"
      >
        {artistName} 
      </Nowrap>}
      </Stack>
    </CardContent>
  </Card>  )
}

export default InfoCard;
