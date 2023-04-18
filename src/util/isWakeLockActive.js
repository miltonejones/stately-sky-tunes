/**
 * Checks if a wake lock is currently active on the device
 *
 * @returns {boolean} true if wake lock is active, false otherwise
 */
export const isWakeLockActive = () => {
  const wakeLockApi = navigator.wakeLock; 
  if (wakeLockApi && wakeLockApi.release) {
    return !wakeLockApi.released;
  }
  return false;
};

