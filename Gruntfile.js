module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: {
      all: {
        dest: 'build/_bower.js',
        dependencies: {
          'backbone': 'jquery'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-bower');

  grunt.registerTask('default', ['bower']);
};