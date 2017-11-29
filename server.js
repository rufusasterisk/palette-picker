const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// app.locals.projects = [{id: 23451, name: 'my project'}];
// app.locals.palettes = [{id: 24235, color1: 'f00', color2: '00f', color3: '0f0', color4: '000', color5: 'fff', projectID: 23451}];
app.locals.title = 'Palette Picker';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3002);

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on port ${app.get('port')}.`);
})

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then( projects => {
      return response.status(200).json(projects);
    })
    .catch( error => {
      return response.status(500).json({ error });
    })
});

app.get('/api/v1/projects/:projectID/palettes', (request, response) => {
  database('palettes').where('project_key', request.params.projectID).select()
    .then( palettes => {
      if (palettes.length) {
        return response.status(200).json(palettes);
      } else {
        return response.status(404).json({
          error: `Did not find that project or found no palettes`
        });
      }
    })
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then( palettes => {
      return response.status(200).json(palettes);
    })
    .catch( error => {
      return response.status(500).json({ error });
    })
})

const checkPostBody = (reqParamArray, bodyObject) => {
  for (let requiredParameter of reqParamArray) {
  if (!bodyObject[requiredParameter]){
    return requiredParameter
    }
  }
}

app.post('/api/v1/projects', (request, response) => {
  const checkBodyResult = checkPostBody(['name'], request.body);
  if (checkBodyResult !== undefined) {
    return response.status(422).json({
      error: `You are missing the ${checkBodyResult} parameter!`
    });
  } else {
    database('projects').insert(request.body, 'id')
      .then( project => {
        return response.status(201).json({
          id: project[0]
        });
      })
      .catch( error => {
        return response.status(500).json({ error })
      })
  }
});

app.post('/api/v1/palettes', (request, response) => {
  const {
    name,
    color1,
    color2,
    color3,
    color4,
    color5,
    projectID } = request.body;

  app.locals.palettes.push({
    id: Date.now(),
    name: name,
    color1: color1,
    color2: color2,
    color3: color3,
    color4: color4,
    color5: color5,
    projectID: projectID
  });
  return response.sendStatus(204);
});

app.delete('/api/v1/palettes/:paletteID', (request, response) => {
  const { paletteID } = request.params;

  app.locals.palettes = app.locals.palettes.filter( (palette) => {
    return palette.id !== parseInt(paletteID);
  })
  return response.sendStatus(204);
})
