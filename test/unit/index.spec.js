'use strict';

var assert  = require('power-assert');
var sinon   = require('sinon');
var path    = require('path');
var factory = require('lambda-handler');
var handlerPath = path.resolve('./src/index');
var fixturePath = path.resolve('./test/fixtures/debug');

describe('Lambda entry point:', function() {

  var handler, event, context;
  beforeEach(factory(handlerPath, fixturePath, function(_handler, _event, _context) {
    handler = _handler;
    event   = _event;
    context = _context;
  }));

  var _log;
  beforeEach(function() {
    _log = console.log;
    console.log = function() {};
  });
  afterEach(function() {
    console.log = _log;
  });

  it('should call to success', function() {
    console.log = sinon.spy(console, 'log');
    context.done = sinon.spy(context, 'done');

    handler(event, context);

    assert(console.log.calledWith(JSON.stringify(event)));
    assert(context.done.calledWith(null));
  });

});