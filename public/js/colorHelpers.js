const pickRandomColor = () => {
  const hue = Math.floor(Math.random()*359);
  const saturation = Math.floor(Math.random()*100);
  const lightness = Math.floor(Math.random()*80)+10;
  return ({ hue: hue, saturation: saturation, lightness: lightness})
}

const shuffleColors = () => {
  let randomColorPalette = {}
  for (let i=1; i<6; i++) {
    const currentColor = pickRandomColor();
    Object.assign(randomColorPalette, {[i]: currentColor})
  }
  return randomColorPalette;
}

const tetraColors = () => {
  const starterColor = pickRandomColor();
  const firstTetra = Object.assign({}, pickRandomColor(), { hue: ( starterColor.hue + 180 )%360 });
  const secondTetra = Object.assign({}, pickRandomColor(), { hue: ( starterColor.hue + 60 )%360 });
  const thirdTetra = Object.assign({}, pickRandomColor(), { hue: ( starterColor.hue + 240 )%360 });
  const fifthRando = pickRandomColor();

  let tetraColorPalette = {
    1: starterColor,
    2: firstTetra,
    3: secondTetra,
    4: thirdTetra,
    5: fifthRando
  }
  return tetraColorPalette;
}

const convertRGBtoHSL = (RGBColorObject) => {
  //RGBColorObject = {r: value, g: value, b: value}
  const tempR = RGBColorObject.r / 255;
  const tempG = RGBColorObject.g / 255;
  const tempB = RGBColorObject.b / 255;
  const min = Math.min(tempR, tempG, tempB);
  const max = Math.max(tempR, tempG, tempB);

  //find lightness
  console.log(((max+min)/2)*100);
  const lum = Math.round(((max + min) / 2) * 100) / 100;

  //find saturation
  let satur = 0
  if(max === min) {
    return ({hue: 0, saturation: satur, lightness: lum})
  }
  if( lum > 0.5) {
    satur = (max-min)/(2.0-max-min);
  } else {
    satur = (max-min)/(max+min);
  }

  //find hue
  let hue
  if ( tempR === max ){
    hue = (tempG-tempB)/(max-min);
  } else if ( tempG === max ){
    hue = (2.0 + (tempB-tempR)/(max-min));
  } else {
    hue = (4.0 + (tempR-tempG)/(max-min));
  }
  hue = Math.round(hue*60);
  if (hue < 0) {
    hue = hue + 360;
  }
  return ({hue: hue, saturation: satur, lightness: lum});
}

const convertHSLtoRGB = (HSLColorObject) => {

}
