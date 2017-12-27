var mongoose = require('mongoose');
var util = require('util');

// config should be imported before importing any other file
var config = require('./config/config');
var app = require('./config/express');

const debug = require('debug')('express-mongoose-es6-rest-api:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, { useMongoClient: true });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});
mongoose.connection.once('open', () => {
  console.info("MongoDb connection opened successfully.");
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// listen on port config.port
app.listen(config.port, () => {
  console.info(`Server is listening on Port ${config.port} (${config.env})`); // eslint-disable-line no-console
});

module.exports = app;