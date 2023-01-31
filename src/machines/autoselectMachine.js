import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";

const autoselectMachine = createMachine({
  id: "auto_select",
  initial: "idle",
  states: {
    idle: {
      on: {
        SELECT: {
          target: "selecting",
          actions: assign((context, event) => ({
            value: event.value
          })),
        },
        CHANGE: {
          target: "changing",
          actions: assign((context, event) => ({
            change: event.value
          })),
        },
      },
    },
    selecting: {
      invoke: {
        src: "valueSelected",
        onDone: [
          {
            target: "idle", 
          },
        ],
        onError: [
          {
            target: "idle"
          }
        ]
      },
    },
    changing: {
      after: {
        1999: {
          target: 'idle'
        }
      },
      invoke: {
        src: "valueChanged",
        onDone: [
          {
            target: "idle",
            actions: assign((context, event) => ({
              options: event.data
            })),
          },
        ],
        onError: [
          {
            target: "idle"
          }
        ]
      },
    },
  },
  context: { value: "", options: [] },
  predictableActionArguments: true,
  preserveActionOrder: true,
});


export const useAutoselect = ({ valueChanged, valueSelected }) => {
  const [state, send] = useMachine(autoselectMachine, {
    services: {
      valueChanged,
      valueSelected
    },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
};
