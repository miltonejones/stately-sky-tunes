import React from "react";
import {
  Avatar,
  Card,
  IconButton,
  // Paper,
  Stack,
  Slider,
  Box,
  LinearProgress,
  Popover,
  Typography,
  Drawer,
  // styled,
} from "@mui/material";
// import Marquee from "react-fast-marquee";
import { useMachine } from "@xstate/react";
import { audioMachine, useMenu } from "../../../machines";
import { Flex, Spacer, Bureau, ScrollingText, Nowrap } from "../../../styled";
import { AudioConnector, frameLooper } from "./eq";
import { Diagnostics } from "..";
import { getIntro} from "../../../util/getIntro";  
import { speakText} from "../../../util/speakText";  



const loadIntro = async (context) => {
  const {intros, Title, artistName, upcoming = [] } = context;
 
  if (intros[Title]) { 
    return intros[Title];
  }

  const { Introduction } = await getIntro(
    Title, 
    artistName, 
    upcoming, 
    "Milton", 
    31, 

    false, 
    true 

  );    
  return Introduction;
}



const connector = new AudioConnector();

export const useStatePlayer = (onPlayStart) => {
  const services = {
    clearAudio: async (context) => {
      context.player.pause();
      context.player.src = null;
      await new Promise((go) => setTimeout(go, 999));
    },

    
    loadNext: async(context) => { 
        

      return await loadIntro({
        ...context,
        ...context.nextProps
      }); 
    },

    loadNarration: async (context) => {
      return await loadIntro(context)
    },

    startAudio: async (context) => {
      try {
        context.player.src = context.src;
        context.player.play();


        setTimeout(() => {
          !!context.intro && speakText (context.intro, true, 'en-US', (value) => {
            if (context.player) {
              context.player.volume = !!value ? .75 : 1
            }
            send({
              type: 'CHANGE',
              key: 'vocab',
              value
            })
          })
        }, 499);


        return context.player;
      } catch (e) {
        throw new Error(e);
      }
    },
    audioStarted: async (context) =>
      onPlayStart && onPlayStart(context.artistFk),
    loadAudio: async (context) => {
      const audio = new Audio();
      if (context.eq) {
        const { analyser } = connector.connect(audio);
        frameLooper(analyser, (coords) => {
          send({
            type: "COORDS",
            coords,
          });
        });
      }

      audio.addEventListener("ended", () => {
        send("END");
      });

      audio.addEventListener("error", () => {
        send("ERROR");
      });

      audio.addEventListener("timeupdate", () => {
        // const coords = frameLooper(analyser);
        // console.log ({ coords })
        send({
          type: "PROGRESS",
          currentTime: audio.currentTime,
          duration: audio.duration,
          // coords: frameLooper(analyser)
        });
      });
      return audio;
    },
  };
  const [state, send] = useMachine(audioMachine, { services });

  const { duration, currentTime, FileKey } = state.context;

  const idle = state.matches("idle");

  const handleSeek = (event, newValue) => {
    const percent = newValue / 100;
    send({
      type: "SEEK",
      value: duration * percent,
    });
  };

  const handleSkip = (secs) => { 
    send({
      type: "SEEK",
      value: currentTime + Number(secs),
    });
  };

  const handlePlay = (value, trackList, options) => {
    const replay = !!value && value !== FileKey;
    if (state.matches("idle.loaded") || replay) {
      return send({
        type: "OPEN",
        trackList,
        value,
        ...options,
      });
    }

    return send({
      type: "PAUSE",
    });
  };

  const handleEq = () => {
    send({
      type: "EQ",
    });
  };

  const handleClose = () => {
    send({
      type: "CLOSE",
    });
  };

  const handleList = () =>
    send({
      type: "TOGGLE",
      key: "listopen",
    });

  const handleDebug = () =>
    send({
      type: "TOGGLE",
      key: "debug",
    });

  const icon = state.matches("opened.playing") ? (
    <i class="fa-regular fa-circle-pause"></i>
  ) : (
    <i class="fa-solid fa-circle-play"></i>
  );

  const diagnosticProps = {
    id: audioMachine.id,
    states: audioMachine.states,
    state,
    send,
  };

  return {
    diagnosticProps,
    id: audioMachine.id,
    state,
    send,

    icon,
    idle,

    // player methods
    handleDebug,
    handleClose,
    handleSeek,
    handleSkip,
    handlePlay,
    handleList,
    handleEq,
    ...state.context,
  };
};

