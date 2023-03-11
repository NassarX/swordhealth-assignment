import App from './App';

/**
 * Load App configurations
 */
App.loadConfiguration();

/**
 * Run the Database pool
 */
App.loadDatabase();


App.loadAmqp();

/**
 * Init App server
 */
App.loadServer()

console.log("Hello world from node server!")

