'use strict';

var fs    = require('fs');
var path  = require('path');
var stack = require('./libs/stack');

// set config
module.exports = {
  lambda_runner: {
    options: {
      functionName: '<%= package.name %><%= timestamp %>',
      handler: '<%= config.src %>/index.js',
      event: '<%= config.test %>/fixtures/debug.json'
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
    debug: {
      files: [{
        src: require('./libs/nodeModulePaths').concat([
          '<%= config.src %>/*.js',
          '<%= config.conf %>/default.json',
          '<%= config.conf %>/local.json'
        ])
      }]
    }
  },
  lambda_log: {
    options: {
      functionName: '<%= package.name %><%= timestamp %>',
      startTime: '<%= timestamp %>',
      endText: /^REPORT RequestId/
    },
    debug: {}
  },
  aws: {
    invoke: {
      options: {
        service: 'Lambda',
        action: 'invokeAsync',
        params: {
          functionName: '<%= package.name %><%= timestamp %>',
          InvokeArgs: fs.readFileSync(path.resolve('test/fixtures/debug.json'), 'utf8')
        }
      }
    },
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
  wait: {
    options: {
      delay: 3000
    },
    pause: {}
  }
};