/**
 * Requests a WakeLock for the screen.
 *
 * @async
 * @function
 * @returns {Promise<void>}
 */
export const requestWakeLock = async () => {
  try {
    // Request a WakeLock for the screen
    const screenWakeLock = await navigator.wakeLock.request('screen');
    
    // Log WakeLock acquired
    console.log('Wake lock acquired');
    
    // Listen for release event and log when released
    screenWakeLock.addEventListener('release', () => {
      console.log('Wake lock released');
    });

    return true;
  } catch (err) {
    // Log any errors that occur during WakeLock request
    console.error(`${err.name}, ${err.message}`);
  }
};

