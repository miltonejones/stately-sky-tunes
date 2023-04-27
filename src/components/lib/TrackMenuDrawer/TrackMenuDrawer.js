import React from "react";
import {
  Drawer,
  LinearProgress,
  Typography,
  TextField,
  Stack,
  Box,
  Collapse,
  styled
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Flex, Spacer, Nowrap, Prompt, LiteButton } from "../../../styled";
import { AutoSelect, Diagnostics, ConfirmPopover } from "..";
import { searchGroupByType } from "../../../connector"; 

const Cd = styled('img')(() => ({
  width: 150,
  aspectRatio: "1 / 1",
  borderRadius: 5,
  '@media screen and (max-width: 912px) and (orientation: landscape)': {
    width: 48,
  } 
}))
 


const TrackMenuDrawer = ({
  track,
  open,
  busy,
  state,
  onList,
  diagnosticProps,
  onListEdit,
  onMove,
  onQueue,
  results,
  debug,
  handleGoto,
  listkind,
  send,
  handler
}) => {


  // const moveLinks = [
  //   {
  //     label: "Remove from playlist",
  //     caption: "Remove track from this playlist",
  //     icon: <i className="fa-solid fa-trash-can"></i>,
  //     action: () => {
  //       onListEdit(track);
  //       send("CLOSE");
  //     }, 
  //     confirm: `Remove "${track.Title}" from playlist?`
  //   },
  //   {
  //     label: "Move track up",
  //     caption: "Move track up in the playlist",
  //     icon: <i className="fa-solid fa-chevron-up"></i>,
  //     action: () => onMove(track.FileKey, -1)
  //   },
  //   {
  //     label: "Move track down",
  //     caption: "Move track down in the playlist",
  //     icon: <i className="fa-solid fa-chevron-down"></i>, 
  //     action: () => onMove(track.FileKey, 1)
  //   },
  // ]

  
  const navLinks = [
    {
      label: "View Artist",
      action: () => handleGoto("/list/artist/" + track.artistFk),
      caption: track.artistName,
      icon: <i className="fa-solid fa-person"></i>,
      hide: !track.artistFk,
    },
    {
      label: "View Album",
      action: () => handleGoto("/list/album/" + track.albumFk),
      caption: track.albumName,
      icon: <i className="fa-solid fa-compact-disc"></i>,
    },
    {
      label: "View Genre",
      action: () => handleGoto("/list/genre/" + track.Genre),
      caption: track.Genre,
      icon: <i className="fa-solid fa-tag"></i>,
    },
    {
      label: "Edit this track",
      caption: "Open the track editor",
      action: () => send("EDIT"),
      icon: <i className="fa-solid fa-pen"></i>,
    },
    {
      
      label: "Dedicate song",
      caption: "Introduce song with dedication",
      confirm: <Prompt value={handler.dedication}
        name="dedication"
        label="Enter dedication name"
        placeholder="Type name"
        onSubmit={e =>  {  
          onQueue({
            ...track,
            dedication: handler.dedication
          });
          send("CLOSE");
        }}
        onChange={e => {
          handler.send({
            type: 'PROP',
            key: e.target.name,
            value: e.target.value
          })
        }}
        />,


      icon: <i className="fa-solid fa-radio"></i>,
      action: () => {  
        onQueue({
          ...track,
          dedication: handler.dedication
        });
        send("CLOSE");
      },
    },
    {
      label: "Add to queue",
      caption: "Play this song next",
      icon: <i className="fa-solid fa-list-check"></i>,
      action: () => {
        onQueue(track);
        send("CLOSE");
      },
    },
    {
      label: "Add to playlist",
      action: () => {
        onList(track);
        send("CLOSE");
      },
      caption: listkind === 'playlist' ? "Save this song to another playlist" : "Save this song to play later",
      icon: <i className="fa-solid fa-list-ol"></i>,
    },


    {
      label: "Remove from playlist",
      caption: "Remove track from this playlist",
      icon: <i className="fa-solid fa-trash-can"></i>,
      action: () => {
        onListEdit(track);
        send("CLOSE");
      }, 
      confirm: `Remove "${track.Title}" from playlist?`,
      hide: listkind !== 'playlist' 
    },
    {
      label: "Move track up",
      caption: "Move track up in the playlist",
      icon: <i className="fa-solid fa-chevron-up"></i>,
      action: () => onMove(track.FileKey, -1),
      hide: listkind !== 'playlist' 
    },
    {
      label: "Move track down",
      caption: "Move track down in the playlist",
      icon: <i className="fa-solid fa-chevron-down"></i>, 
      action: () => onMove(track.FileKey, 1),
      hide: listkind !== 'playlist' 
    },

  ]
  
 
  return (
    <>
      <Diagnostics {...diagnosticProps} open={debug} />
      <Drawer anchor="right" open={open} onClose={() => send("CLOSE")}>
        {!!busy && <LinearProgress />}
  
        <Box sx={{ width: 400, maxWidth: '75vw', m: 2 }}>
          {/* {JSON.stringify(state.value)} */}

          <Flex start spacing={1}>
            <Cd
              src={track.albumImage}
              alt={track.Title}
            />
            <Stack>
              <Typography>{track.Title}</Typography>
              <Typography variant="caption">{track.artistName}</Typography>
            </Stack>
            <Spacer />
            {/* {state.matches('opened') &&   <i onClick={() => send('DEBUG')} className="fa-solid fa-gear"></i>} */}
          </Flex>

          <Collapse in={state.matches("editing.itunes.loaded")}>
            <Flex sx={{ p: 1 }} spacing={1} onClick={() => send("CLOSE")}>
              <i className="fa-solid fa-arrow-left"></i>
              back
            </Flex>

            {results?.map((result) => (
              <Flex
                key={result.trackId}
                spacing={1}
                sx={{ mb: 1 }}
                onClick={() => {
                  send({
                    type: "CLOSE",
                    suggestion: result,
                  });
                }}
              >
                <Avatar src={result.albumImage} />
                <Stack>
                  <Nowrap variant="body2">{result.Title}</Nowrap>
                  <Nowrap variant="caption">{result.artistName}</Nowrap>
                  <Nowrap variant="caption">{result.albumName}</Nowrap>
                </Stack>
              </Flex>
            ))}
          </Collapse>

          <Collapse in={state.matches("editing.idle")}>
            {state.matches("editing.idle") && (
              <EditForm send={send} {...track} />
            )}
          </Collapse>

          <Collapse in={state.matches("opened.idle")}>
            <Box sx={{ mt: 4, mb: 4 }}>
              {navLinks
                .filter(nav => !nav.hide)
                .map((nav) => (
                <ConfirmBox 
                  confirm={nav.confirm} 
                  onChange={ok => !!ok && nav.action && nav.action()}><Flex
                  sx={{ mb: 1, cursor: "pointer" }}
                  onClick={() => !!nav.action && !nav.confirm && nav.action()}
                  spacing={1}
                  key={nav.label}
                >
                  <Avatar size="small">{nav.icon}</Avatar>
                  <Stack>
                    <Nowrap>{nav.label}</Nowrap>
                    <Nowrap variant="caption">{nav.caption}</Nowrap>
                  </Stack>
                </Flex></ConfirmBox>
              ))}
            </Box>
          </Collapse>

          {/* {JSON.stringify(state.value)}
       <pre>
       {JSON.stringify(track    ,0,2)}
       </pre> */}
        </Box>
      </Drawer>
    </>
  );
};

