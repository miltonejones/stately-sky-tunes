import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react'; 

export const imageMachine = createMachine({
  id: "image_machine",
  initial: "loading",
  states: { 
    loading: {
      invoke: {
        src: "loadPhoto",
        onDone: [
          {
            target: "loaded"
          }
        ],
        onError: [
          {
            target: "retry"
          }
        ]
      }
    },
    retry: {
      after: {
        100: [
          {
            target: "loading",
            actions: assign({
              retries: context => context.retries + 1
            }), 
            cond: context => context.retries < 3
          },
          {
            target: "backup"
          }
        ]
      }
    }, 
    backup: {},
    loaded: {
      on: {
        ERROR: 'backup'
      }
    },
  } ,
  context: { retries: 0 }, 
})


export const usePhoto = (src, backup) => {
  const [state, send] = useMachine(imageMachine, {
    services: {
      loadPhoto: () => new Promise(resolve => {
        const im = new Image();
        im.onload = () => { 
          resolve(src)
        };
        im.onerror = () => {
          throw new Error('could not load image');
        }
        if (!src) {
          throw new Error('no source')
        }
        im.src = src; 
      }), 
    },
  });

  return {
    image: state.matches('loaded') ? src : backup,
    tries: state.context.retries,
    handleError: () => send('ERROR')
  }
}
 