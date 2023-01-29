import React from "react";
import { Drawer, Typography, Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Flex, Spacer } from "../../../styled";

const PlaylistDrawer = ({ state, send, handleEdit, createKey }) => {
  const { open, playlists, track } = state.context;

  if (!(!!playlists?.records && !!track)) return <></>;
  return (
    <>
      <Drawer anchor="left" open={open} onClose={() => send("CLOSE")}>
        <Typography sx={{ m: 1 }} variant="body2">
          Add "{track.Title}" to playlist:
        </Typography>
        <Box sx={{ width: 400, m: 2 }}>
          {playlists.records.map((playlist) => (
            <Flex
              onClick={() =>
                handleEdit(playlist.listKey || createKey(playlist.Title))
              }
              sx={{ mb: 1, width: 380 }}
              spacing={1}
            >
              <Avatar src={playlist.image} />
              <Typography variant="body2">{playlist.Title}</Typography>
              <Spacer />
              <i
                className={`fa-${
                  playlist.related.indexOf(track.FileKey) > -1
                    ? "solid"
                    : "regular"
                } fa-heart`}
              />
            </Flex>
          ))}
        </Box>
      </Drawer>
    </>
  );
};
PlaylistDrawer.defaultProps = {};
export default PlaylistDrawer;