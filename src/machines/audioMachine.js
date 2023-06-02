import { createMachine, assign } from "xstate";
import { getRandomBoolean } from "../util/getRandomBoolean";
// import { startPlayer } from '../util/startPlayer';
import moment from "moment";
export const CLOUD_FRONT_URL = "https://s3.amazonaws.com/box.import/";
function playerUrl(FileKey) {
  const audioURL = `${CLOUD_FRONT_URL}${FileKey}`
    .replace("#", "%23")
    .replace(/\+/g, "%2B");
  return audioURL;
}

const getLocalSettings = () => {
  return JSON.parse(localStorage.getItem("sky-settings") || "{}");
};

const getLocalSetting = (key) => {
  const settings = getLocalSettings();
  return settings[key];
};

const setLocalSettings = (key, value) => {
  const settings = getLocalSettings();
  localStorage.setItem(
    "sky-settings",
    JSON.stringify({
      ...settings,
      [key]: value,
    })
  );
};

export const audioMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7A+gBwBtkBPMAJwGIAFAJQHkqBtABgF1FQ8tYMAXbAHYcQAD0QBGACwA2AMwA6SQA5JAJgCcs9c2YB2VUt0AaEMUSrxupfOmrJuyc3Xbp42QF93JtJlyES5BQAIgCiQQCSAMIAggAqISzsSCBcPPxYQsliCFLSAKyKKhqSskqa4nomZgiqqg42hqrMeUoVsrrqnt7o2PhEpJQAygASAKoAYuMAMglswql8gsLZ0samiMqqNuodSnm6zXuyll0gPr3+A-IARmBQGAIUEBlg8g8AblgA1q-nfv3kG53B4ID5YADGyHSAkSiXm3EWGWWiFkzC2ZWYrmkzRk4jxkiqiGxCns6ks2lKeXUdVOfz6ATIbwgBFeBCwyAgkAoDBCADk4ckFtDkQgOsx5O1JJo8nlpEoDOpCQhsejxKo8rJZKpUdiVLSev8GUyWfI2RyuQBFUYha0CzgI4VZRBiiUOaWy+VlJXSdTWQxS33NZiSvL63z0q4YZms9mciAUSLDaK8gDisyS9rSSydCBlW1sUvyFiakmUSo14kUpN0UjqsiLYYuAMZZDAlyeLzeAk+P3kdMugNbl1B3YhUMEsLmgod2dA2WcCjVUua1MkGq1Sta8jyOh06mkUuXzEkjcNVyweDAAi5kSmdEG6fhWaRObylhsdn3eWLx7L6xqu7yJitSGM4eirKeEaAheV6QPIEAAFbGmAFB2ikM4vnOEiWNYS6aMGGq2LUSrtJWVLtFisqrMekEDoyMHXhA8FIVGLKoeIGboc+mRYTk2LitS4hKMeeyiXkSrKJWBhqsJPpSuILS0c28gMXBiHyAIyBkGQUIoc815dj2vwGlB9GXoxzEaVpOm8GAI6fJC0KTpxQqzqIEj8fIgnCcoLR+SRtgSnhSiamu+4eF4ZwmXRKnmWpSGadpukUOQZBYIy-i8AAZulAC2fbRcpqlMepiU2XZYKORObBoa5mHuXxOheRYPliXsSqqD68ifs45IOPkEXdOGMXFfIrawGAvAdgZYK9v2RVxUx42TfZY5OTVU6ZoiPENU0aLdfuwm+rJMgSfsXnAcJVK2NdoaRfNRqjbAvBaVN+mvLNxnDQtsFMc9r2rVVGTOU+20itqHTyJYOFlG4ZLSCRCnyIYO51nUcknPdhWPYt8j-WQU2pel8iZTlZD5Q9564-jvCA+OwMbS5GE7dkbS4Z+K52OushKuS0hAaizidRUFhCUpOO-fIRMtpNZDENNH2jnN2NU5L0tjbLxB0+trC1czIriK41h6B02i6HI6iSJYvM7tYh3froYqltI4uqxZ6utrwcsK4Z3xfU2Evu9pxOe3L2vVbrHGg46vHiDs4pOPWFE+qs6q84YCjHCBaIaCFg1Rd9gdwerWVQsgBAUDQISRHQABqIQ0Hr3EijuugfoW35qse4n-k0+5Q3Yujfq0zSaq70G43grbvBgYAAO4+59BWF27cFT2AM-z+HDO65tXFgzmapvoUaiGDoaiVP+eJWDYthagYVurKU49mZL6+bwv6uk3ly8B6vTHv1nnPbeMJGbRzcqzdUlZlCnwOMeJoaxqhqhrPIfQmxNBWFai-WKb9+gPCgNQaIowHxNwPrHWwxtHZgXNloK2iCJBJy8u0Y4d9Vx3SGn-CeuCSD4ITHQOgNAgiDFITHBqQkWheTXNqKkwlUQ9yQXHBOmgCxknUDKKk2DRqXF4bQOgKYq6DGEXvOqLMJB7EkN1Vo4jNDyhaPQnITgLHBjxPxZwVhfSaMnnggQBCHwhAANIiIgWY6kXldT5B2LIOx8jEBuLCUoH0w8dAQ08dw4gvCG70EbsY-Wh8jZASoWbC2dDeb5AEm4keVJmB4lUKkiy2ifHcioHyIJ9Vsjqj2N1fIb42ionsLzYMxtWHqicKnXQdS17eIIXyIIrTTE1D8l0mUeJgx9PsXiWQFilx7F0FqS2pQlATIAVMigVobSPmnM3Q+UCT4GDgRfdZzB5TbmcKJNEijDlYxXlw+pJzYh6JTDMOZBttDimvsgnQjsQoEn-NoSsLhtTHhVPsF2XzOGv1+Twxpgw6CjF5LMnJVzY5KE6QYMorhtD2CiZuZoyMSjm1lI4eS7CC7opwfUtAE14xUCISQwlZCxEUIKabcCtDrZX06m3f0ewpBx1JEckmnKuQ8n5Py0R7TFmdWWb0486z6z83pSw7Uq4pQKrwEq+MZzbRquCTUGQYLqRG0kiStwvMyU2FlE8yJmhahmotRQf5KZAUXK2uq8w9gthoj2MotRQ9Nm8zjlsciKi47qNRZFAQWBOTwGSJTcg4C2kSEVP+AAtAUZwrybEOEcKsT5HCzyAluPcHaJiRSrHLCS1B2I1zNHVBS-OebGSsTAAW+ZO4LEqKLF3UsSgJIlEkbsVEaIFydDRQ2od0ZTSxkgKOlumgvIVtKJYWUtQYXVDkEmioJQCw1mOAOlWgIrxxl3Tmdt-59Dik6seKQTyEk7HENgoc-QX28WkuobqQkp2bLfJoAZUpkbKKHs4N8Wg62svXXjAAFqgLKWUWQgbEc4KGNYzYKUxI7Q2ElnmkjjgcKkDgpBHII-OQKeFOZrk1DzK+KDNn6ssB0B+vq12mXZfFZjEhqlgo5lSLmnGOoSJUPWR1GoyjHAVepYd4mHESLYzJjjmoSLmy6d+mDGzpAHnUwlayuktNuBlMjAwUbjjko0CRGQEp6XSIMDuIS4zhMjVxstXgtmOj8zfOojQ5nW7iDOvzXzEWqmrD8-WkTT0XoEy0y1BQ+xZEhTkE8mJCA1xxZRjJX9qJan+Z+kHNKZAQtaggwkvIHHfTQd5g4NuwENBgRkCUSrKWAtq2DjLL21RQ22pwp+yDzWNStbXOnTZ24iJrkMIYR2CqS5lwIJl9UWwf3fh1PS9O+ggq1ElG4BS1IzXTyAbZzEi5pNsLk1fSwFjSxRJlDiOwMgzVTNs2uSsNYnnLulIbWdEqyRQ09WUXZPr+vodS5PC1IWQpQwtuYhj93ealHAzWPYM2qmrc8J4IAA */
    id: "audio_player",
    initial: "begin",
    context: {
      intros: {},
      options: 47,
      cadence: 0.3,
      language: "en-US",
      nextProps: {},
      image:
        "https://is5-ssl.mzstatic.com/image/thumb/Podcasts116/v4/e4/a3/c6/e4a3c61d-7195-9431-f6a9-cf192f9c803e/mza_4615863570753709983.jpg/100x100bb.jpg",
      title: "This is the selected podcast title",
      scrolling: false,
      eq: true,
      src: `https://pdst.fm/e/chrt.fm/track/479722/arttrk.com/p/CRMDA/claritaspod.com/measure/pscrb.fm/rss/p/stitcher.simplecastaudio.com/9aa1e238-cbed-4305-9808-c9228fc6dd4f/episodes/d2a175f2-db09-480b-992d-d54b71c4c972/audio/128/default.mp3?aid=rss_feed&awCollectionId=9aa1e238-cbed-4305-9808-c9228fc6dd4f&awEpisodeId=d2a175f2-db09-480b-992d-d54b71c4c972&feed=dxZsm5kX`,
    },
    states: {
      begin: {
        entry: "assignStoredProps",
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
              QUEUE: {
                target: "#audio_player.opened",
                actions: "initQueue",
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

      shuffle: {
        invoke: {
          src: "generateList",
          // onDone: [
          //   {
          //     target: "opened"
          //   }
          // ]
        },
      },

      opened: {
        initial: "eq",

        on: {
          CLOSE: {
            target: "idle",
            actions: "clearPlayer",
          },
        },
        states: {
          eq: {
            initial: "ping",
            states: {
              ping: {
                always: [
                  {
                    target: "attach",
                    cond: (context) => !context.analyser,
                  },
                  {
                    target: "#audio_player.opened.dj",
                  },
                ],
              },
              attach: {
                invoke: {
                  src: "startEq",
                  onDone: [
                    {
                      target: "#audio_player.opened.dj",
                      actions: assign((_, event) => ({
                        analyser: event.data,
                      })),
                    },
                  ],
                },
              },
            },
          },

          dj: {
            initial: "idle",
            states: {
              idle: {
                always: [
                  {
                    target: "narrate",
                    cond: "hasTrackInfo",
                  },
                  {
                    target: "#audio_player.opened.reset",
                    actions: "clearIntro",
                  },
                ],
              },
              narrate: {
                invoke: {
                  src: "loadNarration",
                  onDone: [
                    {
                      target: "#audio_player.opened.reset",
                      actions: "assignIntro",
                    },
                  ],
                  onError: [
                    {
                      target: "#audio_player.opened.reset",
                      actions: "clearIntro",
                    },
                  ],
                },
              },
            },
          },

          reset: {
            invoke: {
              src: "audioStarted",
              onDone: [
                {
                  target: "start",
                  actions: assign({
                    retries: 1,
                  }),
                },
              ],
            },
          },
          start: {
            invoke: {
              src: "startAudio",
              onDone: [
                {
                  target: "preview",
                  actions: "assignNext",
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
          preview: {
            // entry: "assignNext",
            invoke: {
              src: "loadNext",
              onDone: [
                {
                  target: "playing",
                  actions: "assignIntros",
                },
              ],
              onError: [
                {
                  target: "playing",
                  actions: "clearIntro",
                },
              ],
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
              QUEUE: [
                {
                  target: "preview",
                  actions: "addToQueue",
                },
              ],
              TOGGLE: {
                actions: assign((context, event) => ({
                  [event.key]: !context[event.key],
                })),
              },
              SOUND: {
                actions: "assignVolume",
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
              QUEUE: {
                actions: "addToQueue",
              },
              TOGGLE: {
                actions: assign((context, event) => ({
                  [event.key]: !context[event.key],
                })),
              },
            },
          },

          // dedicate: {
          //   invoke: {
          //     src: 'loadNext',
          //     onDone: [
          //       {
          //         target: "playing",
          //         actions: "assignIntros",
          //       },
          //     ],
          //   }
          // }
        },
      },
    },

    on: {
      PROP: {
        actions: "applyChanges",
      },

      DEDICATE: {
        actions: "updateQueue",
      },

      SHUFFLE: {
        target: "shuffle",
        actions: assign((_, event) => ({
          trackList: event.trackList,
        })),
      },
    },
  },
  {
    guards: {
      hasTrackInfo: (context) =>
        (!!context.artistName && getRandomBoolean(context.cadence)) ||
        !!context.dedicateName,
      // hasDedication: context => !!context.queued?.dedication
    },

    actions: {
      applyChanges: assign((_, event) => {
        setLocalSettings(event.key, event.value);
        return {
          [event.key]: event.value,
        };
      }),

      assignNext: assign((context, event) => {
        const { upcoming } = context;
        if (!upcoming?.length) {
          return;
        }
        const { Title, artistName } = upcoming.shift();
        return {
          upcoming,
          nextProps: {
            Title,
            artistName,
          },
        };
      }),
      assignIntro: assign((_, event) => ({
        intro: event.data,
      })),
      assignIntros: assign((context, event) => ({
        intros: {
          ...context.intros,
          [context.nextProps.Title]: event.data,
        },
      })),
      // assignExisting: assign((context, event) => ({
      //   intro: context.intros[context.Title]
      // })),

      clearIntro: assign({
        intro: null,
      }),

      initQueue: assign((context, event) => {
        const { track } = event;
        persistTrack(track);
        const { Title, artistName } = track;
        return {
          ...track,
          queued: track,
          dedicateName: track.dedication,
          trackList: [track],
          src: playerUrl(track.FileKey),
          scrolling: track.Title?.length > 35,
          nextProps: {
            Title,
            artistName,
          },
        };
      }),

      addToQueue: assign((context, event) => {
        const index =
          context.trackList.map((t) => t.ID).indexOf(context.ID) + 1;
        const trackList = context.trackList
          .slice(0, index)
          .concat([{ ...event.track, inserted: !0 }])
          .concat(context.trackList.slice(index));

        const { Title, artistName } = event.track;

        return {
          trackList,
          queued: event.track,
          dedicateName: event.track.dedication,
          nextProps: {
            Title,
            artistName,
          },
        };
      }),

      updateQueue: assign((context, event) => {
        const { Title, artistName } = event.track;
        const trackList = context.trackList.map((f) =>
          f.ID === event.track.ID ? event.track : f
        );

        return {
          trackList,
          queued: event.track,
          nextProps: {
            Title,
            artistName,
          },
          // intros: {}
        };
      }),

      clearPlayer: assign((context, event) => {
        context.player.pause();
        return {
          src: null,
          progress: null,
          currentTime: 0,
          duration: 0,
          FileKey: null,
          queued: null,
          current_time_formatted: "0:00",
        };
      }),
      assignVolume: assign((context, event) => {
        context.player.volume = event.value;
        return {
          volume: event.value,
        };
      }),
      pausePlayer: assign((context, event) => {
        context.player.pause();
      }),
      playPlayer: assign((context, event) => {
        // startPlayer(context.player);
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
      // turnEqOn: assign((context, event) => {
      //   context.player.pause();
      //   return {
      //     eq: true,
      //     player: null,
      //   };
      // }),

      assignStoredProps: assign((context) => ({
        options: getLocalSetting("options") || context.options,
        cadence: getLocalSetting("cadence") || context.cadence,
        voice: getLocalSetting("voice") || context.voice,
        language: getLocalSetting("language") || context.language,
      })),

      assignResultsToContext: assign((context, event) => {
        return {
          player: event.data || context.player,
          volume: event.data.volume,
          memory: getPersistedTracks(),
        };
      }),
      assignNextTrackToContext: assign((context) => {
        const index =
          context.trackList.map((f) => f.FileKey).indexOf(context.FileKey) + 1;
        const track = context.trackList[index];
        const upcoming = context.trackList?.slice(index + 1);
        // alert ( track.dedication)
        persistTrack(track);
        return {
          ...track,
          upcoming,
          dedicateName: track.dedication,
          FileKey: track.FileKey,
          src: playerUrl(track.FileKey),
          scrolling: track.Title?.length > 35,
        };
      }),
      assignSourceToContext: assign((_, event) => {
        const { value, options, trackList, type, ...rest } = event;
        const index = trackList.map((f) => f.FileKey).indexOf(event.value) + 1;
        const upcoming = trackList?.slice(index);

        persistTrack(rest);
        return {
          ...event,
          upcoming,
          dedicateName: event.dedication,
          FileKey: event.value,
          trackList: event.trackList,
          src: playerUrl(event.value),
          scrolling: event.Title?.length > 35,
        };
      }),
    },
  }
);

const COOKIE_NAME = "track-memory";
const persistTrack = (track) => {
  const memory = JSON.parse(localStorage.getItem(COOKIE_NAME) || "[]");
  const update = memory.find((f) => f.ID === track.ID)
    ? memory
    : memory.concat(track);
  try {
    localStorage.setItem(COOKIE_NAME, JSON.stringify(update));
  } catch (ex) {
    console.log(ex.message);
    localStorage.removeItem(COOKIE_NAME);
  }
};

const getPersistedTracks = () =>
  JSON.parse(localStorage.getItem(COOKIE_NAME) || "[]");

// // Ensure that the Cast API is loaded
// // This assumes you have included the Google Cast SDK in your HTML file

// // Function to get a list of available Cast devices
// function getAvailableDevices() {
//   const sessionRequest = new chrome.cast.SessionRequest(chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);

//   chrome.cast.requestSession(
//     () => {
//       // Session established, no need to do anything here
//     },
//     (error) => {
//       // No session could be established, so there are no available devices
//       console.error('No devices available:', error);
//     }
//   );

//   chrome.cast.onAvailabilityChanged.addListener(
//     (isAvailable) => {
//       if (isAvailable) {
//         // Get the list of available devices
//         chrome.cast.getDevices(
//           (devices) => {
//             // Devices retrieved successfully
//             console.log('Available devices:', devices);
//           },
//           (error) => {
//             // Error retrieving devices
//             console.error('Error retrieving devices:', error);
//           }
//         );
//       }
//     }
//   );
// }

// // Call the function to retrieve available devices
// getAvailableDevices();
