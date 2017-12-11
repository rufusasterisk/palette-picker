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
    'Content-Type': 'application/json',
    'x-forwarded-proto': 'https'
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
  // console.log(Dexie.exists());
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
