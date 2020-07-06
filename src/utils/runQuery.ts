import { createTables, seedTables } from './queryFunctions';

(async () => {
  console.log('creating tables');
  await createTables();

  console.log('seeding tables');
  await seedTables();
  console.log('done');
})();
