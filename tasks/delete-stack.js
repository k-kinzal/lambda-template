'use strict';

var stack = require('./libs/stack');

module.exports = {
  aws: {
    delete: {
      options: {
        service: 'CloudFormation',
        action: 'deleteStack',
        params: {
          stackName: stack.stackName
        },
        success: function(data, done) {
          stack.clear();
          done();
        }
      }
    }
  }
};