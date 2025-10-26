// Import the Knex configuration
const knexConfig = require('./knexfile');
// Initialize Knex with the development configuration
const knex = require('knex')(knexConfig.development);

async function initializeDatabase() {
  try {
    // Check if the 'places' table already exists
    const tableExists = await knex.schema.hasTable('places');
    if (!tableExists) {
      console.log("Creating 'places' table...");
      // If it doesn't exist, create the table
      await knex.schema.createTable('places', (table) => {
        table.increments('id').primary(); // Auto-incrementing ID
        table.string('name').notNullable();
        table.string('category'); // e.g., 'Museum', 'Park', 'Monument'
        table.text('description');
        table.string('photo_url'); // Path to a local image
        table.string('tags'); // Comma-separated tags like "history,art"
        table.string('opening_hours');
        table.string('entry_fee');
        table.string('contact'); // Phone or website
        table.float('latitude').notNullable();
        table.float('longitude').notNullable();
      });
      console.log("'places' table created successfully.");

      // Insert some sample data into the table
      console.log("Inserting sample data...");
      await knex('places').insert([
        {
          name: 'Grand City Museum',
          category: 'Museum',
          description: 'A museum of local history and art.',
          photo_url: 'shared-assets/museum.jpg',
          tags: 'history,art,indoor',
          opening_hours: '10:00 AM - 6:00 PM',
          entry_fee: '$15',
          contact: '555-1234',
          latitude: 40.7128,
          longitude: -74.0060,
        },
        {
          name: 'Central Park',
          category: 'Park',
          description: 'A large urban park with walking trails and a lake.',
          photo_url: 'shared-assets/park.jpg',
          tags: 'nature,outdoor,free',
          opening_hours: '6:00 AM - 1:00 AM',
          entry_fee: 'Free',
          contact: 'www.centralpark.com',
          latitude: 40.785091,
          longitude: -73.968285,
        },
        {
            name: 'Historic Town Hall',
            category: 'Monument',
            description: 'The iconic clock tower and government building from the 19th century.',
            photo_url: 'shared-assets/town-hall.jpg',
            tags: 'history,architecture,landmark',
            opening_hours: '9:00 AM - 5:00 PM (Tours)',
            entry_fee: '$5 (Tour)',
            contact: '555-5678',
            latitude: 40.7145,
            longitude: -74.0080,
        }
      ]);
      console.log("Sample data inserted successfully.");

    } else {
      console.log("'places' table already exists. No action taken.");
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    // Close the database connection
    await knex.destroy();
  }
}

// Run the initialization function
initializeDatabase();