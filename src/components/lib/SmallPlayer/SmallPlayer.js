import React from 'react';
import { Avatar, Stack, Box,
  styled, useMediaQuery } from '@mui/material';
import {
  Flex,
  Spacer,
  Player,
  Progress,
  Equalizer,
  Nowrap,
  Columns,
  VocabDrawer
} from '../../../styled';



const Responsive = styled(props => <Box {...props} />)(({ theme }) => ({ 
  display: 'none',
  '@media screen and (max-width: 913px) and (orientation: landscape)': {
    display: 'inline-block'
  } 
}))




const SmallPlayer = ({ handler, track }) => {
  const { handleList, progress, eq, coords, handleSeek, onMenu } = handler;
  const rotated = useMediaQuery('@media screen and (max-width: 913px) and (orientation: landscape)');

  const handleEq = () =>
    handler.send({
      type: 'TOGGLE',
      key: 'showeq',
    });

  const maxWidth = rotated ? '32vw' : 'calc(100vw - 172px)';
  const eqWidth = window.innerWidth * .4;
  return (
    <Player small open={['opened', 'replay'].some(handler.state.matches)} >
      <Box sx={{ m: 1 }}>
        <Columns columns="56px 1fr">
          <Avatar
            onClick={() => handler.manualPlay()}
            variant="rounded"
            sx={{ width: 64, height: 64 }}
            src={handler.albumImage}
            alt={handler.Title}
          />
          <Stack>
            <Columns
              spacing={1}
              sx={{
                justifyContent: 'center',
                m: (theme) => theme.spacing(0, 1),
              }}
              columns="48px 1fr 48px 24px"
            >
              <Nowrap wrap small>
                {handler.current_time_formatted}
              </Nowrap>
              {handler.state.matches('opened.preview') ? (
                <Nowrap tiny muted>
                  DJ loading...
                </Nowrap>
              ) : (
                <Progress onChange={handleSeek} value={progress} />
              )}
              <Nowrap wrap small muted>
                {handler.duration_formatted}
              </Nowrap>
              <i
                onClick={() => {
                  handler.send('CLOSE');
                }}
                className="fa-solid fa-xmark"
              />
            </Columns>

            <Flex spacing={1} sx={{ m: (theme) => theme.spacing(0, 1) }}>


              {!handler.showeq && (
                <Stack onClick={handleEq}>
                  <Nowrap sx={{ maxWidth }} small>
                    {handler.Title}
                  </Nowrap>
                  <Nowrap tiny muted sx={{ maxWidth }}>
                    {handler.albumName} - {handler.artistName}
                  </Nowrap>
                </Stack>
              )}

              <Spacer />

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



              <Box onClick={() => handler.send('PAUSE')}>{handler.icon}</Box>
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
