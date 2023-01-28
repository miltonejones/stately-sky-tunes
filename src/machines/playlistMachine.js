import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { getGroupByType, savePlaylist } from "../connector";

export const createKey = (name) => name.replace(/[\s&-]/g, "").toLowerCase();

export const playlistMachine = createMachine(
  {
    id: "playliat",
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
              CLOSE: {
                target: "#playliat.idle",
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
        },
      },
      error: {
        on: {
          RECOVER: {
            target: "init",
          },
        },
      },
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

  const handleEdit = (listname) => {
    send({
      type: "EDIT",
      listname,
    });
  };

  return {
    state,
    send,
    handleOpen,
    handleEdit,
    diagnosticProps,
    createKey,
  };
};
