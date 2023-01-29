import React from 'react'; 
import {
  styled,
  Divider,
  IconButton,
  Card,
  Box, 
  Chip,
  Stack,
  Typography 
} from '@mui/material'; 

const IceCream = styled(Box)(({ open }) => ({ 
  position: 'fixed',
  left: 20,
  top: !open ? -400 : 80,
  transition: 'top 0.4s linear',
  zIndex: 400
}))

const ChipBody = ({ children }) => {
  return (
    <Typography sx={{ lineHeight: 0.9 }} variant="caption">
      {children}
    </Typography>
  );
}; 

const TargetNode = ({ id, target, prefix }) => {
  const item = Array.isArray(target) ? target.pop() : target;

  if (item) {
    return (
      <ChipBody>
        ↳ <em>{item.replace(`${id}.`, '').replace(`${prefix}.`, '')}</em>
      </ChipBody>
    );
  }

  return <i />;
};

const EventNode = ({ event, id, prefix, current, name, transitions }) => {
  if (event?.target) {
    return (
      <>
        <TargetNode target={event.target} />
      </>
    );
  }

  if (transitions) {
    const trans = transitions.find((t) => t.event === name);
    const transition = Array.isArray(trans) ? trans.pop() : trans;
    if (!transition?.target) {
      if(Object.values(current).length) {
        return <ChipBody>↳ {Object.values(current)[0]}</ChipBody>;
      }
      return <ChipBody>↳ {JSON.stringify(current)}</ChipBody>;
    }
    const target = transition.target[0];
    return (
      <>
        <TargetNode id={id} target={target.id || target} prefix={prefix} />
      </>
    );
    // return JSON.stringify(target.id || target)
  }
  return <i />;
};

const StatusChip = ({
  id,
  prefix,
  name,
  current,
  previous,
  events,
  transitions,
}) => {
  if (!Object.keys(events).length) return <i />;
  return (
    <Chip
      color={name === previous ? 'error' : 'primary'}
      label={
        <Stack>
          <Typography sx={{ lineHeight: 0.9 }} variant="subtitle2">
            {name}
          </Typography>
          <EventNode
            id={id}
            event={events[name]}
            name={name}
            transitions={transitions}
            current={current}
            prefix={prefix}
          />

          {/* {!!events[name].target && (
            <Typography sx={{ lineHeight: 0.9 }} variant="caption">
              ↳ <em>{events[name].target}</em>
            </Typography>
          )} */}
        </Stack>
      }
      sx={{ mb: 1 }}
      variant="outlined"
    />
  );
};

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const StateName = ({ state }) => {
  if (typeof state === 'string') {
    return state;
  }
  if (!Object.keys(state)) return <>huh</>;
  return (
    <>
      {Object.keys(state)[0]}.{Object.values(state)[0]}
    </>
  );
};

const Diagnostics = ({ id, send, state, states, open, onClose, layer }) => {
  const { previous } = state.context;
  const event = getEvent(states, state);

  if (!event) return <>{JSON.stringify(state.value)}</>;

  const events = event.on;
  const prefix =
    typeof state.value === 'string' ? state.value : Object.keys(state.value)[0];

 

  return (
    <IceCream key={id} open={!!open ? 1 : 0} >
      <Card sx={{ mt: 2, width: 'fit-content', minWidth: 400 }}>
        <Layout data-testid="test-for-Diagnostics">
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Typography variant="body2">
              Machine ID: <em>"{id}"</em>  
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            {!!onClose && (
              <IconButton
                onClick={onClose}
              >
                {' '}
                <i className="fa-solid fa-xmark"></i>
              </IconButton>
            )}
          </Stack>
          <Divider sx={{ m: (t) => t.spacing(0.5, 0) }} />
          <Typography variant="body2">
            Current state:{' '}
            <b>
              <StateName state={state.value} />
            </b>
          </Typography>

          <Divider sx={{ m: (t) => t.spacing(0.5, 0) }} />
          {!!previous && (
            <>
              <Typography variant="body2">
                Last event: <b>{JSON.stringify(previous)}</b>
              </Typography>
              <Divider sx={{ m: (t) => t.spacing(0.5, 0) }} />
            </>
          )}
          <Stack>
            <Typography variant="caption">
              Events available in{' '}
              <em>
                <StateName state={state.value} />
              </em>{' '}
              state
            </Typography>
            <Stack direction="row" sx={{ flexWrap: 'wrap' }} spacing={1}>
              {!!events &&
                Object.keys(events).map((key) => (
                  <StatusChip
                    id={id}
                    prefix={prefix}
                    key={key}
                    name={key}
                    previous={previous}
                    events={events}
                    current={state.value}
                    transitions={event.transitions}
                  />
                ))}
            </Stack>
          </Stack>
        </Layout>

        {/* {JSON.stringify(event.on, 0, 2)} */}
      </Card>
    </IceCream>
  );
};
Diagnostics.defaultProps = {};
export default Diagnostics;

export const getEvent = (states, state) => {
  return typeof state.value === 'string'
    ? states[state.value]
    : states[Object.keys(state.value)[0]].states[Object.values(state.value)[0]];
};


 