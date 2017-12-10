import Dexie from 'dexie';

let db = new Dexie('palettePicker');

db.version(1).stores({
  projects: 'id, name',
  palettes: 'id, name, color1, color2, color3, color4, color5, project_key'
});

console.log(db);

export const saveOfflineProjects = (project) => {
  return db.projects.put(project);
};

export const saveOfflinePalettes = (palette) => {
  return db.palettes.put(palette);
};

export const getOfflineSinglePalette = (id) => {
  return db.palettes.get(parseInt(id));
};

// export const getOfflineProjects

export const getOfflineProjectPalettes = () => {
  return db.palettes.toArray();
};

export const loadOfflineMarkdowns = () => {
  return db.markdownFiles.toArray();
};

export const setPendingMarkdownsToSynced = () => {
  return db.markdownFiles.where('status').equals('pendingSync').modify({status: 'synced'});
};
