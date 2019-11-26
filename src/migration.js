import fs from 'fs';

export default function migration(database) {
  const tables = fs.readFileSync(__dirname + '/sql/create_tables.sql', 'utf8');

  database.run(tables).then(() => {
    console.log("Tables created!");
  }).catch(e => {
    if (/table .+? already exists/.exec(e.message)) {
      return;
    }

    throw e;
  });
}