'use strict';

module.exports = {
  watch: {
    debug: {
      files: [
        '<%= config.src %>/*.js',
        '<%= config.test %>/unit/*.spec.js'
      ],
      tasks: ['test']
    }
  }
};