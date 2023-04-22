import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";

export const menuMachine = createMachine({
  id: "settings_menu",
  initial: "closed",
  states: {
    closed: {
      on: {
        open: {
          target: "opening",
          actions: assign({
            anchorEl: (context, event) => event.anchorEl,
          }),
        },
      },
    },
    opening: {
      initial: "opened",
      states: {
        closing: {
          invoke: {
            src: "menuClicked",
            onDone: [
              {
                target: "#settings_menu.closed",
              },
            ],
          },
        },
        opened: {
          on: {
            close: {
              target: "closing",
              actions: assign({
                anchorEl: null,
                value: (context, event) => event.value,
              }),
            },
            prop: {
              actions:[ assign((_, event) => ({
                [event.key]: event.value
              })),]
            }
          },
        },
      },
    },
  },
});

export const useMenu = (onChange) => {
  const [state, send] = useMachine(menuMachine, {
    services: {
      menuClicked: async (context, event) => {
        onChange && onChange(event.value);
      },
    },
  });
  const { anchorEl } = state.context;
  const handleClose = (value) => () =>
    send({
      type: "close",
      value,
    });
  const handleClick = (event) => {
    send({
      type: "open",
      anchorEl: event.currentTarget,
    });
  };

  const diagnosticProps = {
    id: menuMachine.id,
    states: menuMachine.states,
    state,
    send,
  };

  return {
    ...state.context,
    state,
    send,
    anchorEl,
    handleClick,
    handleClose,
    diagnosticProps,
  };
};
