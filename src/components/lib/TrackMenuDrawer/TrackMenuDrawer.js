import React from "react";
import { Drawer, Typography, TextField, Stack, Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Flex, LiteButton } from "../../../styled";

const TrackMenuDrawer = ({ track, open, state, handleGoto, send }) => {
  const navLinks = [
    {
      label: "View Artist",
      action: () => handleGoto("/list/artist/" + track.artistFk),
      caption: track.artistName,
      icon: <i class="fa-solid fa-person"></i>,
      when: !!track.artistFk,
    },
    {
      label: "View Album",
      action: () => handleGoto("/list/album/" + track.albumFk),
      caption: track.albumName,
      icon: <i class="fa-solid fa-compact-disc"></i>,
    },
    {
      label: "View Genre",
      action: () => handleGoto("/list/genre/" + track.Genre),
      caption: track.Genre,
      icon: <i class="fa-solid fa-tag"></i>,
    },
    {
      label: "Edit this track",
      caption: "Open the track editor",
      action: () => send("EDIT"),
      icon: <i class="fa-solid fa-pen"></i>,
    },
    {
      label: "Add to queue",
      caption: "Play this song next",
      icon: <i class="fa-solid fa-list-check"></i>,
    },
    {
      label: "Add to playlist",
      caption: "Save this song to play later",
      icon: <i class="fa-solid fa-list-ol"></i>,
    },
  ];

  return (
    <Drawer anchor="left" open={open} onClose={() => send("CLOSE")}>
      <Box sx={{ width: 400, m: 2, overflow: "hidden" }}>
        <img
          src={track.albumImage}
          alt={track.Title}
          style={{
            width: 150,
            aspectRatio: "1 / 1",
            borderRadius: 5,
          }}
        />
        {JSON.stringify(state.value)}
        {!!state.matches("editing") && <EditForm send={send} {...track} />}
        {!state.matches("editing") && (
          <Box>
            {navLinks.map((nav) => (
              <Flex
                onClick={() => !!nav.action && nav.action()}
                spacing={1}
                key={nav.label}
              >
                <Avatar size="small">{nav.icon}</Avatar>
                <Stack>
                  <Typography>{nav.label}</Typography>
                  <Typography variant="caption">{nav.caption}</Typography>
                </Stack>
              </Flex>
            ))}
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

function EditForm({
  Title,
  albumName,
  artistName,
  Genre,
  discNumber,
  trackNumber,
  send,
}) {
  const handleChange = (key) => (event) => {
    send({
      type: "CHANGE",
      key,
      value: event.target.value,
    });
  };

  return (
    <Stack spacing={1}>
      <Flex>
        <TextField
          fullWidth
          size="small"
          autoComplete="off"
          value={Title}
          onChange={handleChange("Title")}
        />
      </Flex>

      <Flex spacing={1}>
        <TextField
          size="small"
          autoComplete="off"
          value={discNumber}
          onChange={handleChange("discNumber")}
        />
        <TextField
          size="small"
          autoComplete="off"
          value={trackNumber}
          onChange={handleChange("trackNumber")}
        />
      </Flex>

      <Flex>
        <TextField
          fullWidth
          size="small"
          autoComplete="off"
          value={albumName}
          onChange={handleChange("albumName")}
        />
      </Flex>
      <Flex>
        <TextField
          fullWidth
          size="small"
          autoComplete="off"
          value={artistName}
          onChange={handleChange("artistName")}
        />
      </Flex>
      <Flex>
        <TextField
          fullWidth
          size="small"
          autoComplete="off"
          value={Genre}
          onChange={handleChange("Genre")}
        />
      </Flex>
      <Flex>
        <LiteButton onClick={() => send("CLOSE")}>close</LiteButton>
      </Flex>
    </Stack>
  );
}
TrackMenuDrawer.defaultProps = {};
export default TrackMenuDrawer;
