export const startPlayer = player => {
  try {
    alert(1)
    player.play();
  } catch (ex) {
    console.log(ex.message) ;
    if (window.prompt("Click OK to start the player")) {
      player.play();
    }
  }
}