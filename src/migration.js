import fs from 'fs';
import TABLES from './sql/tables';

const MIGRATE = true;

export default async function migration(database) {
  if (!MIGRATE) {
    return;
  }

  console.log('Migrating database.');

  for (let name of Object.keys(TABLES)) {
    const columns = TABLES[name];
    await database.run(`DROP TABLE ${name}`).catch(e => {
      if (/no such table/.exec(e.message)) {
        return;
      }

      console.error(e);
    });

    const sql = `CREATE TABLE ${name} (${columns})`;

    await database.run(sql).catch(e => {
      if (/already exists/.exec(e.message)) {
        return;
      }

      console.error(e);
    });

    await database.run(`delete from ${name}`);
  }

  const inserts = fs.readFileSync(__dirname + '/sql/insert.sql', 'utf8')
    .split("\n");

  for (let insert of inserts) {
    await database.run(insert).catch(e => {
      if (/UNIQUE constraint failed/.exec(e.message)) {
        return;
      }

      if ('SQLITE_MISUSE' == e.code) {
        return;
      }

      console.log(insert);
      console.error(e);
    });
  }

  console.log('Database setup complete!');
}