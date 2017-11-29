const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.locals.projects = [];
app.locals.palettes = [];
app.locals.title = 'Palette Picker';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on port ${app.get('port')}.`);
})

app.get('/api/v1/projects', (request, response) => {
  return response.status(200).json(app.locals.projects);
});

app.get('/api/v1/palettes', (request, response) => {
  const { projectID } = request.params;
  return filterPalettes(projectID);
});

const filterPalettes = (projectID) => {
  return app.locals.palettes.filter( (palette) => {
    palette.projectID === projectID;
  });
}

app.post('/api/v1/projects', (request, response) => {
  const { name } = request.params;
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
    projectID } = request.params;

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
