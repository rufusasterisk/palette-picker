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


// const tetraColors = () => {
//   const starterColor = pickRandomColor();
//   const firstTetra = Object.assign({}, pickRandomColor(), { hue: ( starterColor.hue + 180 )%360 });
//   const secondTetra = Object.assign({}, pickRandomColor(), { hue: ( starterColor.hue + 60 )%360 });
//   const thirdTetra = Object.assign({}, pickRandomColor(), { hue: ( starterColor.hue + 240 )%360 });
//   const fifthRando = pickRandomColor();
//
//   displayColors = {
//     1: starterColor,
//     2: firstTetra,
//     3: secondTetra,
//     4: thirdTetra,
//     5: fifthRando
//   }
//   updateColors()
// }

// const shuffleColors = () => {
//   for (let i=1; i<6; i++) {
//     const currentColor = pickRandomColor();
//     Object.assign(displayColors, {[i]: currentColor})
//   }
//   updateColors();
// }

// const pickRandomColor = () => {
//   const hue = Math.floor(Math.random()*359);
//   const saturation = Math.floor(Math.random()*100);
//   const lightness = Math.floor(Math.random()*80)+10;
//   return ({ hue: hue, saturation: saturation, lightness: lightness})
// }

const buildPostPayload = (bodyObject) => ({
  body: JSON.stringify(bodyObject),
  headers: {
    'Content-Type': 'application/json'
  },
  method: 'POST'
})

const loadCurrentProjects = () => {
  fetch('/api/v1/projects')
    .then( response => response.json())
    .then( projectArray => {
      if (projectArray.length) {
        $('.project-dropdown').html(`
        <option value="null">No Project Selected</option>`);
        projectArray.forEach( (project) => {
          $('.project-dropdown').prepend(`
            <option value="${project.id}">${project.name}</option>
            `);
          })
      }
    })
}

const addProject = () => {
  const projectName = $('.add-project-input').val();
  const payload = buildPostPayload({ name: projectName })
  fetch('/api/v1/projects', payload)
    .then( response => response.json())
    .then( data => {
      console.log(data);
      loadCurrentProjects();
    })
}

const loadSelectedPalette = () => {
  const currentPalette = $('.palette-dropdown').val();
  if(currentPalette !== 'null') {
    fetch('/api/v1/palettes/' + currentPalette)
    .then( response => response.json())
    .then( palette => {
      $('.color-1').css('background-color', `#${palette[0].color1}`);
      $('.color-2').css('background-color', `#${palette[0].color2}`)
      $('.color-3').css('background-color', `#${palette[0].color3}`)
      $('.color-4').css('background-color', `#${palette[0].color4}`)
      $('.color-5').css('background-color', `#${palette[0].color5}`)
    })
  }
}


const selectProject = () => {
  const currentProject = $('.project-dropdown').val()
  if(currentProject !== null) {
    fetch('/api/v1/projects/' + currentProject + '/palettes')
      .then( response => response.json())
      .then( paletteArray => {
        if (paletteArray.length){
          $('.palette-dropdown').html(`
            <option value="null">No Palette Selected</option>
            `);
          paletteArray.forEach( (palette) => {
            $('.palette-dropdown').append(`
              <option value="${palette.id}">${palette.name}</option>
            `)
          })
        } else {
          $('.palette-dropdown').html(`
            <option value="null">No Palette Selected</option>
          `)
        }
        loadSelectedPalette();
      })
      .catch( error => {
        console.log({ error });
      })
  }
}


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
  }
  fetch('/api/v1/projects/' + projectID + '/palettes',
    buildPostPayload(myPayload)
  )
    .then(response => response.json())
    .then( data => {
      selectProject();
    })
    .catch( error => {
      console.log({ error });
    })
}

const shuffleColors = () => {
  displayColors = tetraColors();
  updateColors();
}

loadCurrentProjects();

$('#shuffle-btn').on('click', shuffleColors);

$('.add-project-btn').on('click', addProject);

$('.project-dropdown').on('change', selectProject);

$('.palette-dropdown').on('change', loadSelectedPalette);

$('.submit-palette').on('click', addPalette);
