module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-w3c-html-validation');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-handlebars');

    grunt.registerTask('default', ['validation', 'handlebars']);

    grunt.initConfig(
        {
            validation: {
                options: {
                    doctype: 'HTML5',
                    wrapFile: 'assets/templates/wrapfile.html',
                    generateReport: false
                },
                files: {
                    src: ['*.html', 'assets/templates/**/*.hbs.html']
                }
            },
            watch: {
                files: ['*.html', 'assets/templates/**/*.html', 'assets/templates/**/*.hbs.html'],
                tasks: ['validation', 'handlebars']
            },
            handlebars: {
                compile: {
                    options: {
                        namespace: 'App.templates'
                    },
                    files: {
                        'assets/javascript/templates.js': 'assets/templates/**/*.hbs.html'
                    }
                }
            }

        });

};
