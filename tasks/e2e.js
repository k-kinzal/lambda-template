'use strict';

var stack = require('./libs/stack');

module.exports = {
  env: {
    e2e: {
      functionName: '<%= package.name %><%= timestamp %>'
    }
  },
  lambda_upload: {
    options: {
      description: '<%= package.description %>',
      functionName: '<%= package.name %><%= timestamp %>',
      handler: '<%= config.src %>/index.handler',
      memorySize: 128,
      role: stack.executeRoleArn,
      runtime: 'nodejs',
      timeout: 60,
    },
    e2e: {
      files: [{
        src: require('./libs/nodeModulePaths').concat([
          '<%= config.src %>/*.js',
          '<%= config.conf %>/default.json',
          '<%= config.conf %>/local.json'
        ])
      }]
    }
  },
  aws: {
    delete: {
      options: {
        service: 'Lambda',
        action: 'deleteFunction',
        params: {
          functionName: '<%= package.name %><%= timestamp %>'
        }
      }
    }
  },
  mochaTest: {
    options: {
      timeout: 100000,
    },
    test: {
      src: ['<%= config.test %>/e2e/*.spec.js']
    }
  }
};