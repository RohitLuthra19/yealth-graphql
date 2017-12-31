var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var cors = require('cors');
var httpStatus = require('http-status');
var expressWinston = require('express-winston');
var expressValidation = require('express-validation');
var helmet = require('helmet');
var path = require('path');
var appRoot = require('app-root-path');
var favicon = require('serve-favicon');
var winstonInstance = require('./winston');
var config = require('./config');
var APIError = require('../helpers/APIError');
var routes = require('../routes/index.route');
var adminroutes = require('../admin/routes/index.route');
const { makeExecutableSchema } = require('graphql-tools');

//  GraphQL server handles all requests and responses
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express');

const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable detailed API logging in dev env
if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
}

var typeDefs = require('../graphql/schema');
var resolvers = require('../graphql/resolvers');
var Order = require('../models/order.model');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

//Other Express routes
app.use('/', (req, res)=>{
  res.json({success: true, error: false, message: "Welcome in Yealth"});
});
app.use('/api', routes);
app.use('/api/admin', adminroutes);

// GraphqQL server routes
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.use("/graphql", bodyParser.json(), graphqlExpress((req) => {
  return {
    schema: schema,
    context: { },
  };
}));

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }));
}

// error handler, send stacktrace only during development
app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  })
);

module.exports = app;
