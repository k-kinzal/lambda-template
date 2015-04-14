'use strict';

var packages = require('../../package.json')
var nodeModules = Object.keys(packages.dependencies);
module.exports = nodeModules.map(function(name) {
  return './node_modules/' + name + '/**'
});