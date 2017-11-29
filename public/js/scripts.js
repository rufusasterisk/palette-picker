let displayColors = {
  1: { hue: 0, saturation: 50, lightness: 50},
  2: { hue: 60, saturation: 50, lightness: 50},
  3: { hue: 120, saturation: 50, lightness: 50},
  4: { hue: 180, saturation: 50, lightness: 50},
  5: { hue: 240, saturation: 50, lightness: 50},
};
const updateColors = () => {
  console.log(displayColors);
  for (let i=1; i<6; i++) {
    if (displayColors[i].lightness < 25) {
      $(`.color-${i}`).css({'color':'HSL(0,100%,100%)'})
    } else {
      $(`.color-${i}`).css({'color':'HSL(0,100%,0%)'})
    }
    $(`.color-${i}`).css(
      {'background-color': `HSL(
        ${displayColors[i].hue},
        ${displayColors[i].saturation}%,
        ${displayColors[i].lightness}%)`})
  }
}


const shuffleColors = () => {
  for (let i=1; i<6; i++) {
    const currentColor = pickRandomColor();
    Object.assign(displayColors, {[i]: currentColor})
    updateColors();
  }
}

const pickRandomColor = () => {
  const hue = Math.floor(Math.random()*359);
  const saturation = Math.floor(Math.random()*100);
  const lightness = Math.floor(Math.random()*80)+10;
  return ({ hue: hue, saturation: saturation, lightness: lightness})
}

$('#shuffle-btn').on('click', shuffleColors);
