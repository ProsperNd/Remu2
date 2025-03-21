/**
 * Seed script for populating the Firebase database with test data
 * Run with: npm run seed
 */

import { seedDatabase } from '../utils/seedData';

async function main() {
  console.log('Starting database seeding process...');
  await seedDatabase();
  console.log('Database seeding completed successfully!');
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  }); 