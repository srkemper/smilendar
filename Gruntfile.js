module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		yeoman:{
      src: 'src',
      dist: 'public'
    },
	    jshint: {
	      // uglify task configuration goes here.
	      files: ['routes/*.js, *.js'],
	      options: {
	      	globals: {
	      		jQuery: true,
	      		console: true,
	      		module: true
	      	}
	      },
	      // ignore_warning: {
	      // 	options: {
	      // 		'-WO99': true
	      // 	},
	      // 	src: ['routes/*.js, *.js']
	      // }
	    },
			handlebars: {
	      compile: {
	        files: {
	          '<%= yeoman.dist %>/templates/hbt.js': [
	            'templates/*.handlebars'
	          ]
	        },
	        options: {
	          namespace: 'Smilendar.Templates',
	          wrapped: true,
	          processName: function(filename) {
	            // funky name processing here
	            return filename
	                    .replace(/^app\/modules\//, '')
	                    .replace(/\.hbs$/, '');
	          }
	        }
	      }
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
	    },
	    watch: {
	    	files: ['routes/*.js', '*.js','templates/*.handlebars'],
	    	tasks: ['jshint', 'express:dev','handlebars'],
	    	options: {
	    		spawn: false
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