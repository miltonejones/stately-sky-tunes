/**
 * Creates a striped background image for equations.
 * @return {string} The URL of the generated image.
 */
export const createEqBackground = (width = 300, label = "skytunes equalizer") => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = 48;
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "white";
  ctx.beginPath();
  for (let y = 0; y < canvas.height; y += 4) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // set text style for canvas
  ctx.fillStyle = '#888';
  ctx.font = 'italic 11px sans-serif';
  ctx.textAlign = 'right';
  
  const textWidth = ctx.measureText(label).width;

  // calculate the text offset based on the current time
  const offset = (Date.now() / 50) % (canvas.width + textWidth);

  // const text = offset < textWidth 
  //   ? getSubstringByWidth(label, ctx, offset) 
  //   : label;

  // add text to canvas
  ctx.fillText(label, canvas.width - offset + textWidth, 12);

  // ctx.lineWidth = 2
  // ctx.strokeStyle = "red";
  // ctx.moveTo(canvas.width - offset, 0);
  // ctx.lineTo(canvas.width - offset, canvas.height);
  // ctx.stroke();

  // add text to canvas
  // ctx.fillText('skytunes equalizer', canvas.width - 10, 12);

  
  return canvas.toDataURL("image/png");
}
 
 