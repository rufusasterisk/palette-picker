// const { Dexie } = require('dexie');

let db = new Dexie('palettePicker');

db.version(1).stores({
  projects: 'id, name',
  palettes: 'id, name, color1, color2, color3, color4, color 5, project_key'
});

const saveOfflineProjects = (project) => {
  return db.projects.add(project);
};

const saveOfflinePalettes = (palette) => {
  return db.palettes.add(palette);
};

const getOfflineSinglePalette = (id) => {
  return db.palettes.get(parseInt(id));
};

const getOfflineProjectPalettes = (projectID) => {
  return db.palettes.where('project_key').equals(projectID).toArray();
};

const loadOfflineMarkdowns = () => {
  return db.markdownFiles.toArray();
};

const setPendingMarkdownsToSynced = () => {
  return db.markdownFiles.where('status').equals('pendingSync').modify({status: 'synced'});
};
