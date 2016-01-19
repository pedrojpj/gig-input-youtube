/* global require, module, */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '<!--\n' +
            ' <%= pkg.description %>\n' +
            ' @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' @link <%= pkg.homepage %>\n' +
            ' @author <%= pkg.author %>\n' +
            ' @license MIT License, http://www.opensource.org/licenses/MIT\n' +
            ' -->\n'
        },
        dirs: {
            dest: '',
            src: 'src'
        },
        concat: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['src/*.html'],
                dest: '<%= pkg.name %>.html'
            }
        },
        vulcanize: {
            default: {
                options: {},
                files: {
                    '<%= pkg.name %>.html': '<%= pkg.name %>.html'
                }
            }
        },
        changelog: {
            options: {
                dest: 'CHANGELOG.md',
                versionFile: 'package.json'
            }
        },
        stage: {
            options: {
                files: ['CHANGELOG.md']
            }
        },
        release: {
            options: {
                commitMessage: '<%= version %>',
                tagName: 'v<%= version %>',
                file: 'package.json',
                push: false,
                tag: false,
                pushTags: false,
                npm: false
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/*.js', 'test/unit/*.js'],
            options: {
                curly: true,
                browser: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                expr: true,
                node: true,
                '-W018': true,
                globals: {
                    exports: true,
                    angular: false,
                    $: false
                }
            }
        },
        // watch: {
        //   files: '<config:jshint.files>',
        //   tasks: 'default'
        // },
        karma: {
            test: {
                options: {
                    reporters: ['dots'],
                    singleRun: true
                }
            },
            server: {
                options: {
                    singleRun: false
                }
            },
            options: {
                configFile: 'test/karma.conf.js'
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: 'src/',
                src: ['*'],
                dest: ''
          },
      },
      uglify: {
          options: {
              mangle: true
          },
          dist: {
              files: [{
                       expand: true,
                       src: 'colorpicker.js',
                       dest: ''
                   }]
          }
      }
    });

    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');


    // Load the plugin that provides the "watch" task.
    //grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-conventional-changelog');
    grunt.loadNpmTasks('grunt-vulcanize');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('stage', 'git add files before running the release task', function () {
        var files = this.options().files;
        grunt.util.spawn({
            cmd: process.platform === 'win32' ? 'git.cmd' : 'git',
            args: ['add'].concat(files)
        }, grunt.task.current.async());
    });

    grunt.renameTask('release', 'originalRelease');

    // Default task.
    grunt.registerTask('default', ['test']);

    // Test tasks.
    grunt.registerTask('test', ['jshint', 'karma:test']);
    grunt.registerTask('test-server', ['karma:server']);

    // Build task.
    grunt.registerTask('build', ['copy', 'concat', 'uglify']);

    // release task
    grunt.registerTask('release', ['build']);


    // Provides the "karma" task.
    grunt.registerMultiTask('karma', 'Starts up a karma server.', function() {
        var done = this.async();
        require('karma').server.start(this.options(), function(code) {
            done(code === 0);
        });
    });

};