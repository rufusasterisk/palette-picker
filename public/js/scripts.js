import {
  saveOfflineProjects,
  saveOfflinePalettes,
  getOfflineSinglePalette,
  getOfflineProjectPalettes,
  setPendingMarkdownsToSynced
} from '../indexedDB.js';

import {
  convertHSLtoHex,
  tetraColors,
  parseRGB
} from './colorHelpers.js';

console.log(saveOfflineProjects);

// colorHelpers.js code - causes lint errors in seperate file
// const pickRandomColor = () => {
//   const hue = Math.floor(Math.random()*359);
//   const saturation = Math.floor(Math.random()*100);
//   const lightness = Math.floor(Math.random()*80)+10;
//   return ({ hue: hue, saturation: saturation, lightness: lightness});
// };
//
// const randomColors = () => {
//   let randomColorPalette = {};
//   for (let i=1; i<6; i++) {
//     const currentColor = pickRandomColor();
//     Object.assign(randomColorPalette, {[i]: currentColor});
//   }
//   return randomColorPalette;
// };
//
// const tetraColors = () => {
//   const starterColor = pickRandomColor();
//   const firstTetra = Object.assign({}, pickRandomColor(),
//     { hue: ( starterColor.hue + 180 )%360 });
//   const secondTetra = Object.assign({}, pickRandomColor(),
//     { hue: ( starterColor.hue + 60 )%360 });
//   const thirdTetra = Object.assign({}, pickRandomColor(),
//     { hue: ( starterColor.hue + 240 )%360 });
//   const fifthRando = pickRandomColor();
//
//   let tetraColorPalette = {
//     1: starterColor,
//     2: firstTetra,
//     3: secondTetra,
//     4: thirdTetra,
//     5: fifthRando
//   };
//   return tetraColorPalette;
// };
//
// const convertRGBtoHex = (objectRGB) => {
//   // {red: ###, green: ###, blue: ###}
//   // eslint-disable-next-line max-len
//   return (`${convertToHex(objectRGB.red)}${convertToHex(objectRGB.green)}${convertToHex(objectRGB.blue)}`);
// };
//
// const convertHextoRGB = (hexString) => {
//   const red = convertToDec(hexString.substr(0, 2));
//   const green = convertToDec(hexString.substr(2, 2));
//   const blue = convertToDec(hexString.substr(4, 2));
//   return ({ red, green, blue});
// };
//
// const convertHextoHSL = (hexString) => {
//   const tempR = convertToDec(hexString.substr(0, 2)) / 255;
//   const tempG = convertToDec(hexString.substr(2, 2)) / 255;
//   const tempB = convertToDec(hexString.substr(4, 2)) / 255;
//   const min = Math.min(tempR, tempG, tempB);
//   const max = Math.max(tempR, tempG, tempB);
//
//   //find lightness
//   const lum = Math.round(((max + min) / 2) * 100) / 100;
//
//   //find saturation
//   let satur = 0;
//   if (max === min) {
//     return ({hue: 0, saturation: satur, lightness: lum});
//   }
//   if ( lum >= 0.5) {
//     satur = (max-min)/(2.0-max-min);
//   } else {
//     satur = (max-min)/(max+min);
//   }
//
//   //find hue
//   let hue;
//   if ( tempR === max ){
//     hue = (tempG-tempB)/(max-min);
//   } else if ( tempG === max ){
//     hue = (2.0 + (tempB-tempR)/(max-min));
//   } else {
//     hue = (4.0 + (tempR-tempG)/(max-min));
//   }
//   hue = Math.round(hue*60);
//   if (hue < 0) {
//     hue = hue + 360;
//   }
//   return ({hue: hue, saturation: satur, lightness: lum});
// };
//
// const colorTests = (color, temp1, temp2) => {
//   if (6 * color < 1){
//     return temp2 + (temp1 - temp2) * 6 * color;
//   } else if (2 * color < 1){
//     return temp1;
//   } else if (3 * color < 2) {
//     return temp2 + (temp1 - temp2) * ((2/3) - color) * 6;
//   } else {
//     return temp2;
//   }
// };
//
// const convertHSLtoHex = (HSLColorObject) => {
//   //HSLColorObject = {hue: value, saturation: value, lightness: value}
//   let { hue, saturation, lightness } = HSLColorObject;
//   saturation = saturation/100;
//   lightness = lightness/100;
//   //no saturation means grey, all RGB values the same
//   if (saturation === 0) {
//     const value = lightness * 255;
//     return ({r: value, g: value, b: value});
//   }
//
//   let temp1;
//   if (lightness >= 0.5){
//     temp1 = (lightness + saturation) - (lightness * saturation);
//   } else {
//     temp1 = lightness * (1 + saturation);
//   }
//
//   const temp2 = (2 * lightness) - temp1;
//   const percentHue = hue/360;
//
//   //temp values must be between 0 and 1
//   let tempR = (percentHue + 0.333);
//   let tempG = percentHue;
//   let tempB = (percentHue - 0.333);
//   if (tempR < 0){
//     tempR++;
//   }
//   if (tempR > 1){
//     tempR--;
//   }
//   if (tempB < 0){
//     tempB++;
//   }
//   if (tempB > 1){
//     tempB--;
//   }
//
//   const finalR = Math.round(colorTests(tempR, temp1, temp2)*255);
//   const finalG = Math.round(colorTests(tempG, temp1, temp2)*255);
//   const finalB = Math.round(colorTests(tempB, temp1, temp2)*255);
//   return (convertToHex(finalR)+convertToHex(finalG)+convertToHex(finalB));
// };
//
// const parseRGB = (rgbString) => {
//   rgbString = rgbString.replace(/^.*\(/, '');
//   rgbString = rgbString.replace(')', '');
//   let rgbArray = JSON.parse("[" + rgbString + "]");
//   let hexColor = rgbArray.reduce( (acc, number) => {
//     acc = acc + convertToHex(number);
//     return acc;
//   }, '');
//   return hexColor;
// };
//
// const convertToHex = (decValue) => {
//   let value = decValue.toString(16);
//   if (value.length === 1 ) {
//     value = '0' + value;
//   }
//   return value;
// };
//
// const convertToDec = (hexValue) =>  {
//   return parseInt(hexValue, 16);
// };
//end colorHelpers



