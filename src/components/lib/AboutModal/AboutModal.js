import React from 'react';
import { styled, IconButton, Stack, Drawer, Box } from '@mui/material';
import {   useSkytunes, useMenu } from '../../../machines';
import { Nowrap, Flex, Spacer, Pill, Columns } from '../../../styled';

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(4),
  height: '80vh',
}));

const Li = styled(Box)(({ theme, offset }) => ({
  marginLeft: theme.spacing(offset),
}));

const Panel = styled(Box)({
  height: 'calc(80vh - 24px)',
  overflow: 'auto',
});

const capitalize = (str) => str.replace(/_/g, ' ');

const StateTree = ({ state, root, offset = 0 }) => {
  const stateKeys = state.states;
  const eventKeys = !state.on ? [] : Object.keys(state.on);

  return (
    <Li offset={offset}>
      {!root && (
        <Stack sx={{ mb: 2 }}>
          <Nowrap wrap>
            <b>{state.key}</b>: {state.description}
          </Nowrap>
          <Nowrap small muted>
            Path: {state.id}
          </Nowrap>

          {!!state.onEntry?.length &&
            state.onEntry
              .filter(entry => entry.type?.indexOf('.') < 0)
              .map((entry) => (
              <Nowrap small>
                Entry action: "<b>{entry.type}</b>"
              </Nowrap>
            ))} 
                 
          {!!state.invoke?.length &&
            state.invoke.map((invoke) => (
              <Nowrap small>
                Invokes service method: "<b>{invoke.src}</b>"
              </Nowrap>
            ))} 
       
            {/* <pre>
            {JSON.stringify(state.onEntry,0,2)}
      {JSON.stringify(Object.keys(state),0,2)}
      </pre> */}
        </Stack>
      )}

     

      {!!root && (
        <Stack sx={{ mb: 2, mt: 2 }}>
          <Nowrap
            sx={{
              textTransform: 'capitalize',
            }}
            variant="h6"
            wrap
          >
            <b>{capitalize(state.id)}</b>
          </Nowrap>
          <Nowrap small muted>
            Machine ID: {state.id}
          </Nowrap>
          <Nowrap small muted>
            Initial state: <b>{state.initial}</b>
          </Nowrap>
          <Nowrap wrap>{state.description}</Nowrap>
        </Stack>
      )}

      {!!eventKeys.length && (
        <Box sx={{ mt: 1, ml: offset + 1 }}>
          <Stack sx={{ mb: 1 }}>
            <Nowrap color="info" bold variant="subtitle2">
              Events in "{state.id}"
            </Nowrap>
            <Nowrap>
              The "{state.key}" state supports the following events
            </Nowrap>
          </Stack>

          <Box sx={{ mb: 1 }}>
            {eventKeys.map((s) => (
              <Li>
                <Stack sx={{ mb: 2 }}>
                  <Nowrap bold>{s}</Nowrap>
                  {state.on[s].map((act) => (
                    <Box sx={{ mb: 1 }}>
                      <Nowrap small muted>
                        Path: {act.event}
                      </Nowrap>
                      {!!act.cond && (
                        <Nowrap small color="error">
                          Condition: {act.cond?.name}
                        </Nowrap>
                      )}
                      {!!act.target?.length && (
                        <Nowrap muted small>
                          Destination:{' '}
                          {act.target.map((act) => (
                            <>
                              "<b>{JSON.stringify(act.id)}</b>"
                            </>
                          ))}
                        </Nowrap>
                      )}
                      {!!act.actions?.length && (
                        <Nowrap small>
                          Invokes machine action:{' '}
                          {act.actions.map((act) => (
                            <>
                              "<b>{act.type}</b>"
                            </>
                          ))}
                        </Nowrap>
                      )}
                      <Nowrap sx={{ mt: 1 }}>{act.description}</Nowrap>
                    </Box>
                  ))}
                </Stack>
              </Li>
            ))}
          </Box>
        </Box>
      )}

      {!!Object.keys(stateKeys).length && (
        <Box sx={{ mt: 1, ml: offset }}>
          <Stack sx={{ mb: 1 }}>
            <Nowrap bold color="info" variant="subtitle2">
              States in "{state.id}"
            </Nowrap>
            <Nowrap>
              The "{state.key}" {root ? 'state machine' : 'state'} has these
              child states
            </Nowrap>
          </Stack>

          {Object.keys(stateKeys).map((s) => (
            <StateTree key={s} offset={offset + 1} state={stateKeys[s]} />
          ))}
        </Box>
      )}
    </Li>
  );
};

