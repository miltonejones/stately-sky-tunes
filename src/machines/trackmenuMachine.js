import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react'; 

export  const trackmenuMachine = createMachine({
  id: "track_menu",
  initial: "idle",
  states: {
    idle: {
      on: {
        OPEN: {
          target: "opened",
          actions: "assignTrack",
        },
      },
    },
    opened: {
      initial: "idle",
      states: {
        idle: {
          on: {
            QUEUE: {
              target: "queue",
            },
            GO: {
              target: "navigate",
              actions: "assignLocation",
            },
            ADD: {
              target: "playlist",
            },
            EDIT: {
              target: "#track_menu.editing",
            },
          },
        },
        queue: {
          invoke: {
            src: "addToQueue",
            onDone: [
              {
                target: "closing",
                actions: "logResponse",
              },
            ],
          },
        },
        closing: {
          invoke: {
            src: "setResponse",
            onDone: [
              {
                target: "#track_menu.idle",
                actions: assign({ open: false }),
              },
            ],
          },
        },
        navigate: {
          invoke: {
            src: "handleNavigation",
            onDone: [
              {
                target: "closing",
              },
            ],
          },
        },
        playlist: {
          invoke: {
            src: "openPlaylist",
            onDone: [
              {
                target: "closing",
              },
            ],
          },
        },
      },
    },
    editing: {
      initial: "idle",
      states: {
        idle: {
          on: {
            LOOKUP: {
              target: "itunes",
            },
            CLOSE: {
              target: "#track_menu.opened.idle",
            },
            SAVE: {
              target: "saving",
            },
          },
        },
        itunes: {
          initial: "loading",
          states: {
            loading: {
              invoke: {
                src: "iTunesSearch",
                onDone: [
                  {
                    target: "loaded",
                    actions: "assignResults",
                  },
                ],
                onError: [
                  {
                    target: "error",
                  },
                ],
              },
            },
            loaded: {
              on: {
                CLOSE: {
                  target: "#track_menu.editing.idle",
                  actions: "assignSuggestion",
                },
              },
            },
            error: {
              on: {
                RECOVER: {
                  target: "#track_menu.editing.idle",
                },
              },
            },
          },
        },
        saving: {
          invoke: {
            src: "saveTrack",
            onDone: [
              {
                target: "#track_menu.opened.idle",
                actions: "assignResponse",
              },
            ],
          },
        },
      },
    },
  },
  context: { track: {},  open: false },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  actions: { 
    assignProblem: assign((context, event) => {
      return {
        errorMsg: event.data.message,
        stack: event.data.stack
      }
    }),
    assignTrack: assign((context, event) => {
      return {
        track: event.track,
        open: true
      }
    }),
    assignLocation: assign((context, event) => {
      return {
        href: event.href
      }
    }),
    logResponse: assign((context, event) => {
      return event
    }),
    assignSuggestion: assign((context, event) => {
      return event
    }),
    assignResponse: assign((context, event) => {
      return event
    }),
    
  }
});

export const useTrackmenuMachine = () => {

  const [state, send] = useMachine(trackmenuMachine, {
    services: {  
      addToQueue: async (context) => { 
      }, 
      setResponse: async (context) => { 
      }, 
      handleNavigation: async (context) => { 
      }, 
      openPlaylist: async (context) => { 
      }, 
      iTunesSearch: async (context) => { 
      }, 
      saveTrack: async (context) => { 
      }, 
    },
  });

  const diagnosticProps = {
    id: trackmenuMachine.id,
    states: trackmenuMachine.states,
    state,
    send,
  }

  const handleOpen = track => { 
    send({
      type: 'OPEN',
      track
    })
  }
 
   

  return {
    state,
    send,
    handleOpen, 
    diagnosticProps, 
  }

}