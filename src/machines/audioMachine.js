import { createMachine, assign } from "xstate";
import moment from "moment";
export const CLOUD_FRONT_URL = "https://s3.amazonaws.com/box.import/";
function playerUrl(FileKey) {
  const audioURL = `${CLOUD_FRONT_URL}${FileKey}`
    .replace("#", "%23")
    .replace(/\+/g, "%2B");
  return audioURL;
}

export const audioMachine = createMachine(
  {
    id: "audio_player",
    initial: "begin",
    context: {
      image:
        "https://is5-ssl.mzstatic.com/image/thumb/Podcasts116/v4/e4/a3/c6/e4a3c61d-7195-9431-f6a9-cf192f9c803e/mza_4615863570753709983.jpg/100x100bb.jpg",
      title: "This is the selected podcast title",
      scrolling: false,
      eq: true,
      src: `https://pdst.fm/e/chrt.fm/track/479722/arttrk.com/p/CRMDA/claritaspod.com/measure/pscrb.fm/rss/p/stitcher.simplecastaudio.com/9aa1e238-cbed-4305-9808-c9228fc6dd4f/episodes/d2a175f2-db09-480b-992d-d54b71c4c972/audio/128/default.mp3?aid=rss_feed&awCollectionId=9aa1e238-cbed-4305-9808-c9228fc6dd4f&awEpisodeId=d2a175f2-db09-480b-992d-d54b71c4c972&feed=dxZsm5kX`,
    },
    states: {
      begin: {
        invoke: {
          src: "loadAudio",
          onDone: [
            {
              target: "idle.loaded",
              actions: "assignResultsToContext",
            },
          ],
        },
      },
      idle: {
        initial: "loaded",
        states: {
          loaded: {
            on: {
              OPEN: {
                target: "#audio_player.opened",
                actions: "assignSourceToContext",
              },
              CHANGE: {
                target: "#audio_player.idle.loaded",
                actions: "assignSourceToContext",
              },
            },
          },
        },
      },

      ended: {
        invoke: {
          src: "audioEnded",
        },
      },

      replay: {
        invoke: {
          src: "clearAudio",
          onDone: [
            {
              target: "opened",
            },
          ],
        },
      },

      opened: {
        initial: "reset",

        on: {
          CLOSE: {
            target: "idle",
            actions: "clearPlayer",
          },
        },
        states: {
          reset: {
            invoke: {
              src: 'audioStarted',
              onDone: [
                { 
                  target: "start",
                  actions: assign({
                    retries: 1,
                  }),
                }
              ]
            }
            // after: {
            //   10: {
            //     target: "start",
            //     actions: assign({
            //       retries: 1,
            //     }),
            //   },
            // },
          },
          start: {
            invoke: {
              src: "startAudio",
              onDone: [
                {
                  target: "playing",
                },
              ],
              onError: [
                {
                  target: "error",
                  actions: assign({
                    retries: (context, event) => context.retries + 1,
                  }),
                },
              ],
            },
          },
          error: {
            initial: "retry",
            states: {
              retry: {
                invoke: {
                  src: "loadAudio",
                  onDone: [
                    {
                      target: "#audio_player.opened.start",
                      actions: "assignResultsToContext",
                      cond: (context) => context.retries < 4,
                    },
                    {
                      target: "#audio_player.opened.error.fatal",
                    },
                  ],
                },
              },
              fatal: {
                on: {
                  RECOVER: {
                    target: "#audio_player.idle",
                  },
                },
              },
            },
          },
          playing: {
            on: {
              PAUSE: {
                target: "paused",
                actions: "pausePlayer",
              },
              COORDS: {
                target: "playing",
                actions: "assignCoordsToContext",
              },
              PROGRESS: {
                target: "playing",
                actions: "assignProgressToContext",
              },
              SEEK: {
                target: "playing",
                actions: "seekPlayer",
              },
              ERROR: {
                target: "error",
                actions: "turnEqOff",
              },
              OPEN: {
                target: "#audio_player.replay",
                actions: ["assignSourceToContext"],
              },
              END: {
                target: "#audio_player.replay",
                actions: "assignNextTrackToContext",
              },
              TOGGLE: {
                actions: assign((context, event) => ({
                  [event.key]: !context[event.key],
                })),
              }, 
            },
          },
          paused: {
            on: {
              PAUSE: {
                target: "playing",
                actions: "playPlayer",
              },
              OPEN: {
                target: "#audio_player.replay",
                actions: ["assignSourceToContext"],
              },
              LIST: {
                actions: assign({
                  listopen: (context) => !context.listopen,
                }),
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      clearPlayer: assign((context, event) => {
        context.player.pause();
        return {
          src: null,
          progress: null,
          currentTime: 0,
          duration: 0,
          current_time_formatted: "0:00",
        };
      }),
      pausePlayer: assign((context, event) => {
        context.player.pause();
      }),
      playPlayer: assign((context, event) => {
        context.player.play();
      }),
      seekPlayer: assign((context, event) => {
        context.player.currentTime = event.value;
      }),
      assignProgressToContext: assign((context, event) => {
        const { currentTime, duration } = event;
        const current_time_formatted = !currentTime
          ? "0:00"
          : moment.utc(currentTime * 1000).format("mm:ss");

        const duration_formatted = !duration
          ? "0:00"
          : moment.utc(duration * 1000).format("mm:ss");
        return {
          currentTime,
          current_time_formatted,
          duration_formatted,
          duration,
          progress: (currentTime / duration) * 100,
        };
      }),
      assignCoordsToContext: assign((context, event) => {
        return {
          coords: event.coords,
        };
      }),
      turnEqOff: assign((context, event) => {
        context.player.pause();
        return {
          eq: false,
          player: null,
          retries: context.retries + 1,
        };
      }),
      turnEqOn: assign((context, event) => {
        context.player.pause();
        return {
          eq: true,
          player: null,
        };
      }),
      assignResultsToContext: assign((context, event) => {
        return {
          player: event.data,
        };
      }),
      assignNextTrackToContext: assign((context, event) => {
        const index =
          context.trackList.map((f) => f.FileKey).indexOf(context.FileKey) + 1;
        const track = context.trackList[index];
        return {
          ...track,
          FileKey: track.FileKey,
          src: playerUrl(track.FileKey),
          scrolling: track.Title?.length > 35,
        };
      }),
      assignSourceToContext: assign((context, event) => {
        return {
          ...event,
          FileKey: event.value,
          trackList: event.trackList,
          src: playerUrl(event.value),
          scrolling: event.Title?.length > 35,
        };
      }),
    },
  }
);
