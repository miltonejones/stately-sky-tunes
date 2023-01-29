import React from "react";
import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import {
  shuffle
} from "../util/shuffle";
import {
  getGroupByType,
  getArtistInfo,
  searchGroupByType,
  getGroupById, 
  getDashboard,
} from "../connector";
import { useParams, useLocation } from "react-router-dom";

const searchTypes = ['music', 'album', 'artist']

const skytunesMachine = createMachine(
  {
    id: "skytunes",
    initial: "init",
    states: {
      init: {
        initial: 'go',
        states: {
          locate: {
            invoke: {
              src: "getLocation",
              onDone: [
                {
                  target: "#skytunes.find",
                  cond: (context, event) => event.data.indexOf("find") > -1
                },
                {
                  target: "#skytunes.grid"
                }
              ]
            }
          },
          go: {

            invoke: {
              src: "loadRequestParams",
              onDone: [
                {
                  target: "locate",
                  actions: "assignRequestParams",
                }, 
              ],
              onError: [
                {
                  target: "#skytunes.error",
                  actions: "assignProblem",
                },
              ],
            },
          }
        }
      },
      find: {
        initial: "check",
        states: {
          check: {
            after: {
              1: [
                {
                target: "idle", 
                cond: context => !context.search_param,
                actions: assign(({ 
                  hero: null,  
                  response: null
                }))
              },
              {
                target: "lookup", 
                actions: assign(({
                  search_index: 0, 
                  search_type: searchTypes[0]
                }))
              }
            ]
            },
          },
          lookup: {
            initial: 'find',
            states: {
              next: {
                after: {
                  1: [
                    {
                      target: "find",
                      cond: context => context.search_index < searchTypes.length,
                      actions: assign(({ 
                        search_type: context => searchTypes[context.search_index]
                      }))
                    },
                    {
                      target: "#skytunes.find.idle",
                      actions: assign(({
                        selected_search: 0
                      }))
                    },
                  ]
                }
              },
              find: {
                invoke: {
                  src: "searchGroup",
                  onDone: [
                    {
                      target: "next", 
                      actions: assign((context, event) => ({
                       search_index: context.search_index + 1,
                       searches: {
                        ...context.searches,
                        [context.search_type]: event.data
                       }
                      }))
                    },

                  ]
                }
              }
            }
          },
          idle: {
            on: {
              OPEN: "#skytunes.init",
              DEBUG: {
                actions: assign({
                  debug: (context) => !context.debug,
                }),
              },
              CHANGE: {
                actions: assign({
                  search_param: (context, event) => event.value,
                }),
              },
              TAB: {
                actions: assign({
                  selected_search: (context, event) => event.value,
                }),
              },
            }
          }
        }
      },
      splash:{
        initial: 'init',
        states: {
          start: {
            invoke: {
              src: 'playDashTracks',
              onDone: [
                {
                  target: 'init'
                }
              ]
            }
          },
          play: {
            invoke: {
              src: 'loadDashTracks',
              onDone: {
                target: 'start',
                actions: assign({
                  items: (context, event) => event.data
                })
              }
            }
          },
          init: {
            on: {
              CHANGE: {
                actions: assign({
                  search_param: (context, event) => event.value,
                }),
              },
              AUTO: { 
                target: 'play',
                actions: assign((context, event) => ({
                  dashID: event.ID,
                  dashType: event.dashType
                }))
              },
              DEBUG: {
                actions: assign({
                  debug: (context) => !context.debug,
                }),
              },
              OPEN: "#skytunes.init",
            }
          }
        }
      },
      hero: {
        invoke: {
          src: 'loadArtistInfo',
          onDone:  {
            target: '#skytunes.list.loaded',
            actions: assign({
              hero: (context, event) => event.data,
            }),
          },
        }
      },
      list: {
        initial: "loading",
        states: {
          loading: {
            invoke: {
              src: "loadArtistInfo",
              onDone: [
                {
                  target: "playlist",
                  cond: (context) => !context.playlists,
                  actions: assign({
                    hero: (context, event) => event.data,
                    artistFk:  null
                  }),
                },
                {
                  target: "loaded",
                  actions: assign({
                    hero: (context, event) => event.data,
                    artistFk:  null
                  }),
                },
              ],
            },
          },
          playlist: {
            invoke: {
              src: "loadPlaylists",
              onDone: [
                {
                  target: "#skytunes.list.loaded",
                  actions: "assignPlaylistsToContext",
                },
              ],
              onError: [
                {
                  target: "#skytunes.error",
                  actions: "assignProblem",
                },
              ],
            },
          },
          loaded: {
            on: {
              OPEN: "#skytunes.init",
              HERO: {
                target: "#skytunes.hero",

                // don't get a hero image if one with the same ID already exists
                cond: (context, event) => event.artistFk !== context.artistFk && 
                  event.artistFk !== context.hero?.ID,
                actions: assign({
                  artistFk: (context, event) => event.artistFk ,
                  hero: null
                })
              },
              DEBUG: {
                actions: assign({
                  debug: (context) => !context.debug,
                }),
              },
              CHANGE: {
                actions: assign({
                  search_param: (context, event) => event.value,
                }),
              },
            },
          },
        },
      },
      grid: {
        initial: "loading",
        states: {
          loading: {
            invoke: {
              src: "loadRequest",
              onDone: [
                {
                  target: "#skytunes.splash",
                  cond: (context) => !(context.type || context.search_param),
                  actions: "assignDashboard",
                },
                {
                  target: "#skytunes.list",
                  cond: (context) => context.type === "music" || !!context.id  || !!context.search_param,
                  actions: "assignResponse",
                },
                {
                  target: "loaded",
                  actions: "assignResponse",
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
              OPEN: "#skytunes.init",
              DEBUG: {
                actions: assign({
                  debug: (context) => !context.debug,
                }),
              },
              CHANGE: {
                actions: assign((context, event) => ({
                  [event.key || 'search_param']: event.value
                })), 
              },
            },
          },
          error: {
            on: {
              RECOVER: {
                target: "loading",
              },
            },
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
      // type: "music",
      // page: 1,
      // sort: "ID",
      // direction: "DESC",
      logo: "https://www.sky-tunes.com/assets/icon-72x72.png",
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },

  {
    actions: {
      assignDashboard: assign((context, event) => {
        const response = event.data;  
        const carouselImages = !response
          ? null
          : shuffle(response)
              .filter((record) => !!record.imageLg && record.imageLg.indexOf('//') > -1)
              .map(carouselTransform);

        
        const albums = shuffle(response).filter(f => f.Type === 'album')
        .slice(0, 15);
        const artists = shuffle(response).filter(f => f.Type === 'artist')
          .slice(0, 15);

        return { 
          response,
          albums,
          artists,
          hero: null, 
          carouselImages,
        };

      }),

      assignResponse: assign((context, event) => {
        const response = event.data.related || event.data; 
        const { records } = response;
        const pageTitle = !event.data.row?.length
          ? context.search_param
          : event.data.row[0].Name ||
            event.data.row[0].Genre ||
            event.data.row[0].Title ;

        // const imageRecords = (records || response) 

        // alert (JSON.stringify(imageRecords))

        const carouselImages = !records
          ? null
          : shuffle(records)
              .filter((record) => !!record.imageLg && record.imageLg.indexOf('//') > -1)
              .map(carouselTransform);

        return {
          row: event.data.row,
          response,
          hero: null,
          pageTitle,
          carouselImages,
        };
      }),
      assignPlaylistsToContext: assign((context, event) => {
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
      assignRequestParams: assign((context, event) => {
        return {
          ...event.data,
          history: getPersistedArtists()
        };
      }),
      assignProblem: assign((context, event) => {
        return {
          errorMsg: event.data.message,
          stack: event.data.stack,
        };
      }),
    },
  }
);

export const useSkytunes = (onRefresh) => {
  const {
    type,// = "music",
    page,// = 1,
    sort,// = "ID",
    direction,// = "DESC",
    id,
    param,
  } = useParams();
  const location = useLocation();
  const [state, send] = useMachine(skytunesMachine, {
    services: {
      loadArtistInfo: async (context) => {
        const { artistFk } = context.response?.records?.find((f) => !!f.artistFk) ?? {} 
        const artistID = context.artistFk || artistFk;
          // alert(context.artistFk)
        if (artistID) {
          const hero = await getArtistInfo(artistID);
          if (hero.row?.length) {
            const artist = hero.row[0];
            persistArtist(artist)
            return artist;
          }
        }
        return false;
      },
      playDashTracks: async (context) => {
        onRefresh(context.items.related.records);
        // alert (JSON.stringify(context.items.related.records,0,2))
      },
      loadDashTracks: async (context) => {
        return await getGroupById(context.dashType, context.dashID, 1, 'trackNumber', 'ASC');
      },
      loadPlaylists: async (context) => {
        return await getGroupByType("playlist", 1, "ID", "DESC");
      },
      searchGroup: async (context) => {
        const { search_type, search_param } = context;
        return await searchGroupByType(search_type, search_param, 1); 
      },
      loadRequest: async (context) => {
        const { type, page, sort, direction, id, search_param } = context;
        if (!!search_param) {
          return await searchGroupByType("music", search_param, page); 
        }
        if (!type) {
          return await getDashboard()
        }
        if (!!id) {
          return await getGroupById(type, encodeURIComponent(id), page, sort, direction);
        }
        return await getGroupByType(type, page, sort, direction);
      },
      getLocation: async() => {
        return location.pathname;
      },
      loadRequestParams: async (context) => { 
        const innerProps = !!id ? requestProps[type] : listProps[type];
        const sortProps = !!sort ? { sort, direction } : innerProps; 
        return {
          type,
          page,
          id,
          search_param: param,
          carouselImages: null,
          ...sortProps,
          // sort,
          // direction,
        };
      },
    },
  });
  const diagnosticProps = {
    id: skytunesMachine.id,
    state,
    send,
    states: skytunesMachine.states,
  };

  React.useEffect(() => {
    send({
      type: "OPEN",
    });
  }, [location, send]);

  const handleAuto = (ID, dashType) => {   
    send({
      type: "AUTO",
      ID,
      dashType
    })
  }

  return {
    handleAuto,
    state,
    send,
    busy: ['grid.loading','list.loading'].some(state.matches),
    diagnosticProps,
  };
};

const COOKIE_NAME = 'artist-memory';
const persistArtist = artist => {
  const memory = JSON.parse(localStorage.getItem(COOKIE_NAME) || "[]");
  const update = memory.find(f => f.ID === artist.ID)
    ? memory 
    : memory.concat(artist);
  localStorage.setItem(COOKIE_NAME, JSON.stringify(update));
}

const getPersistedArtists = () => JSON.parse(localStorage.getItem(COOKIE_NAME) || "[]")

const carouselTransform = img => ({
      src: img.imageLg,
      title: img.Name,
      caption: img.Caption || `${img.TrackCount} tracks in your library`,
    });


const listProps = {
  playlist: {
    sort: "Title",
    direction: "DESC",
  },
  artist: {
    sort: "Name",
    direction: "ASC",
  },
  album: {
    sort: "Name",
    direction: "ASC",
  },
  genre: {
    sort: "Genre",
    direction: "ASC",
  },
}

const requestProps = {
  album: {
    sort: "discNumber,trackNumber",
    direction: "ASC",
  },
  playlist: {
    sort: "trackNumber",
    direction: "DESC",
  },
  artist: {
    sort: "albumFk,discNumber,trackNumber",
    direction: "ASC",
  },
  // playlist: {
  //   sort: "Title",
  //   direction: "DESC",
  // },
  // genre: {
  //   sort: "Genre",
  //   direction: "DESC",
  // },
};
