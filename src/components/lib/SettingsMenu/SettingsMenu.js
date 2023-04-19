import React from "react";
import { Drawer, Box, Switch, TextField,
  MenuItem,
  Tabs, Stack, Slider, Divider,
  Tab, Typography } from "@mui/material";
import { Diagnostics } from "..";
import { useMenu } from "../../../machines";
import { Flex, Nowrap } from "../../../styled";
import { DJ_OPTIONS }  from '../../../util/djOptions';
import { getDefinition }  from '../../../util/getDefinition';


// const demoLanguages = { 
//   Danish: 'da-DK',
//   Dutch: 'nl-NL',
//   English: 'en-US',
//   French: 'fr-FR',
//   German: 'de-DE', 
//   Italian: 'it-IT',
//   Japanese: 'ja-JP', 
//   'Portuguese (Portugal, Brazil)': 'pt-PT', 
//   Spanish: 'es-ES',
// };

const djProps = {
   [DJ_OPTIONS.WEATHER]: 'Current weather (requires location permission)',
  [DJ_OPTIONS.USERNAME]: 'Say the logged in users name',
  [DJ_OPTIONS.TIME]: 'Mention the time',
  [DJ_OPTIONS.UPNEXT]: 'Talk about upcoming tracks',
  [DJ_OPTIONS.RANDOM]: 'Randomize DJ voices',
  [DJ_OPTIONS.SHOW]: 'Show DJ text on screen',
  [DJ_OPTIONS.BOOMBOT]: 'Say station name',
}


const SettingsMenu = ({ handler, machine }) => {


  const value = machine.active_machine;
  const onChange = (value) => machine.send({
      type: "CHANGE",
      key: "active_machine",
      value,
    })
  


  const [tab, setValue] = React.useState(0);
  const [definition, setDefinition] = React.useState('');
  const menu = useMenu(onChange);
  const machines = {
    skytunes: "Application",
    audio_player: "Audio Player",
    track_menu: "Track Menu",
    playlist: "Playlist drawer",
    settings_menu: "This Menu",
  };

const synth = window.speechSynthesis;
const voices = synth.getVoices();

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

  const handleProp = (e) => {
    handler.send({
      type: 'PROP',
      key: e.target.name,
      value: e.target.value  
    })
    define(e.target.value)
  }

  const define = async (value) => {
    setDefinition('Loading definition...')
    const def = await getDefinition(value);
    setDefinition(def)
  }

  const selectedVoice = handler.voice;

  // React.useEffect(() => {
  //   if (!!definition) return;
  //   if (!selectedVoice) return;
  //   define(selectedVoice);

  // }, [definition, selectedVoice])

  const availableVoices = voices?.filter(voice => !!voice.localService && voice.lang.indexOf('en') > -1);

  // console.log ({
  //   availableVoices
  // })

  // const DEFAULT_VOICE = !availableVoices?.length ? '' : availableVoices[0].name;

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


        <Flex sx={{ mt: 2 }}>
          <TextField select
            label="Choose DJ Voice"
            value={handler.voice || DJ_OPTIONS.BOOMBOT}
            name="voice"
            sx={{ minWidth: 400 }}
            disabled={handler.options & DJ_OPTIONS.RANDOM}
            helperText={definition}
            onChange={handleProp}
            size="small">
              <MenuItem>None selected</MenuItem>
              {availableVoices.map(f => <MenuItem value={f.name} key={f.name}>
                {f.name}
              </MenuItem>)}
            </TextField>
        
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
