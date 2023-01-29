import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { useParams } from "react-router-dom";

export const selectorMachine = createMachine({
  id: "select_menu",
  initial: "init",
  states: {
    init: {
      invoke: {
        src: "initialProp",
        onDone: [
          {
            target: "ready",
            cond: (context, event) => !event.data || event.data === 'music', 
          },
          {
            target: "#select_menu.selected.idle",
            actions: assign({ selected: (context, event) => event.data})
          }
        ]
      }
    },
    ready: {
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
                target: "#select_menu.ready",
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
  const { type  } = useParams();
  const [state, send] = useMachine(selectorMachine, {
    services: {
      initialProp: async () => type, 
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
