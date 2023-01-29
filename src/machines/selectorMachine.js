import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";

export const selectorMachine = createMachine({
  id: "select_menu",
  initial: "idle",
  states: {
    idle: {
      on: {
        SELECT: {
          target: "selected",
          actions: assign({ selected: (context, event) => event.value }),
        },
      },
    },
    selected: {
      initial: "selecting",
      states: {
        selecting: {
          invoke: {
            src: "onSelected",
            onDone: [
              {
                target: "idle",
              },
            ],
          },
        },
        idle: {
          on: {
            CLOSE: {
              target: "closing",
              actions: assign({ selected: null }),
            },
          },
        },
        closing: {
          invoke: {
            src: "onSelected",
            onDone: [
              {
                target: "#select_menu.idle",
              },
            ],
          },
        },
      },
    },
  },
  context: {},
  predictableActionArguments: true,
  preserveActionOrder: true,
});


export const useSelector= (onChange) => {
  const [state, send] = useMachine(selectorMachine, {
    services: {
      onSelected: async (context, event) => { 
        onChange(event.value);
      }, 
    },
  }); 
 
    
  const handleClick = (value) =>
    send({
      type: 'SELECT',
      value
    }); 

  return {
    state,
    send,
    ...state.context,
    handleClick,
    handleClose: () => send('CLOSE'), 
  };
};
