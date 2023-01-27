import { createMachine, assign } from 'xstate';

export const carouselMachine = createMachine(
  {
    id: 'carousel',
    initial: 'load',
    states: {
      load: {
        invoke: {
          src: 'loadImages',
          onDone: [
            {
              target: 'stop',
              actions: 'assignImages',
            },
          ],
        },
      },
      go: {
        after: {
          1000: {
            target: 'stop',
            actions: 'nextImage',
          },
        },
      },
      stop: {
        after: {
          6000: {
            target: 'go',
            actions: 'assignImage',
          },
        },
      },
    },
  },
  {
    actions: {
      // load initial images
      assignImages: assign((context, event) => {
        const images = event.data;
        if (!images) return;
        return {
          images,
          index: 0,
          first: images[0],
          second: images[1],
        };
      }),
      // assign first and second image
      assignImage: assign((context) => {
        const { images, index } = context;
        if (!images) return;
        const first = images[index % images.length];
        const second = images[(index + 1) % images.length];
        return {
          first,
          second,
          running: true,
          // increment index here
          index: index + 1,
        };
      }),
      // move second image into first position
      nextImage: assign((context) => {
        const { images, index } = context;
        if (!images) return;
        const first = images[index % images.length];
        return {
          first,
          running: false,
        };
      }),
    },
  }
);
