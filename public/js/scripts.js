let displayColors = {
  1: { hue: 0, saturation: 100, lightness: 50},
  2: { hue: 60, saturation: 100, lightness: 50},
  3: { hue: 120, saturation: 100, lightness: 50},
  4: { hue: 180, saturation: 100, lightness: 50},
  5: { hue: 240, saturation: 100, lightness: 50},
};

const setFontColor = (index) => {
  if (displayColors[index].lightness < 41) {
    $(`.color-${index}`).css({'color':'HSL(0,100%,100%)'})
  } else {
    $(`.color-${index}`).css({'color':'HSL(0,100%,0%)'})
  }
}

const updateColors = () => {
  console.log(displayColors);
  for (let i=1; i<6; i++) {
    setFontColor(i)
    $(`.color-${i}`).css(
      {'background-color': `HSL(
        ${displayColors[i].hue},
        ${displayColors[i].saturation}%,
        ${displayColors[i].lightness}%)`})
  }
}
updateColors();


const tetraColors = () => {
  const starterColor = pickRandomColor();
  const firstTetra = Object.assign({}, pickRandomColor(), { hue: ( starterColor.hue + 180 )%360 });
  const secondTetra = Object.assign({}, pickRandomColor(), { hue: ( starterColor.hue + 60 )%360 });
  const thirdTetra = Object.assign({}, pickRandomColor(), { hue: ( starterColor.hue + 240 )%360 });
  const fifthRando = pickRandomColor();

  displayColors = {
    1: starterColor,
    2: firstTetra,
    3: secondTetra,
    4: thirdTetra,
    5: fifthRando
  }
  updateColors()
}

const shuffleColors = () => {
  for (let i=1; i<6; i++) {
    const currentColor = pickRandomColor();
    Object.assign(displayColors, {[i]: currentColor})
  }
  updateColors();
}

const pickRandomColor = () => {
  const hue = Math.floor(Math.random()*359);
  const saturation = Math.floor(Math.random()*100);
  const lightness = Math.floor(Math.random()*80)+10;
  return ({ hue: hue, saturation: saturation, lightness: lightness})
}

$('#shuffle-btn').on('click', tetraColors);
