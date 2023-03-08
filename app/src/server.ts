import App from './App';

/**
 * Load App configurations
 */
App.loadConfiguration();

/**
 * Run the Database pool
 */
App.loadDatabase();

/**
 * Init App server
 */
App.loadServer()

console.log("Hello world!")