const Progress = ({ progress, vocab, handleSeek, src }) => {
  const open = Boolean(progress);
  if (vocab) {
    return <Drawer open anchor="bottom"><Box
      sx={{
        p: 2,
        fontSize: '0.85rem',
        color: 'text.secondary',
        position: 'relative',
        '&:before': {
          content: '"😃"',
          position: 'absolute',
          width: 48,
          height: 48,
          top: 10,
          left: 10
        }
      }}
      >{vocab}</Box></Drawer>
  }
  if (!open)
    return (
      <>
        <LinearProgress />
        <Nowrap variant="caption">Loading {src?.substr(0, 50)}...</Nowrap>
      </>
    );
  return (
    <Slider
      min={0}
      max={100}
      sx={{ width: "100%" }}
      onChange={handleSeek}
      value={progress}
    />
  );
};

const VolumeMenu = ({ volume, onChange }) => {
  const menu = useMenu(onChange);
  const { anchorEl } = menu.state.context;
  const className =
    volume > 0 ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
  return (
    <>
      <i onClick={menu.handleClick} class={className}></i>
      {/* {JSON.stringify(menu.state.value)}
     {JSON.stringify(!!anchorEl)} */}
      <Popover
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => menu.handleClose(volume)()}
      >
        <Flex spacing={2} sx={{ p: 2, width: 200 }}>
          <i onClick={() => menu.handleClose(0)()} className={className}></i>
          <Slider
            value={volume}
            min={0}
            max={1}
            step={0.1}
            onChange={(e, num) => {
              menu.handleClose(num)();
            }}
          />
        </Flex>
      </Popover>
    </>
  );
};