const ConfirmBox = ({ confirm, children, onChange }) => {
  if (!confirm) return children;
  return <ConfirmPopover message={confirm} onChange={onChange}>
    {children}
  </ConfirmPopover> 
}

function EditForm({
  Title,
  albumFk,
  albumName,
  albumImage,
  artistFk,
  artistName,
  Genre,
  listkind,
  discNumber,
  trackNumber,
  send,
}) {
  const handleChange = (key) => (event) => {
    send({
      type: "CHANGE",
      key,
      value: !event.target ? event : event.target.value,
    });
  };

  const valueSelector = (fk, key) => async (context, event) => {
    const { value } = context;
    alert(JSON.stringify(value));
    handleChange(fk)(value.ID);
    handleChange(key)(value.name);
  };

  const valueChanger = (mediaType) => async (context, event) => {
    const value = context.change;
    if (!value?.length) return;
    const opts = await searchGroupByType(mediaType, value, 1);
    if (opts.records?.length) {
      return opts.records.map((rec) => ({
        name: rec.Name || rec.Genre,
        image: rec.Thumbname,
        ID: rec.ID,
      }));
    }
  };

  return (
    <Stack spacing={1} sx={{ mt: 4 }}>
      <Flex>
        <TextField
          label="Track Name"
          fullWidth
          size="small"
          autoComplete="off"
          value={Title}
          onChange={handleChange("Title")}
        />
      </Flex>

      <Flex spacing={1}>
        <TextField
          label="Disc Number"
          size="small"
          autoComplete="off"
          value={discNumber}
          onChange={handleChange("discNumber")}
        />
        <TextField
          label="Track Number"
          size="small"
          autoComplete="off"
          value={trackNumber}
          onChange={handleChange("trackNumber")}
        />
      </Flex>

      <Flex>
        <AutoSelect
          type="album"
          onValueSelected={async (val) => {
            handleChange("albumFk")(val.ID);
            handleChange("albumName")(val.name);
          }}
          valueSelected={valueSelector("albumFk", "albumName")}
          valueChanged={valueChanger("album")}
          value={{
            name: albumName,
            image: albumImage,
            ID: albumFk,
          }}
        />
        {/* <TextField
          fullWidth
          size="small"
          autoComplete="off"
          value={albumName}
          onChange={handleChange("albumName")} 
        />*/}
      </Flex>
      <Flex>
        <AutoSelect
          type="artist"
          onValueSelected={(val) => {
            handleChange("artistFk")(val.ID);
            handleChange("artistName")(val.name);
          }}
          valueChanged={valueChanger("album")}
          value={{
            name: artistName,
            image: albumImage,
            ID: artistFk,
          }}
        />
        {/* <TextField
          fullWidth
          size="small"
          autoComplete="off"
          value={artistName}
          onChange={handleChange("artistName")} */}
        {/* /> */}
      </Flex>
      <Flex>
        <AutoSelect
          type="genre"
          onValueSelected={(val) => {
            handleChange("Genre")(val.ID);
          }}
          valueChanged={valueChanger("genre")}
          value={{
            name: Genre,
            ID: Genre,
          }}
        />
        {/* <TextField
          fullWidth
          size="small"
          autoComplete="off"
          value={Genre}
          onChange={handleChange("Genre")}
        /> */}
      </Flex>
      <Flex spacing={1}>
        <i onClick={() => send("LOOKUP")} className="fa-brands fa-apple"></i>
        <Spacer />
        <LiteButton size="small" onClick={() => send("CLOSE")}>
          cancel
        </LiteButton>
        <LiteButton
          size="small"
          variant="contained"
          onClick={() => send("SAVE")}
        >
          save
        </LiteButton>
      </Flex>
    </Stack>
  );
}
TrackMenuDrawer.defaultProps = {};
export default TrackMenuDrawer;
