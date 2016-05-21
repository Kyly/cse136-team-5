module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-w3c-html-validation');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-express-server');

    grunt.registerTask('default', ['validation', 'handlebars']);
    grunt.registerTask('serve', ['express:dev']);

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
                    files:  [ '**/*.js', '!assets/**/*.js' ],
                    tasks:  [ 'express:dev' ],
                    options: {
                        spawn: false,
                        atBegin: true
                    }
                },
                html: {
                    files: ['**/*.html'],
                    tasks: ['validation', 'handlebars']
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
                        script: './bin/www',
                        debug: true,
                        background: false
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
