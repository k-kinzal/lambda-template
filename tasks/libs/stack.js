'use strict';

var uuid = require('uuid');
var exec = require('child_process').execSync;

var packages = require('../../package.json');
var name     = packages.name.replace(/[^a-zA-Z0-9]/g, '');

var npm = {};
npm.set = function(key, value) {
  exec('npm config set ' + key + ' ' + JSON.stringify(value))
};
npm.get = function(key) {
  var value = (exec('npm config get ' + key) + '').replace(/^[\n\r"']*|[\n\r"']*$/g, '');
  if (value !== 'undefined') {
    try {
      value = JSON.parse(value);
    } catch (e) {
    }
  } else {
    value = undefined;
  }
  return value;
};
npm.delete = function(key) {
  exec('npm config delete ' + key);
};

var identifierKey = 'projectIdentifier' + name;
var identifier = npm.get(identifierKey);
if (!identifier) {
  identifier = name + uuid.v4().replace(/[^a-zA-Z0-9]/g, '');
  npm.set(identifierKey, identifier);
}

var stack = {};
stack.save = function(value) {
  npm.set(identifier, value);
};
stack.load = function() {
  var value = npm.get(identifier);
  value && Object.keys(value).forEach(function(key) {
    stack[key.charAt(0).toLowerCase() + key.slice(1)] = value[key];
    if (key === 'Outputs') {
      value[key].forEach(function(output) {
        var key = output.OutputKey;
        stack[key.charAt(0).toLowerCase() + key.slice(1)] = output.OutputValue;
      });
    }
  });
  return stack;
};
stack.clear = function() {
  npm.delete(identifier);
  npm.delete(identifierKey);
};
stack[identifierKey] = identifier;
stack['identifier'] = identifier

stack.load();

module.exports = stack;