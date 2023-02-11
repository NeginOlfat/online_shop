const App = require('./app');
require('dotenv').config();
global.config = require('./config');
new App()