import React from "react";
import { styled, Typography, Box } from "@mui/material";

const Banner = styled(Box)(( { theme, on }) => ({
  width: "100vw",
  height: on ? "calc(100vw * .25)" : 0,
  transition: 'height 0.4s linear',
  position: "relative",
  overflow: "hidden",
  "& img": {
    width: "100%",
    position: "absolute",
    top: "-50%",
  },
  [theme.breakpoints.down('md')]: { 
    display: 'none'
  }
}));

const TitleBox = styled(Box)(() => ({
  position: "absolute",
  bottom: 60,
  left: 40,
}));

const Hero = ({ page, imageLg, Name, open, TrackCount, ...rest }) => {
  // if (!imageLg) {
  //   return <i />;
  // }
  return (
    <Banner on={!!imageLg && open} {...rest}>
       {!!imageLg && (
         <img src={imageLg} alt={Name} />
       )}
    
      <TitleBox sx={{ color: "white", mixBlendMode: "difference" }}>
        <Typography sx={{ lineHeight: 1 }} variant="button">
          {page}
        </Typography>
        <Typography sx={{ lineHeight: 0.7 }} variant="h4">
          {Name}
        </Typography>
        <Typography sx={{ lineHeight: 1.2 }} variant="body2">
          {TrackCount} tracks in your library
        </Typography>
      </TitleBox>
  </Banner>
      
  );
};

export default Hero;
/**
 *  "ID": 33,
  "Name": "Jesse Johnson",
  "Thumbnail": "https://s3.amazonaws.com/fapbucket.com/assets/d84dae60-0788-6d31-65a2-8ed19549da7a.jpg",
  "iArtistID": 263452,
  "amgArtistID": 4622,
  "imageLg": "https://is2-ssl.mzstatic.com/image/thumb/Music118/v4/45/a1/27/45a127e4-704c-9907-dc96-7020217a2d4a/00731454153324.rgb.jpg/1200x630cw.png",
  "TrackCount": 6
 */
