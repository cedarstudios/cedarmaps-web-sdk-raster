	module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jsBanner: "/* Copyright 2018, Cedar Studios <www.cedar.ir> | v<%= pkg.version %> */",

        // Paths
        distFolder: 'dist/v<%= pkg.version %>',
        leafletFolder: 'node_modules/leaflet/dist',
        mapboxFolder: 'node_modules/mapbox.js',
        mapboxSourceFolder: 'node_modules/mapbox.js/src',
        mapboxThemeFolder: 'node_modules/mapbox.js/theme',
        cedarmapsSourceFolder: 'src',
        cedarmapsThemeFolder: 'theme',

        // Commands
        concat: {
            css: {
                src: [
                    '<%= mapboxThemeFolder %>/style.css',
                    '<%= cedarmapsThemeFolder %>/style.css'
                ],
                dest: '<%= distFolder %>/cedarmaps.uncompressed.css'
            }
        },

        copy: {
            images: {
                files: [
                    {expand: true, cwd: '<%= mapboxThemeFolder %>/images/', src: ['**', '!*.sh'], dest: '<%= distFolder %>/images/'},
                    {expand: true, cwd: '<%= cedarmapsThemeFolder %>/images/', src: '**', dest: '<%= distFolder %>/images/'}                    
                ]
            },
            apiDocument: {
                cwd: '<%= mapboxFolder %>/',
                src: 'API.md',
                dest: './',
                expand: true,
                options: {
                    process: function (content, srcpath) {
                        return content.replace(/L\.mapbox/g,"L.cedarmaps");
                    }
                }
            }
        },

        browserify: {
            mapboxStandalone: {
                files: {
                    '<%= distFolder %>/mapbox.standalone.uncompressed.js': ['<%= mapboxSourceFolder %>/mapbox.js']
                }
            },
            cedarmaps: {
                options: {
                    banner: '<%= jsBanner %>'
                },
                src: '<%= cedarmapsSourceFolder %>/index.js',
                dest: '<%= distFolder %>/cedarmaps.uncompressed.js',
                // files: {
                //     '<%= distFolder %>/cedarmaps.js': ['<%= cedarmapsSourceFolder %>/index.js']
                // }
            },
            cedarmapsStandalone: {
                options: {
                    banner: '<%= jsBanner %>'
                },
                files: {
                    '<%= distFolder %>/cedarmaps.standalone.uncompressed.js': ['<%= mapboxSourceFolder %>/mapbox.js', '<%= cedarmapsSourceFolder %>/cedarmaps.js']
                }
            }
        },
        uglify: {
            cedarmaps: {
                options: {

                },
                files: {
                    '<%= distFolder %>/cedarmaps.js': ['<%= browserify.cedarmaps.dest %>']
                }
            }
        },

        cssmin: {
          options: {
            mergeIntoShorthands: false,
            roundingPrecision: -1
          },
          target: {
            files: {
              '<%= distFolder %>/cedarmaps.css': ['<%= distFolder %>/cedarmaps.uncompressed.css']
            }
          }
        }
    });

    /* Loading packages */
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Registering Tasks
    grunt.registerTask('build', [
            //'browserify:mapboxStandalone',
            'browserify:cedarmaps',
            'browserify:cedarmapsStandalone',
            'concat:css',
            'cssmin',
            'copy:images',
            'uglify:cedarmaps'
            ]);

    grunt.registerTask('doc', [
            'copy:apiDocument'
            ]);

    grunt.registerTask('default', 'build');
};
