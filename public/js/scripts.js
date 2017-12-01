
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

const updateColors = () => {
  console.log(displayColors);
  for (let i=1; i<6; i++) {
    setFontColor(i);
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
        });
      }
    });
};

const addProject = () => {
  const projectName = $('.add-project-input').val();
  const projectPayload = buildFetchPayload({ name: projectName }, 'post');
  fetch('/api/v1/projects', projectPayload)
    .then( response => response.json())
    .then( () => {
      // console.log(id);
      loadCurrentProjects();
    });
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
      $('.color-1').css('background-color', `#${palette[0].color1}`);
      $('.color-2').css('background-color', `#${palette[0].color2}`);
      $('.color-3').css('background-color', `#${palette[0].color3}`);
      $('.color-4').css('background-color', `#${palette[0].color4}`);
      $('.color-5').css('background-color', `#${palette[0].color5}`);
    });
};

const displayPalettes = (paletteArray) => {
  $('.palette-list').html('');
  paletteArray.forEach( (palette) => {
    $('.palette-list').prepend(`
      <dt class="palette-id-${palette.id}">
        ${palette.name} <button>X</button></dt>
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
  if (currentProject !== null) {
    fetch('/api/v1/projects/' + currentProject + '/palettes')
      .then( response => response.json())
      .then( paletteArray => {
        displayPalettes(paletteArray);
      })
      .catch( error => {
        alert({ error });
      });
  }
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
  fetch('/api/v1/projects/' + projectID + '/palettes',
    buildFetchPayload(myPayload, 'post')
  )
    .then(response => response.json())
    .then( () => {
      selectProject();
    })
    .catch( error => {
      alert({ error });
    });
};

const shuffleColors = () => {
  displayColors = tetraColors();
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

$('#shuffle-btn').on('click', shuffleColors);

$('.add-project-btn').on('click', addProject);

$('.project-dropdown').on('change', selectProject);

$('.submit-palette').on('click', addPalette);

$('.palette-list').on('click', 'dt', loadSelectedPalette);
$('.palette-list').on('click', 'dd', loadSelectedPalette);

$('.palette-list').on('click', 'button', deletePalette);
