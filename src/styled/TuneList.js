// import React from 'react';
import { styled, Box } from "@mui/material";

const TuneList = styled(Box)(({ theme, header }) => ({
  gap: 0, // theme.spacing(1),
  display: "grid",
  alignItems: "center",
  gridTemplateColumns: "40px 25% 20% 22% 10% 5% 40px 1fr",
  [theme.breakpoints.down('md')]: { 
    display: header ? 'none' : 'grid',
    // border: 'solid 1px green',
    margin: theme.spacing(0, 1),
    paddingBottom: theme.spacing(1),
    gridTemplateColumns: "40px 25% 20% 22% 10% 40px 5% 1fr",
    gridTemplateAreas: `
      "icon title title title title heart menu menu" 
      "artist artist artist artist genre genre time time"
      "album album album album album album album album"
      `,
    gridTemplateRows: '24px 18px 18px',
    '& .albumImage': {
      gridArea: 'icon'
    },
    '& .Title': {
      gridArea: 'title'
    },
    '& .artistName': {
      gridArea: 'artist',
      paddingLeft: theme.spacing(1),
      fontSize: '0.9rem',
      color: theme.palette.text.secondary
    },
    '& .albumName': {
      gridArea: 'album',
      paddingLeft: theme.spacing(1),
      fontSize: '0.9rem',
      color: theme.palette.text.secondary
    },
    '& .Genre': {
      gridArea: 'genre',
      display: 'none'
    },
    '& .trackTime': {
      gridArea: 'time',
      display: 'none'
    },
    '& .favorite': {
      gridArea: 'heart'
    },
    '& .menu': {
      gridArea: 'menu'
    },
  },
}));

export default TuneList;
