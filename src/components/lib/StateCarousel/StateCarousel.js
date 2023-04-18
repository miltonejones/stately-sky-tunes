import React from "react";
import { Card, Typography, styled } from "@mui/material";
import { useMachine } from "@xstate/react";
import { carouselMachine } from "../../../machines";

const StateCarousel = ({ images, offset }) => {
  const [state] = useMachine(carouselMachine, {
    services: {
      loadImages: async () => images,
    },
  });
  const { running, first, second } = state.context;
  if (!first) return <i />;
  return (
    <> 
      <Carousel offset={offset}>
        <Slide first src={first.src} moving={running} />
        <Slide src={second.src} moving={running} />
        <Caption moving={running}>
          <Text variant="h6">{first.title}</Text>
          <Text variant="body2">{first.caption}</Text>
        </Caption>
      </Carousel>
    </>
  );
};

const Text = styled(Typography)(() => ({
  color: "white",
  mixBlendMode: "difference",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "30vw",
  width: "100%",
  lineHeight: 1.1,
}));

const Carousel = styled(Card)(({ theme, offset = 0 }) => ({
  position: "relative",
  width: "100%",
  height: `calc(40vh - ${offset*2}px)`,
  overflow: "hidden",
  // marginTop: theme.spacing(1),
  // borderRadius: 15,
  cursor: "pointer",
  [theme.breakpoints.down('md')]: {  
   display: 'none'
  }
}));

const Slide = styled("img")(({ first, moving }) => {
  const transition = moving ? "left 0.24s linear" : "none";
  const firstLeft = moving ? "-100%" : 0;
  const secondLeft = moving ? 0 : "100%";
  const obj = {
    width: "100%",
    position: " absolute",
    top: "-70%",
    transition,
    left: first ? firstLeft : secondLeft,
  };
  return obj;
});

const Caption = styled(Card)(({ theme, moving }) => ({
  position: "absolute",
  bottom: 40,
  left: 20,
  minWidth: 300,
  opacity: moving ? 0 : 0.7,
  transition: "opacity 0.4s linear",
  backgroundColor: theme.palette.common.black,
  padding: theme.spacing(1, 2),
}));

export default StateCarousel;