const AboutModal = () => { 
  const menu = useMenu();
  const sky = useSkytunes();
  const machines = [sky, menu];

  const selectedMachine = machines.find(
    (f) => f.diagnosticProps.id === menu.selectedMachine
  );
  const selectMachine = (value) => { 
    menu.send({
      type: 'prop',
      key: 'selectedMachine',
      value,
    });
  };
  return (
    <>
      <Nowrap onClick={menu.handleClick} hover small>
        About SkyTunes
      </Nowrap>
      <Drawer
        anchor="bottom"
        onClose={menu.handleClose()}
        open={Boolean(menu.anchorEl)}
      >
        <Layout>
          <Flex spacing={1}>
            <Nowrap>State machines</Nowrap> 
            {machines.map((mac) => (
              <Pill
                sx={{ textTransform: 'capitalize' }}
                onClick={() => selectMachine(mac.diagnosticProps.id)}
                active={mac.diagnosticProps.id === menu.selectedMachine}
                key={mac.diagnosticProps.id}
              >
                <Nowrap small hover>
                  {' '}
                  {capitalize(mac.diagnosticProps.id)}
                </Nowrap>
              </Pill>
            ))}
            <Spacer />
            <IconButton onClick={menu.handleClose()}>
            <i className="fa-solid fa-xmark"></i>
            </IconButton>
          </Flex>

          <Columns sx={{ alignItems: 'flex-start' }}>
            {!!selectedMachine && (
              <Panel>
                <StateTree root state={selectedMachine.diagnosticProps} />
              </Panel>
            )}

            <Panel><AboutText  /></Panel>
            
          </Columns>
        </Layout>
      </Drawer>
    </>
  );
};
AboutModal.defaultProps = {};
export default AboutModal;

const AboutText = () => {
  return (
    <Box sx={{ mt: 2 }}>
      <Nowrap variant="h5">About SkyTunes</Nowrap>
     
<p>
This code block is written in JavaScript and exports a function called `useSkytunes` using the `const` keyword. This function takes a single argument called `onRefresh` which is a callback function. The function uses several hooks from the React library, including `useParams` and `useLocation`, to get the current parameters and location of the application. It also uses a state machine called `skyTunesMachine` and the `useMachine` hook to handle state transitions.
</p>
<p>
The `useSkytunes` function has several services defined that can be called asynchronously using the `await` keyword. These services include `loadArtistInfo`, which loads information about a specific artist, `playDashTracks`, which plays tracks from a specified dashboard, and `loadPlaylists`, which loads playlists for the user. There is also a service called `loadRequest`, which loads different types of data based on the context, such as loading a specific group or doing a search for a specific type of music.
</p>
<p>
There is also a service called `getLocation` which uses the `requestWakeLock` function to request a wake lock from the browser and returns the current pathname of the application. This service is called asynchronously using the `await` keyword.
</p>
<p>
The `useSkytunes` function also defines an object called `diagnosticProps` that contains diagnostic information about the state of the `skyTunesMachine` state machine, including the current state, the ID of the state machine, the available states, and the `send` function that is used to send events to the state machine.
</p>
<p>
The `useEffect` hook is used to call the `send` function with an `OPEN` event when the location changes. This ensures that the state machine is always in the correct state based on the current location of the application.
</p>
<p>
Finally, the `useSkytunes` function returns an object that contains several properties, including `handleAuto`, which is a function that is used to automatically play a specified dashboard. It also includes the current state of the state machine, the `send` function, the title of the application, a boolean value that indicates whether the application is currently loading data, and the `diagnosticProps` object that contains diagnostic information about the state machine.
</p>


    </Box>
  );
};
