'use strict';

const controllerFactory = require('../utils/controllerFactory');

/**
 * @vulnerability: reflected-xss
 */
module.exports = function(app, locals) {
  return controllerFactory('xss', app, { locals });
}
