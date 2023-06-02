import React from "react";
import {
  Avatar,
  Stack,
  Box,
  IconButton,
  styled,
  useMediaQuery,
} from "@mui/material";
import {
  Flex,
  Spacer,
  Player,
  Progress,
  Equalizer,
  Nowrap,
  Columns,
  VocabDrawer,
} from "../../../styled";

const Responsive = styled((props) => <Box {...props} />)(({ theme }) => ({
  display: "none",
  "@media screen and (max-width: 912px) and (orientation: landscape)": {
    display: "inline-block",
  },
}));

const SmallPlayer = ({ handler, track, audio }) => {
  const { handleList, progress, eq, coords, handleSeek, onMenu } = handler;
  const rotated = useMediaQuery(
    "@media screen and (max-width: 912px) and (orientation: landscape)"
  );

  const handleEq = () =>
    handler.send({
      type: "TOGGLE",
      key: "showeq",
    });

  const maxWidth = rotated ? "30vw" : "calc(100vw - 200px)";
  const eqWidth = window.innerWidth * 0.375;
  return (
    <Player small open={["opened", "replay"].some(handler.state.matches)}>
      <Box sx={{ m: 1 }}>
        <Columns columns="56px 1fr">
          <Avatar
            onClick={() => audio.play()}
            variant="rounded"
            sx={{ width: 64, height: 64 }}
            src={handler.albumImage}
            alt={handler.Title}
          />
          <Stack>
            <Columns
              spacing={1}
              sx={{
                justifyContent: "center",
                m: (theme) => theme.spacing(0, 1),
              }}
              columns="48px 1fr 48px 24px"
            >
              <Nowrap wrap small>
                {handler.current_time_formatted}
              </Nowrap>

              {handler.state.matches("opened.preview") ? (
                <Nowrap tiny muted>
                  DJ loading...
                </Nowrap>
              ) : (
                <>
                  <Progress
                    min={0}
                    max={100}
                    onChange={handleSeek}
                    value={Math.floor(progress)}
                  />
                  {/* [{progress}] */}
                </>
              )}

              <Nowrap wrap small muted>
                {handler.duration_formatted}
                {/* {Math.floor(progress)}% */}
              </Nowrap>

              <i
                onClick={() => {
                  handler.send("CLOSE");
                }}
                className="fa-solid fa-xmark"
              />
            </Columns>

            <Flex spacing={1} sx={{ m: (theme) => theme.spacing(0, 1) }}>
              <Stack onClick={handleEq}>
                <Nowrap sx={{ maxWidth }} small>
                  {handler.Title}
                </Nowrap>
                <Nowrap tiny muted sx={{ maxWidth }}>
                  {handler.albumName} - {handler.artistName}
                </Nowrap>
              </Stack>

              <Spacer />

              <IconButton onClick={() => handler.send("PAUSE")}>
                {handler.icon}
              </IconButton>

              <Responsive>
                <i
                  className="fa-solid fa-forward"
                  onClick={() => handler.send("END")}
                ></i>
              </Responsive>

              <Responsive>
                {!!coords && eq && (
                  <Equalizer
                    label={`${handler.Title} - ${handler.artistName}`}
                    onClick={handleEq}
                    width={eqWidth}
                    coords={coords}
                  />
                )}
              </Responsive>

              {!!handleList && (
                <i onClick={handleList} class="fa-solid fa-list-check"></i>
              )}

              <Responsive>
                <i
                  onClick={() => onMenu(track)}
                  className="fa-solid fa-ellipsis-vertical"
                ></i>
              </Responsive>
            </Flex>
          </Stack>
        </Columns>
      </Box>
      {!!handler.vocab && <VocabDrawer>{handler.vocab}</VocabDrawer>}
    </Player>
  );
};
SmallPlayer.defaultProps = {};
export default SmallPlayer;
