const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.locals.projects = [{id: 23451, name: 'my project'}];
app.locals.palettes = [{id: 24235, color1: 'f00', color2: '00f', color3: '0f0', color4: '000', color5: 'fff', projectID: 23451}];
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
  return response.status(200).json(app.locals.projects);
});

app.get('/api/v1/palettes/:projectID', (request, response) => {
  const { projectID } = request.params;
  return response.status(200).json(filterPalettes(projectID));
});

const filterPalettes = (projectID) => {
  return app.locals.palettes.filter( (palette) => {
    return palette.projectID === parseInt(projectID);
  });
}

app.get('/api/v1/palettes', (request, response) => {
  return response.status(200).json(app.locals.palettes)
})

app.post('/api/v1/projects', (request, response) => {
  const { name } = request.body;
  app.locals.projects.push({id: Date.now(), name: name});
  return response.sendStatus(204);
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
