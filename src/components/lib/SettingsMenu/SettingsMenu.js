import React from "react";
import { Drawer, Box, Switch,
  Tabs, Stack, Slider, Divider,
  Tab, Typography } from "@mui/material";
import { Diagnostics } from "..";
import { useMenu } from "../../../machines";
import { Flex, Nowrap } from "../../../styled";
import { DJ_OPTIONS }  from '../../../util/djOptions';


const demoLanguages = { 
  Danish: 'da-DK',
  Dutch: 'nl-NL',
  English: 'en-US',
  French: 'fr-FR',
  German: 'de-DE', 
  Italian: 'it-IT',
  Japanese: 'ja-JP', 
  'Portuguese (Portugal, Brazil)': 'pt-PT', 
  Spanish: 'es-ES',
};

const djProps = {
   [DJ_OPTIONS.WEATHER]: 'Current weather (requires location permission)',
  [DJ_OPTIONS.USERNAME]: 'Say the logged in users name',
  [DJ_OPTIONS.TIME]: 'Mention the time',
  [DJ_OPTIONS.UPNEXT]: 'Talk about upcoming tracks',
  [DJ_OPTIONS.RANDOM]: 'Randomize DJ voices',
  [DJ_OPTIONS.SHOW]: 'Show DJ text on screen',
  [DJ_OPTIONS.BOOMBOT]: 'Say station name',
}


const SettingsMenu = ({ handler, value, onChange }) => {
  const [tab, setValue] = React.useState(0);
  const menu = useMenu(onChange);
  const machines = {
    skytunes: "Application",
    audio_player: "Audio Player",
    track_menu: "Track Menu",
    playlist: "Playlist drawer",
    settings_menu: "This Menu",
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDJ = (key) => {
    handler.send({
      type: 'PROP',
      key: 'options',
      value: handler.options & key 
        ? handler.options - key 
        : handler.options + Number(key)
    })
  }

  return (
    <>
      <i onClick={menu.handleClick} class="fa-solid fa-gear"></i>

      <Drawer
        anchor="bottom"
        open={menu.state.matches("opening.opened")}
        onClose={menu.handleClose()}
      >
        <Tabs value={tab} onChange={handleChange}>
          <Tab label="State machines" />
          <Tab label="DJ Control" />
        </Tabs>

      {tab === 1 && <Stack sx={{
        minWidth: 400,
        p: 2
      }}>


         <Nowrap bold small>
          DJ announcer frequency
         </Nowrap>
         <Flex spacing={2}>
          <Slider 
             value={handler.cadence}
             onChange={(_, value) => { 
              handler.send({
                type: 'PROP',
                key: 'cadence',
                value 
              })  
             }}
             min={0}
             max={1}
             step={0.01}
          />
         <Nowrap wrap small muted cap>
          {handler.cadence === 1 
            ? 'always'
            : handler.cadence === 0
            ? 'never'
            : handler.cadence > 0.75
            ? 'often'
            : handler.cadence < 0.25
            ? 'seldom'
            : 'sometimes'}
         </Nowrap>

         </Flex>
            <Divider sx={{ m: theme => theme.spacing(2, 0) }} />

         <Nowrap small bold cap>
         announcer content settings 
         </Nowrap>
         {Object.keys(djProps).map(key => <Flex 
            onClick={() => handleDJ(key)}
            key={key}>
          <Switch 
            disabled={ key === DJ_OPTIONS.BOOMBOT }
            checked={!!(handler.options & key)} />
          <Nowrap small muted={key === DJ_OPTIONS.BOOMBOT}>
            {djProps[key]}
          </Nowrap>
         </Flex>)}


        </Stack>}
      
        {tab === 0 && <Box sx={{ p: 2 }}>
          <Typography>Select a state machine to view its status.</Typography>

          {Object.keys(machines).map((mac) => (
            <Flex
              key={mac}
              onClick={menu.handleClose(mac)}
              sx={{ width: 300, p: 1 }}
            >
              <Nowrap bold={value === mac}> {machines[mac]} </Nowrap>
            </Flex>
          ))}
        </Box>}
      </Drawer>
      <Diagnostics {...menu.diagnosticProps} />
    </>
  );
};

SettingsMenu.defaultProps = {};
export default SettingsMenu;
