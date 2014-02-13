module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	    jshint: {
	      // uglify task configuration goes here.
	      files: ['routes/*.js'],
	      options: {
	      	globals: {
	      		jQuery: true,
	      		console: true,
	      		module: true
	      	}
	      }
	    },
	    watch: {
	    	files: ['routes/*.js', '*.js'],
	    	tasks: ['jshint', 'express:dev', 'shell:mongo'],
	    	options: {
	    		spawn: false
	    	}
	    },
	    handlebars: {

	    },
	    nodemon: {
	    	dev: {
	    		options: {
	    			file: 'app.js',
	    		}
	    	}
	    },
	    express: {
	    	options: {
	    		delay: 250
	    	},
    		dev: {
    			options: {
	    			script: 'app.js'
    			}
    		}
	    },
	    shell: {
	    	launchExpress: {
	    		options: {
	    			stdout: true,
	    			execOptions: {
	    				killSignal: 'SIGTERM'
	    			}
	    		},
	    		command: 'node app.js'
	    	},
	    	mongo: {
	    		command: 'mongod',
	    		options: {
	    			async: true
	    		}
	    	}
	    },
	    concurrent: {
	    	target: {
	    		tasks: ['express:dev:stop' ,'express:dev'],
	    		options: {
	    			logConcurrentOutput: true
	    		}
	    	}
	    }
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-shell-spawn');

	grunt.registerTask('default', ['express:dev', 'jshint', 'watch', 'shell:mongo', 'handlebars']);
}