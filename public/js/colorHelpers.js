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

const convertHextoHSL = (hexString) => {
  const tempR = convertToDec(hexString.substr(0,2)) / 255;
  const tempG = convertToDec(hexString.substr(2,2)) / 255;
  const tempB = convertToDec(hexString.substr(4,2)) / 255;
  const min = Math.min(tempR, tempG, tempB);
  const max = Math.max(tempR, tempG, tempB);

  //find lightness
  const lum = Math.round(((max + min) / 2) * 100) / 100;

  //find saturation
  let satur = 0
  if(max === min) {
    return ({hue: 0, saturation: satur, lightness: lum})
  }
  if( lum >= 0.5) {
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

const colorTests = (color, temp1, temp2) => {
  if (6 * color < 1){
    return temp2 + (temp1 - temp2) * 6 * color;
  } else if (2 * color < 1){
    return temp1;
  } else if (3 * color < 2) {
    return temp2 + (temp1 - temp2) * ((2/3) - color) * 6;
  } else {
    return temp2;
  }
}

const convertHSLtoHex = (HSLColorObject) => {
 //HSLColorObject = {hue: value, saturation: value, lightness: value}
 let { hue, saturation, lightness } = HSLColorObject;
 saturation = saturation/100
 lightness = lightness/100
 //no saturation means grey, all RGB values the same
 if(saturation === 0) {
   const value = lightness * 255;
   return ({r: value, g: value, b: value});
 }

 let temp1;
 if (lightness >= 0.5){
   temp1 = (lightness + saturation) - (lightness * saturation);
 } else {
   temp1 = lightness * (1 + saturation);
 }

 const temp2 = (2 * lightness) - temp1
 const percentHue = hue/360;

 //temp values must be between 0 and 1
 let tempR = (percentHue + 0.333) % 1;
 let tempG = percentHue;
 let tempB = (percentHue - 0.333) % 1;
 if (tempR < 0){
   tempR++;
 }
 if (tempB < 0){
   tempB++;
 }

 const finalR = Math.round(colorTests(tempR, temp1, temp2)*255);
 const finalG = Math.round(colorTests(tempG, temp1, temp2)*255);
 const finalB = Math.round(colorTests(tempB, temp1, temp2)*255);
 return (convertToHex(finalR)+convertToHex(finalG)+convertToHex(finalB))
}

const convertToHex = (decValue) => {
  let value = decValue.toString(16);
  if (value === '0' ) {
    value = '00';
  }
  return value;
}

const convertToDec = (hexValue) =>  {
  return parseInt(hexValue, 16);
}
