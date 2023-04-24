import React from 'react';
import { Drawer, Avatar, Stack, Box } from '@mui/material';
import { Flex, Spacer, Nowrap } from "../../../styled";
  

const TrackListDrawer = ({ onList, listopen, handler, handleList, trackList, handlePlay, FileKey,  playlist_db }) => {

    const handleDedicate = (tr) => {
    const dedication = window.prompt('dedicate to')
    if (!dedication) return;

    handler.send({
      type: 'DEDICATE',
      track: {
        ...tr,
        dedication
      }
    });
      }
 return (
  <Drawer anchor="left" onClose={handleList} open={listopen}>
  <Box sx={{ p: 2, width: 400, maxWidth: '80vw', }}>

    {!!trackList &&
      trackList.map((track) => (
        <Flex
          spacing={1}
          sx={{ mb: 1 }}>
          <Avatar src={track.albumImage} />
          <Stack
            onClick={() => {
              handleList();
              handlePlay(track.FileKey, trackList, track);
            }}
        >
            <Flex  spacing={1}>
              {FileKey === track.FileKey && (
                <i class="fa-solid fa-volume-high"></i>
              )}{" "}
             <Nowrap small sx={{ 
                maxWidth: `calc(80vw - ${FileKey === track.FileKey ? "180px" : "140px"})` , 
                width: FileKey === track.FileKey ? 200 : 240 }} >
              {track.Title}
              </Nowrap>
            </Flex>
            <Nowrap variant="caption" sx={{ maxWidth: 'calc(80vw - 140px)' }}  width={260}>
              {track.artistName || track.albumName}
            </Nowrap>
           {!!track.dedication && <Nowrap muted variant="caption" width={260}>
             Dedicated to <b>{track.dedication}</b>
            </Nowrap>}
          </Stack>
          <Spacer />

          <i onClick={() => handleDedicate(track)} className="fa-solid fa-radio"></i>

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
  </Drawer>
 );
}
TrackListDrawer.defaultProps = {};
export default TrackListDrawer;
