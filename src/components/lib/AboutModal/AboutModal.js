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

            <Panel><AboutText selectMachine={selectMachine} /></Panel>
            
          </Columns>
        </Layout>
      </Drawer>
    </>
  );
};
AboutModal.defaultProps = {};
export default AboutModal;

const AboutText = ({ selectMachine }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Nowrap variant="h5">About SkyTunes</Nowrap>
     
    </Box>
  );
};
