'use strict';

var fs = require('fs');
var path = require('path');
var stack = require('./libs/stack');

module.exports = {
  aws: {
    create: {
      options: {
        service: 'CloudFormation',
        action: 'createStack',
        params: {
          stackName: '<%= package.name %><%= timestamp %>',
          templateBody: fs.readFileSync(path.resolve('templates/cfn.json'), 'utf8'),
          capabilities: ['CAPABILITY_IAM']
        }
      }
    },
    describe: {
      options: {
        service: 'CloudFormation',
        action: 'describeStacks',
        params: {
          stackName: '<%= package.name %><%= timestamp %>'
        },
        success: function(data, done, retry) {
          var status = data.Stacks[0].StackStatus;

          if (status === 'CREATE_FAILED') {
            return done(false);
          }
          if (status !== 'CREATE_COMPLETE') {
            process.stdout.write('.');
            return retry();
          }
          stack.save(JSON.stringify(data.Stacks[0]));
          done();
        }
      }
    }
  },
  template: {
    cloudformation: {
      options: {
        data: function() {
          return stack.load();
        }
      },
      files: {
        'config/local.json': [
          'config/local.json.template'
        ]
      }
    }
  },
};