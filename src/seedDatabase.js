import { seedAll } from './utils/seedDatabase';

// Run this in a separate script to seed the database
async function runSeed() {
  try {
    console.log('Starting database seeding...');
    await seedAll();
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

runSeed(); 