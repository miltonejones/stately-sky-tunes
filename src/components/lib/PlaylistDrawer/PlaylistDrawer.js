import React from "react";
import { Drawer, Typography, Box } from "@mui/material"; 
import { Flex, Spacer, ScrollingText, Prompt , Circle} from "../../../styled";
import { Diagnostics } from "..";

const PlaylistDrawer = ({ state, send, handleEdit,  diagnosticProps, createKey }) => {
  const { open, playlists, track } = state.context;

  if (!(!!playlists?.records && !!track)) return  <Diagnostics {...diagnosticProps} />;
  return (
    <>
          <Diagnostics {...diagnosticProps} />
      <Drawer anchor="left" open={open} onClose={() => send("CLOSE")}> 
        <Box sx={{ width: 400, maxWidth: '75vw', m: 2 }}>

        <ScrollingText scrolling={track.Title.length > 35}>
          <Typography sx={{ m: 1 }} variant="body2">
            Add "{track.Title}" to playlist:
          </Typography>
        </ScrollingText> 

          {playlists.records
            .sort((a,b) => a.Title.toLowerCase() >  b.Title.toLowerCase() ? 1 : -1)
            .map((playlist) => (
            <Flex
              onClick={() =>  handleEdit(playlist.listKey || createKey(playlist.Title))}
              sx={{ mb: 1, width: 380, maxWidth: '75vw' }}
              spacing={1}
            >
              <Circle size="small" src={playlist.image} />
              <Typography variant="body2">{playlist.Title}</Typography>
              <Spacer />
              <i className={`fa-${
                  playlist.related.indexOf(track.FileKey) > -1
                    ? "solid"
                    : "regular"
                } fa-heart`} 
              />
            </Flex>
          ))}

          <Prompt
            label="New Playlist"
            placeholder="Type new list name"
            name="newlist"
            value={state.context.newlist}
            onSubmit={ () => {
              send({
                type: 'CREATE',
                listname: state.context.newlist,
                track
              });

              send({
                type: 'PROP',
                key: "newlist",
                value: null
              })

            }}
            onChange={e => {
              send({
                type: 'PROP',
                key: e.target.name,
                value: e.target.value
              })
            }}
          />
        </Box>
      </Drawer>
    </>
  );
};
PlaylistDrawer.defaultProps = {};
export default PlaylistDrawer;
