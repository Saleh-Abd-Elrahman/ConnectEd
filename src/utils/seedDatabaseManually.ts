import { seedAll } from './seedDatabase';

/**
 * Utility function to manually seed the database when needed
 * This can be called from a development tool or admin panel
 */
export const seedDatabaseManually = async (): Promise<void> => {
  try {
    console.log('Starting manual database seeding...');
    await seedAll();
    console.log('Manual database seeding completed successfully!');
    return Promise.resolve();
  } catch (error) {
    console.error('Error during manual database seeding:', error);
    return Promise.reject(error);
  }
};

export default seedDatabaseManually; 