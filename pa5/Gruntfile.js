module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-w3c-html-validation');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['validation', 'handlebars', 'uglify']);
    grunt.registerTask('server', [ 'express:dev', 'watch' ]);

    grunt.initConfig(
        {
            validation: {
                options: {
                    doctype: 'HTML5',
                    wrapFile: 'assets/templates/wrapfile.html',
                    generateReport: false
                },
                files: {
                    src: ['**/*.html', '!**/*.hbs', '!node_modules/**', '!assets/lib/**']
                }
            },
            watch: {
                options: {
                    livereload: true
                },
                express: {
                    files:  [ '**/*.js' ],
                    tasks:  [ 'express:dev' ],
                    options: {
                        spawn: false
                    }
                },
                client: {
                    files: ['assets/**/*.html', 'assets/**/*.js', '!assets/**/*.min.js'],
                    tasks: ['validation', 'handlebars', 'uglify']
                }
            },
            uglify: {
                scripts: {
                    options: {
                        sourceMap: true,
                        mangle: false
                    },
                    files: {
                        'assets/javascript/scripts.min.js': [
                            'assets/lib/axios/dist/axios.js',
                            'assets/lib/handlebars/handlebars.js',
                            'assets/javascript/templates.js',
                            'assets/javascript/app.js',
                            'assets/javascript/script.js',
                            'assets/javascript/create-bookmark.js',
                            'assets/javascript/edit-bookmark.js'
                            /* Added modules here */
                        ]
                    }
                }
            },
            handlebars: {
                compile: {
                    options: {
                        namespace: 'App.templates'
                    },
                    files: {
                        'assets/javascript/templates.js': 'assets/templates/**/*.hbs'
                    }
                }
            },
            express: {
                options: {
                    // Override defaults here
                },
                dev: {
                    options: {
                        script: './bin/www'
                    }
                },
                prod: {
                    options: {
                        script: './bin/www',
                        node_env: 'production'
                    }
                }
            }

        });

};