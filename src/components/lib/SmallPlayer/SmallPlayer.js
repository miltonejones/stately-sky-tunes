import React from 'react';
import { styled, Card, Avatar, IconButton, Stack, Slider, Box } from '@mui/material';
import { Flex, Spacer, Nowrap, Columns, VocabDrawer } from "../../../styled";
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(1)
}));
 
/**
 * A styled component for a player card.
 * @param {Object} props - Props object.
 * @param {boolean} props.open - Whether or not the player is open.
 * @param {boolean} props.small - Whether or not the player is small.
 * @param {Object} props.theme - The MUI theme object.
 * @returns {JSX.Element} A styled Card component.
 */
export const Player = styled(({ open, small, theme, ...props }) => <Card {...props} />)(({ open, small, theme }) => ({
  position: 'fixed',
  bottom:  open ? 'calc(var(--bottom-bar-offset) + var(--bottom-menu-offset))' : -400,
  transition: "all 0.2s linear",
  height: small ? 'var(--player-offset)' : 116,
  width: '100vw',
  left: 0,
  backgroundColor: 'white'
}));



const SmallPlayer = ({ handler }) => { 
  const { handleList, progress, handleSeek } = handler;

  // const isPaused = handler.state.matches('opened.paused');
  const maxWidth = 'calc(100vw - 172px)';
 return (

  <Player small elevation={4} anchor="bottom" open={['opened', 'replay'].some(handler.state.matches)}>
   <Layout data-testid="test-for-SmallPlayer">
     <Columns columns="56px 1fr">
          <Avatar onClick={() => handler.manualPlay()} variant="rounded" sx={{ width: 64, height: 64 }} src={handler.albumImage} alt={handler.Title} />
          <Stack>
            <Columns spacing={1} sx={{ justifyContent: 'center', m: theme => theme.spacing(0, 1) }} columns="40px 1fr 40px 24px">
              <Nowrap className="item-left" wrap small>{handler.current_time_formatted}</Nowrap>
              {handler.state.matches('opened.preview') ? <>loading...</> 
                :     <Slider
                  min={0}
                  max={100}
                  sx={{ padding: '0px !important',  width: "100%" }}
                  onChange={handleSeek}
                  value={progress}
                />}
              <Nowrap wrap small muted>{handler.duration_formatted}</Nowrap> 
              <i
                onClick={() => {
                  handler.send('CLOSE')
                }}
                className="fa-solid fa-xmark"
              />

              {/* <TinyButton icon="Close" onClick={() => handler.send('CLOSE')} /> */}
            </Columns>
            <Flex sx={{ m: theme => theme.spacing(0, 1) }}>
              <Stack>
                <Nowrap sx={{ maxWidth }} small>{handler.Title}</Nowrap>
                <Nowrap tiny muted sx={{ maxWidth }}>{handler.albumName} - {handler.artistName}</Nowrap>
              </Stack>
              <Spacer />
              <IconButton color="primary" onClick={() => handler.send('PAUSE')}>
                {handler.icon}
              </IconButton>
              {!!handleList && (
                <IconButton onClick={handleList}>
                  <i class="fa-solid fa-list-check"></i>
                </IconButton>
              )}
            </Flex>
          </Stack>
        </Columns>
   </Layout>
   {!!handler.vocab && <VocabDrawer>{handler.vocab}</VocabDrawer>}
  </Player>
 );
}
SmallPlayer.defaultProps = {};
export default SmallPlayer;
