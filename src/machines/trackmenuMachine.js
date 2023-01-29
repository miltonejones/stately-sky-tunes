import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { useNavigate } from "react-router-dom";
import {
  getAppleMatches,
  getAlbumorArtistId,
  saveTrack
} from "../connector";

export const trackmenuMachine = createMachine(
  {
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
              DEBUG: { 
                actions: assign({
                  debug: context => !context.debug
                }),
              },
              ADD: {
                target: "playlist",
              },
              EDIT: {
                target: "#track_menu.editing",
              },
              CLOSE: {
                target: "closing", 
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
              CHANGE: {
                actions: "applyTrackChange",
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
                      actions: assign({
                        results: (context, event) => event.data
                      }),
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
                  CLOSE: [
                    {
                      target: "#track_menu.editing.idle",
                      cond: (context, event) => !event.suggestion,
                    },
                    {
                      target: "#track_menu.transform",
                      actions: "assignSuggestion",
                    }
                  ],
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
              src: "commitTrack",
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

 
      transform: {
        initial: "artist",
        states: { 
          artist: {
            invoke: {
              src: "getTrackArtist",
              onDone: [
                {
                  target: "album",
                  actions: "assignTrackArtist",
                },
              ],
            },
          },
          album: {
            invoke: {
              src: "getTrackAlbum",
              onDone: [
                {
                  target: "#track_menu.editing.idle",
                  actions: "assignTrackAlbum",
                },
              ],
            },
          },
        },
      },
      
      
    },
    context: { track: {}, open: false },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      assignTrackArtist: assign((context, event) => { 
        return {
          track: {
            ...context.track,
            artistFk: event.data
          }
        }
      }),
      assignTrackAlbum: assign((context, event) => { 
        return  {
          track: {
            ...context.track,
            albumFk: event.data
          }
        }
      }),
      assignProblem: assign((context, event) => {
        return {
          errorMsg: event.data.message,
          stack: event.data.stack,
        };
      }),
      applyTrackChange: assign((context, event) => { 
        const { track } = context;
        return {
          track: {
            ...track,
            [event.key]: event.value
          }
        };
      }),
      assignTrack: assign((context, event) => {
        return {
          track: event.track,
          changed: false,
          open: true,
        };
      }),
      assignLocation: assign((context, event) => {
        return {
          href: event.href,
        };
      }),
      logResponse: assign((context, event) => {
        return event;
      }),
      assignSuggestion: assign((context, event) => {
        const { track } = context;
        return {
          track: {
            ...track,
            ...event.suggestion
          }
        };
      }),
      assignResponse: assign((context, event) => {
        return {
          changed: true
        };
      }),
    },
  }
);

export const useTrackmenu = (onResponse) => {
  const navigate = useNavigate();
  const [state, send] = useMachine(trackmenuMachine, {
    services: {
      addToQueue: async (context) => {},
      setResponse: async (context) => {
        context.changed && onResponse && onResponse(context.response);
      },
      handleNavigation: async (context) => {
        navigate(context.href);
      },
      openPlaylist: async (context) => {},
      iTunesSearch: async (context) => {
        return await getAppleMatches(context.track.Title)
      },
      
      getTrackAlbum: async (context) => {
        const { track } = context;
        return await getAlbumorArtistId(
          "album",
          track.albumName,
          track.albumImage
        );
      },
      
      getTrackArtist: async (context) => {
        const { track } = context;
        return await getAlbumorArtistId(
          "artist",
          track.artistName,
          track.albumImage
        );
      },
      commitTrack: async (context) => {
        return await saveTrack(context.track)
      },
    },
  });

  const diagnosticProps = {
    id: trackmenuMachine.id,
    states: trackmenuMachine.states,
    state,
    send,
  };

  const handleGoto = (href) => {
    send({
      type: "GO",
      href,
    });
  };

  const handleOpen = (track) => {
    send({
      type: "OPEN",
      track,
    });
  };

  return {
    state,
    send,
    busy: ['editing.itunes.loading'].some(state.matches),
    ...state.context,
    handleOpen,
    handleGoto,
    diagnosticProps,
  };
};




 