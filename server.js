const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on port ${app.get('port')}.`);
})

app.locals.projects = [];
app.locals.palettes = [];

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
