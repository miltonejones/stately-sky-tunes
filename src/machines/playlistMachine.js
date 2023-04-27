import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { getGroupByType, savePlaylist } from "../connector";
import { arraymove } from "../util/arraymove";

export const createKey = (name) => name.replace(/[\s&-]/g, "").toLowerCase();

export const playlistMachine = createMachine(
  {
    id: "playlist",
    initial: "init",
    states: {
      init: {
        invoke: {
          src: "loadPlaylists",
          onDone: [
            {
              target: "idle",
              actions: "assignPlaylists",
            },
          ],
          onError: [
            {
              target: "error",
              actions: "assignProblem",
            },
          ],
        },
      },
      opened: {
        initial: "idle",
        states: {
          idle: {
            on: {
              EDIT: {
                target: "adding",
                actions: assign({
                  listname: (context, event) => event.listname,
                }),
              },
              CREATE: {
                target: 'creating',
                actions: 'assignPlaylist',
              },
              CLOSE: {
                target: "#playlist.idle",
                actions: assign({
                  open: false,
                }),
              },
            },
          },
          adding: {
            invoke: {
              src: "editList",
              onDone: [
                {
                  target: "refresh",
                  cond: context => context.open
                },
                {
                  target: "#playlist.moving.refresh", 
                },
              ],
              onError: [
                {
                  target: "error",
                  actions: "assignProblem",
                },
              ],
            },
          },
          
          creating: {
            invoke: {
              src: 'createList',
              onDone: [
                {
                  target: 'refresh',
                },
              ],
            },
          },
          refresh: {
            invoke: {
              src: "loadPlaylists",
              onDone: [
                {
                  target: "idle",
                  actions: "assignPlaylists",
                },
              ],
              onError: [
                {
                  target: "error",
                  actions: "assignProblem",
                },
              ],
            },
          },
          error: {
            on: {
              RECOVER: {
                target: "idle",
              },
            },
          },
        },
      },
      idle: {
        on: {
          OPEN: {
            target: "opened",
            actions: assign({
              track: (context, event) => event.track,
              open: true,
            }),
          },
          EDIT: {
            target: "#playlist.opened.adding",
            actions: "assignPlaylist",
          },
          MOVE: {
            target: 'moving',
            actions: assign((context, event) => ({
              list: event.listKey, 
              file: event.FileKey,
              offset: event.offset
            }))
          }
        },
      },
      moving: {
        initial: "execute",
        states: {
          refresh: {
            invoke: {
              src: "listRefreshed",
              onDone: [
                {
                  target: "#playlist.idle",
                  actions: "assignPlaylists",
                },
              ], 
            },

          },
          
          execute: {
            invoke: {
              src: "executeMove",
              onDone: [
                {
                  target: "refresh"
                }
              ],
              onError: [
                {
                  target: "#playlist.error"
                }
              ]
            }
          }
        }
      } ,

      error: {
        on: {
          RECOVER: {
            target: "init",
          },
        },
      },
    },
    on: {
      PROP: {
        actions: assign((_, event) => ({
          [event.key]: event.value
        }))
      }
    },
    context: {
      open: false,
      playlists: [],
      playlist_db: [],
      track: null,
      listname: "",
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {

      assignPlaylist:  assign((context, event) => ({
        listname: event.listname,
        track: event.track,
      })),
      assignProblem: assign((context, event) => {
        return {
          errorMsg: event.data.message,
          stack: event.data.stack,
        };
      }),

      assignPlaylists: assign((context, event) => {
        const { records } = event.data;
        if (records) {
          const playlist_db = records.reduce((out, rec) => {
            out = out.concat(rec.related);
            return out;
          }, []);

          return {
            playlists: event.data,
            playlist_db,
          };
        }
      }),
    },
  }
);

export const usePlaylist = (onRefresh) => {
  const [state, send] = useMachine(playlistMachine, {
    services: {

      listRefreshed: async() => onRefresh && onRefresh(),


      createList: async(context) => {
        const { track, listname } = context;
        const playlist = {
          Title: listname,
          listKey: createKey(listname),
          related: [
            track.FileKey
          ]
        }
        return await savePlaylist(playlist); 
      },
      
      editList: async (context) => {
        const { track, listname, playlists } = context;
        const playlist = playlists.records.find(
          (f) => createKey(f.Title) === listname
        );
        if (playlist) {
          const { related } = playlist;
          const updated = {
            ...playlist,
            related:
              related.indexOf(track.FileKey) > -1
                ? related.filter((f) => f !== track.FileKey)
                : related.concat(track.FileKey),
          };
          return await savePlaylist(updated);
        }
        alert("Could not  find playlist " + listname);
      },
      loadPlaylists: async (context) => {
        return await getGroupByType("playlist", 1, "ID", "DESC");
      },
      executeMove: async (context) => {
        const { list, file, offset, playlists } = context;
        const playlist = playlists.records.find(
          (f) => createKey(f.Title) === list
        );
     
        if (playlist) {
          const { related: old } = playlist;
          const fromIndex = old.indexOf(file);
          const toIndex = fromIndex + offset;
          const related = arraymove (old, fromIndex, toIndex); 
          const updated = {
            ...playlist,
            related  
          };
          return await savePlaylist(updated); 
        }
 
        return  []
      },
    },
  });

  const diagnosticProps = {
    id: playlistMachine.id,
    states: playlistMachine.states,
    state,
    send,
  };

  const handleOpen = (track) => {
    send({
      type: "OPEN",
      track,
    });
  };

  const handleEdit = (listname, track) => {
    send({
      type: "EDIT",
      listname,
      track
    });
  };

  const handleMove = (listKey, FileKey, offset) => { 
    send({
      type: "MOVE",
      listKey,
      FileKey,
      offset,
    });
  }

  return {
    state,
    send,
    handleOpen,
    handleEdit,
    handleMove,
    diagnosticProps,
    createKey,
  };
};
