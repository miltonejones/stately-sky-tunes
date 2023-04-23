import React from 'react';
import { Drawer, Avatar, Stack, Box } from '@mui/material';
import { Flex, Spacer, Nowrap } from "../../../styled";
  

const TrackListDrawer = ({ onList, listopen, handleList, trackList, handlePlay, FileKey,  playlist_db }) => {
 return (
  <Drawer anchor="left" onClose={handleList} open={listopen}>
  <Box sx={{ p: 2, width: 400 }}>

    {!!trackList &&
      trackList.map((track) => (
        <Flex
          spacing={1}
          sx={{ mb: 1 }}
          onClick={() => {
            handleList();
            handlePlay(track.FileKey, trackList, track);
          }}
        >
          <Avatar src={track.albumImage} />
          <Stack>
            <Flex  spacing={1}>
              {FileKey === track.FileKey && (
                <i class="fa-solid fa-volume-high"></i>
              )}{" "}
             <Nowrap small > {track.Title}</Nowrap>
            </Flex>
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
  </Drawer>
 );
}
TrackListDrawer.defaultProps = {};
export default TrackListDrawer;
