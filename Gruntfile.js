'use strict';

module.exports = function (grunt) {
  // config
  var config = grunt.initConfig({
    package: require('./package.json'),
    timestamp: (new Date()).getTime(),
    config: {
      src: 'src',
      dist: 'dist',
      test: 'test',
      conf: 'config',
      fixture: 'test/fixtures',
      template: 'templates',
      tmp: '.tmp'
    }
  });
  // tasks
  grunt.registerTask('create-stack', function() {
    var stack = require('./tasks/libs/stack');
    if (!!stack.stackId) {
      grunt.log.error('You have already created a stack.');

      return;
    }

    config = grunt.initConfig(grunt.util._.extend(config, require('./tasks/create-stack')));
    grunt.loadNpmTasks('grunt-thin-aws');
    grunt.loadNpmTasks('grunt-template');
    grunt.task.run([
      'aws:create',
      'aws:describe',
      'template'
    ]);

  });
  grunt.registerTask('delete-stack', function() {
    var stack = require('./tasks/libs/stack');
    if (!stack.stackId) {
      grunt.log.error('You have not created a stack.');

      return;
    }

    config = grunt.initConfig(grunt.util._.extend(config, require('./tasks/delete-stack')));
    grunt.loadNpmTasks('grunt-thin-aws');
    grunt.task.run([
      'aws:delete',
    ]);

  });
  grunt.registerTask('run', function() {
    config = grunt.initConfig(grunt.util._.extend(config, require('./tasks/run')));

    if (this.flags.local) {
      grunt.loadNpmTasks('grunt-lambda-runner'); 
      grunt.task.run([
        'lambda_runner'
      ]);

      return;
    }

    grunt.loadNpmTasks('grunt-lambda-upload');
    grunt.loadNpmTasks('grunt-lambda-log');
    grunt.loadNpmTasks('grunt-thin-aws');
    grunt.loadNpmTasks('grunt-wait');
    grunt.option('force', true); // not stop even if the test fails
    grunt.task.run([
      'lambda_upload',
      'aws:invoke',
      'wait',
      'lambda_log',
      'aws:delete'
    ]);
  });
  grunt.registerTask('debug', function() {
    config = grunt.initConfig(grunt.util._.extend(config, require('./tasks/debug')));
    grunt.loadNpmTasks('grunt-regarde');
    grunt.renameTask('regarde', 'watch');
    grunt.option('force', true); // not stop even if the test fails
    grunt.task.run([
      'watch'
    ]);
  });
  grunt.registerTask('test', function() {
    config = grunt.initConfig(grunt.util._.extend(config, require('./tasks/test')));
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test'); 
    grunt.task.run([
      'jshint',
      'mochaTest'
    ]);
  });
  grunt.registerTask('e2e', function() {
    config = grunt.initConfig(grunt.util._.extend(config, require('./tasks/e2e')));

    var stack = require('./tasks/libs/stack');
    if (!stack.stackId) {
      grunt.log.error('You have not created a stack.');

      return;
    }

    grunt.loadNpmTasks('grunt-env'); 
    grunt.loadNpmTasks('grunt-mocha-test'); 
    grunt.loadNpmTasks('grunt-lambda-upload');
    grunt.loadNpmTasks('grunt-thin-aws');
    grunt.option('force', true); // not stop even if the test fails
    grunt.task.run([
      'env',
      'lambda_upload',
      'mochaTest',
      'aws:delete'
    ]);
  });
  grunt.registerTask('package', function() {
    config = grunt.initConfig(grunt.util._.extend(config, require('./tasks/package')));
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.task.run([
      'compress'
    ]);
  });
};