let displayColors = {
  1: { hue: 0, saturation: 100, lightness: 50},
  2: { hue: 60, saturation: 100, lightness: 50},
  3: { hue: 120, saturation: 100, lightness: 50},
  4: { hue: 180, saturation: 100, lightness: 50},
  5: { hue: 240, saturation: 100, lightness: 50},
};

const hostPort = 3002;

const setFontColor = (index) => {
  if (displayColors[index].lightness < 41) {
    $(`.color-${index}`).css({'color':'HSL(0,100%,100%)'});
  } else {
    $(`.color-${index}`).css({'color':'HSL(0,100%,0%)'});
  }
};

const updateColorText = (index) => {
  $(`.color-${index} h4`).text(`#${convertHSLtoHex(displayColors[index])}`);
};

const updateColors = () => {
  // console.log(displayColors);
  for (let i=1; i<6; i++) {
    updateColorText(i);
    $(`.color-${i}`).css(
      {'background-color': `HSL(
        ${displayColors[i].hue},
        ${displayColors[i].saturation}%,
        ${displayColors[i].lightness}%)`});
  }
};
updateColors();

const buildFetchPayload = (bodyObject, method) => ({
  body: JSON.stringify(bodyObject),
  headers: {
    'Content-Type': 'application/json'
  },
  method: method.toUpperCase()
});

const loadCurrentProjects = (selectedProject) => {
  fetch('/api/v1/projects')
    .then( response => response.json())
    .then( projectArray => {
      if (projectArray.length) {
        $('.project-dropdown').html(`
        <option value="null">No Project Selected</option>`);
        projectArray.forEach( (project) => {
          $('.project-dropdown').append(`
            <option value="${project.id}">${project.name}</option>
            `);
        });
      }
      if (selectedProject) {
        $('.project-dropdown').val(selectedProject);
      } else {
        $('.project-dropdown').val('null');
      }
      selectProject();
    });
};

const addProject = () => {
  const projectName = $('.add-project-input').val();
  if (classTextIsUnique(projectName, 'option')) {
    saveOfflineProjects({id: Date.now(), name: projectName})
      .then( () => {
        console.log('save successful');
      });
    const projectPayload = buildFetchPayload({ name: projectName }, 'post');
    fetch('/api/v1/projects', projectPayload)
      .then( response => response.json())
      .then( (idObject) => {
        $('.add-project-input').val('');
        loadCurrentProjects(idObject.id);
      })
      //eslint-disable-next-line no-console
      .catch( error => console.log({error}));
  } else {
    alert('Project Names must be unique!');
  }
};

const loadSelectedPalette = () => {
  let target = $( event.target );
  if (target.is('button')) {
    return;
  }
  if (target.is('div')) {
    target = $( event.target.parentElement );
  }
  const currentPalette = target.attr('class').substr(11);
  fetch('/api/v1/palettes/' + currentPalette)
    .then( response => response.json())
    .then( palette => {
      for ( let i = 1; i < 6; i++) {
        const currentColorString = 'color' + i;
        $(`.color-${i}`)
          .css('background-color', `#${palette[0][currentColorString]}`);
        $(`.color-${i} h4`)
          .text(`#${palette[0][currentColorString]}`);

      }
    });
};

