import React from 'react';
import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react'; 
import { getGroupByType, getArtistInfo, searchGroupByType, getGroupById } from '../connector';
import { useParams, useLocation } from "react-router-dom";

const skytunesMachine = createMachine({
  id: "skytunes",
  initial: "init",
  states: {
    init: {
      invoke: {
        src: "loadRequestParams",
        onDone: [
          {
            target: "grid",
            actions: "assignRequestParams",
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
    list: {
      initial: 'loading',
      states: {
        loading: {
          invoke: {
            src: 'loadArtistInfo',
            onDone: [
              {
                target:  'playlist',
                cond: context => !context.playlists,
                actions: assign({
                  hero:  (context, event) => event.data
                })
              },
              {
                target: "loaded",
                actions: assign({
                  hero:  (context, event) => event.data
                })
              }
            ]
          }
        },
        playlist: {
          invoke: {
            src: 'loadPlaylists',
            onDone: [
              {
                target: '#skytunes.list.loaded',
                actions: 'assignPlaylistsToContext'
              }
            ],
            onError: [
              {
                target: "#skytunes.error",
                actions: "assignProblem",
              }
            ]
          }
        },  
        loaded: {
          on: {
            OPEN: '#skytunes.init', 
            DEBUG: {
              actions: assign({
                debug: (context) => !context.debug
              })
            }, 
            CHANGE: {
              actions: assign({
                search_param: (context, event) => event.value
              })
            }
          }
        }
      }
    },

    grid: {
      initial: "loading",
      states: {
        loading: {
          invoke: {
            src: "loadRequest",
            onDone: [
              {
                target: "#skytunes.list",
                cond: context => context.type === 'music' || !!context.id,
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
            OPEN: '#skytunes.init', 
            DEBUG: {
              actions: assign({
                debug: (context) => !context.debug
              })
            },
            CHANGE: {
              actions: assign({
                search_param: (context, event) => event.value
              })
            }
          }
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
  context: { type: "music", page: 1, sort: "ID", direction: "DESC" , 
    logo: "https://www.sky-tunes.com/assets/icon-72x72.png"},
  predictableActionArguments: true,
  preserveActionOrder: true,
},

{
  actions: {
    assignResponse: assign((context,event) => {
      const response = event.data.related || event.data;
      const { records } = response;
      const pageTitle = !event.data.row?.length
        ? null 
        : event.data.row[0].Name || event.data.row[0].Genre || event.data.row[0].Title 
      
      const carouselImages = !records 
        ? null  
        : records.filter(record => !!record.imageLg)
          .map(img => ({
            src: img.imageLg,
            title: img.Name,
            caption: `${img.TrackCount} tracks in your library`
          }))
     
      return {
        row: event.data.row,
        response,
        hero: null,
        pageTitle,
        carouselImages
      }
    }),
    assignPlaylistsToContext: assign((context,event) => {
      const { records } = event.data;
      if (records) {
        const playlist_db = records.reduce ((out, rec) => {
          out = out.concat(rec.related);
          return out;
        }, []);
  
        return {
          playlists: event.data,
          playlist_db
        }
      }
    }),
    assignRequestParams: assign((context,event) => {
      return {
        ...event.data
      }
    }),
    assignProblem: assign((context, event) => {
      return {
        errorMsg: event.data.message,
        stack: event.data.stack
      }
    }),
  }
}
);

export const useSkytunes = (onRefresh) => {
  const { 
    type = 'music', 
    page = 1, 
    sort = 'ID', 
    direction = 'DESC' ,
    id,
    param
  } = useParams()
  const location = useLocation()
  const [state, send] = useMachine(skytunesMachine, {
    services: {
      loadArtistInfo: async(context) => {
        const { artistFk } =  context.response?.records?.find(f => !!f.artistFk) ?? {};
        if (artistFk) {
          const hero = await getArtistInfo(artistFk);
          if (hero.row?.length) {
            return hero.row[0]
          }
        } 
        return false;
      },
      
      loadPlaylists: async (context) => {
       
        return await getGroupByType('playlist', 1, 'ID', 'DESC');
      },
      loadRequest: async (context) => {
        const { type, page, sort, direction, id,  search_param }  = context;
        if (!!search_param) {
          const data =await searchGroupByType ('music', search_param, page) ;
          return data;
        }
        if (!!id) {
          return await getGroupById(type, id, page, sort, direction) 
        }
        return await getGroupByType(type, page, sort, direction)
      },
      loadRequestParams: async(context) => {
        return {
          type ,
          page,
          sort,
          direction,
          id,
          search_param: param,
          carouselImages:  null
        }
      },  
    },
  });
  const diagnosticProps = {
    id: skytunesMachine.id,
    state,
    send,
    states: skytunesMachine.states
  }

  
  React.useEffect(() => {
    send({
      type: 'OPEN'
    })
  }, [location])

  return {
    state,
    send,
    diagnosticProps
  }

}





