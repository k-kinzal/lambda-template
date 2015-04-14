'use strict';

module.exports = {
  jshint: {
    options: {
      jshintrc: '.jshintrc',
      reporter: require('jshint-stylish')
    },
    all: [
      '<%= config.src %>/*.js'
    ]
  },
  mochaTest: {
    test: {
      src: ['<%= config.test %>/unit/*.spec.js']
    }
  }
};