const displayPalettes = (paletteArray) => {
  $('.palette-list').html('');
  paletteArray.forEach( (palette) => {
    $('.palette-list').prepend(`
      <dt
        class="palette-id-${palette.id}"
        >${palette.name}<button>Delete</button></dt>
      <dd class="palette-id-${palette.id}">
        <div style="background-color:#${palette.color1}"></div>
        <div style="background-color:#${palette.color2}"></div>
        <div style="background-color:#${palette.color3}"></div>
        <div style="background-color:#${palette.color4}"></div>
        <div style="background-color:#${palette.color5}"></div>
    `);
  });
};

const selectProject = () => {
  const currentProject = $('.project-dropdown').val();
  const targetURL = currentProject !== 'null' ?
    '/api/v1/projects/' + currentProject + '/palettes' :
    '/api/v1/palettes/';
  fetch(targetURL)
    .then( response => response.json())
    .then( paletteArray => {
      displayPalettes(paletteArray);
    })
    .catch( error => {
      // eslint-disable-next-line no-console
      console.log({ error });
    });
};

const addPalette = () => {
  const name = $('.new-palette').val();
  const color1 = parseRGB($('.color-1').css('background-color'));
  const color2 = parseRGB($('.color-2').css('background-color'));
  const color3 = parseRGB($('.color-3').css('background-color'));
  const color4 = parseRGB($('.color-4').css('background-color'));
  const color5 = parseRGB($('.color-5').css('background-color'));
  const projectID = $('.project-dropdown').val();
  if (projectID === 'null') {
    alert('You must select a project!');
    return;
  }
  if (name === '') {
    alert('You must enter a palette name!');
    return;
  }
  const myPayload = {
    name: name,
    color1: color1,
    color2: color2,
    color3: color3,
    color4: color4,
    color5: color5,
  };
  saveOfflinePalettes({
    id: Date.now(),
    name: name,
    color1: color1,
    color2: color2,
    color3: color3,
    color4: color4,
    color5: color5,
    project_key: projectID
  });
  fetch('/api/v1/projects/' + projectID + '/palettes',
    buildFetchPayload(myPayload, 'post')
  )
    .then(response => response.json())
    .then( () => {
      selectProject();
    })
    .catch( error => {
      // eslint-disable-next-line no-console
      console.log({ error });
    });
};

const shuffleColors = () => {
  console.log(Dexie.exists());
  let newColorPalette = tetraColors();
  for (let i = 1; i < 6; i++) {
    if ($(`.color-${i}`).hasClass('locked')) {
      Object.assign(newColorPalette, { [i]: displayColors[i]});
    }
  }
  displayColors = newColorPalette;
  updateColors();
};

const deletePalette = () => {
  let target = $( event.target.parentElement);
  const currentPalette = target.attr('class').substr(11);
  fetch('/api/v1/palettes/' + currentPalette, buildFetchPayload({}, 'delete'))
    .then( () => {
      $(`.palette-id-${currentPalette}`).remove();
    })
    .catch( error => {
      //eslint-disable-next-line no-console
      console.log( { error });
    });
};
loadCurrentProjects();

const toggleColorLock = () => {
  if (!$(event.target).is('h4')){
    $( event.target ).toggleClass('locked');
  } else {
    // $( event.target.parentElement ).toggleClass('locked');
  }
};

const classTextIsUnique = (newName, classSelector) => {
  const upperNewName = newName.toUpperCase();
  let result = true;
  $(classSelector).each(function(){
    result = ($(this).text()).toUpperCase() !== upperNewName && result;
  });
  return result;
};

$('#color-box-container').on('click', 'div', toggleColorLock);

$('#shuffle-btn').on('click', shuffleColors);

$('.add-project-btn').on('click', addProject);

$('.project-dropdown').on('change', selectProject);

$('.submit-palette').on('click', addPalette);

$('.palette-list').on('click', 'dt', loadSelectedPalette);
$('.palette-list').on('click', 'dd', loadSelectedPalette);

$('.palette-list').on('click', 'button', deletePalette);


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {

    // Load markdowns from indexedDB
    getOfflineProjectPalettes()
      .then( () => {
        console.log('offline load successful');
      });
    // loadOfflineMarkdowns()
    //   .then(markdowns => appendMarkdowns(markdowns))
    //   .catch(error => console.log(`Error loading markdowns: ${error}`));

    // Register a new service worker
    navigator.serviceWorker.register('../service-worker.js')
      .then(() => navigator.serviceWorker.ready)
      .then(() => {
        Notification.requestPermission();
        console.log('ServiceWorker registration successful');
      }).catch(error => {
        console.log(`ServiceWorker registration failed: ${error}`);
      });

  });
}
