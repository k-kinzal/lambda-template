'use strict';

module.exports = {
  compress: {
    package: {
      options: {
        archive: '<%= config.dist %>/archive.zip',
        mode: 'zip'
      },
      files: [{
        src: require('./libs/nodeModulePaths').concat([
          '<%= config.src %>/*.js',
          '<%= config.conf %>/*.json'
        ])
      }]
    }
  }
};