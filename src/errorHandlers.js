/*eslint no-console: "off"*/

function sequelizeValidationError (err, req, res, next) {
  if (err.name && err.name == 'SequelizeValidationError')
    res.status(400).send(err.errors)
  else next(err)
}

function logErrors (err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function defaultErrorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.sendStatus(500);
}

module.exports = {
  sequelizeValidationError,
  logErrors,
  defaultErrorHandler
}