const StatePlayer = ({
  // handleDiagnoticsClose,
  diagnosticProps,
  handleDebug,
  icon,
  idle,
  state,
  debug,
  send,
  onMenu,
  onList,
  playlist_db,

  // player methods
  handleClose,
  handleSeek,
  handlePlay,
  handleSkip,
  handleList,
  handleEq,

  // context vars
  src,
  owner,
  volume,
  progress,
  duration,
  scrolling,
  current_time_formatted,
  duration_formatted,
  coords,
  trackList,
  eq,
  retries,
  listopen,
  ...rest
}) => {
  const red =
    "linear-gradient(0deg, rgba(2,160,5,1) 0%, rgba(226,163,15,1) 18px, rgba(255,0,42,1) 30px)";

  const { FileKey, Title, albumImage, artistName } = rest;
  const isFavorite = playlist_db && playlist_db.indexOf(FileKey) > -1;
  const favoriteIcon = (
    <i
      onClick={() => onList(rest)}
      className={`${isFavorite ? "red fa-solid" : "fa-regular"} fa-heart`}
    />
  );

  return (
    <>
      <Drawer anchor="left" onClose={handleList} open={listopen}>
        <Box sx={{ p: 2, width: 400 }}>
          {!!trackList &&
            trackList.map((track) => (
              <Flex
                spacing={1}
                sx={{ mb: 1 }}
                onClick={() => handlePlay(track.FileKey, trackList, track)}
              >
                <Avatar src={track.albumImage} />
                <Stack>
                  <Nowrap variant="body2" width={260}>
                    {FileKey === track.FileKey && (
                      <i class="fa-solid fa-volume-high"></i>
                    )}{" "}
                    {track.Title}
                  </Nowrap>
                  <Nowrap variant="caption" width={260}>
                    {track.artistName || track.albumName}
                  </Nowrap>
                </Stack>
                <Spacer />
                <i
                  onClick={() => onList(track)}
                  className={`${
                    playlist_db && playlist_db.indexOf(track.FileKey) > -1
                      ? "red fa-solid"
                      : "fa-regular"
                  } fa-heart`}
                />
              </Flex>
            ))}{" "}
        </Box>
        {/* <pre>{JSON.stringify(trackList, 0, 2)}</pre> */}
      </Drawer>

      <Bureau elevation={4} open={!idle}>
        {/* <pre>{JSON.stringify(rest, 0, 2)}</pre> */}
        <Stack spacing={2} sx={{ p: 2, alignItems: "center" }} direction="row">
          {!!albumImage && (
            <img
              style={{ borderRadius: 5 }}
              src={albumImage}
              alt={Title}
              width={72}
              height={72}
              onClick={() => onMenu(rest)}
            />
          )}

          <Stack sx={{ width: 240 }}>
            <Nowrap>{artistName}</Nowrap>
            <ScrollingText scrolling={scrolling}>
              <Nowrap sx={{ whiteSpace: "nowrap " }} variant="body2">
                {Title}
              </Nowrap>
            </ScrollingText>
          </Stack>

          <Stack direction="row" sx={{ alignItems: "center" }}>
            {!!handleList && (
              <IconButton onClick={handleList}>
                <i class="fa-solid fa-list-check"></i>
              </IconButton>
            )}
            {/* <ThirtyButton direction="left" onClick={() => handleSkip(-30)} /> */}
            <IconButton size="large" onClick={() => handlePlay()}>
              {icon}
            </IconButton>
            {/* <ThirtyButton direction="right" onClick={() => handleSkip(30)} /> */}
            <IconButton onClick={() => send("END")}>
              <i class="fa-solid fa-forward"></i>
            </IconButton>
            {/* [{volume}] */}
          </Stack>

          <Typography variant="caption">{current_time_formatted}</Typography>

          <Box sx={{ ml: 1, mr: 1, width: "calc(100vw - 500px)" }}>  
            {state.matches("opened.error.fatal") ? (
              <Typography onClick={() => send("RECOVER")}>
                Could not load audio "{src}". Please try again later.
              </Typography>
            ) : (
              <Progress
                vocab={rest.vocab}
                progress={progress}
                handleSeek={handleSeek}
                src={FileKey}
              />
            )}
          </Box>

          <IconButton>{favoriteIcon}</IconButton>
          <Typography variant="caption">{duration_formatted}</Typography>

          {!!coords && eq && (
            <Box>
              <Card sx={{ width: 300, mb: 1 }}>
                <Stack
                  sx={{
                    alignItems: "flex-end",
                    height: 48,
                    width: 300,
                    border: "solid 1px",
                    borderColor: "divider",
                    position: "relative",
                  }}
                  direction="row"
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  >
                    <img src={bg()} alt="cover" />
                  </Box>

                  {coords.map((f) => (
                    <Box
                      sx={{
                        background: red,
                        ml: "1px",
                        width: "9px",
                        height: Math.abs(f.bar_height / 4),
                      }}
                    ></Box>
                  ))}
                </Stack>
              </Card>
            </Box>
          )}
          <VolumeMenu
            volume={volume}
            onChange={(val) => {
              send({
                type: "SOUND",
                value: val,
              });
            }}
          />

          <i
            onClick={() => onMenu(rest)}
            className="fa-solid fa-ellipsis-vertical"
          ></i>
          {/* <Box onClick={handleDebug} sx={{ mr: 2 }}>
            <i class="fa-solid fa-gear"></i>
          </Box> */}
          <i onClick={handleClose} className="fa-solid fa-xmark"></i>
          {/* <IconButton>
          </IconButton>
          <IconButton>
          </IconButton> */}
        </Stack>
      </Bureau>
      {/* {JSON.stringify(debug)} */}
      <Diagnostics {...diagnosticProps} open={debug} />
    </>
  );
};

// const ThirtyButton = ({ direction, onClick }) => {
//   return (
//     <IconButton
//       onClick={onClick}
//       sx={{ position: "relative", width: 40, height: 40 }}
//     >
//       <i className={`fa-solid fa-arrow-rotate-${direction}`}></i>
//       <Typography
//         variant="caption"
//         sx={{ fontSize: "0.5rem", fontWeight: 700, position: "absolute" }}
//       >
//         30
//       </Typography>
//     </IconButton>
//   );
// };

// const Text = ({ scrolling, children }) => {
//   if (scrolling) {
//     return (
//       <Marquee play gradientColor="#222">
//         {children}
//       </Marquee>
//     );
//   }
//   return children;
// };

// const rbg = () => {
//   const hu = () => Math.ceil(Math.random() * 255);
//   return `rgb(${hu()},${hu()},${hu()})`;
// };

function bg() {
  var c = document.createElement("canvas");
  c.width = 300;
  c.height = 48;
  var ctx = c.getContext("2d");
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "white";
  ctx.beginPath();
  for (let y = 0; y < 100; y += 4) {
    ctx.moveTo(0, y);
    ctx.lineTo(300, y);
    ctx.stroke();
  }
  return c.toDataURL("image/png");
}

StatePlayer.defaultProps = {};
export default StatePlayer;
