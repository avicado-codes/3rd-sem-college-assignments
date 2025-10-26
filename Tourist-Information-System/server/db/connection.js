// Import the Knex configuration from knexfile.js
const knexConfig = require('../knexfile');

// Initialize Knex with the 'development' environment configuration
const knex = require('knex')(knexConfig.development);

// Export the initialized Knex instance to be used in other parts of our application
module.exports = knex;