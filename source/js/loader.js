require.config({

	baseUrl: '/js',

	deps: ['main'],

	paths: {
		backbone: '//cdnjs.cloudflare.com' +
			'/ajax/libs/backbone.js/1.0.0/backbone-min',
		facebook: '//connect.facebook.net/en_US/all',
		fastclick: '//cdnjs.cloudflare.com' +
			'/ajax/libs/fastclick/0.6.7/fastclick.min',
		handlebars: '//cdnjs.cloudflare.com' +
			'/ajax/libs/handlebars.js/1.0.0-rc.4/handlebars.min',
		jquery: '//cdnjs.cloudflare.com' +
			'/ajax/libs/jquery/1.9.1/jquery.min',
		'backbone.layoutmanager': '//cdnjs.cloudflare.com' +
			'/ajax/libs/backbone.layoutmanager' +
			'/0.8.8/backbone.layoutmanager.min',
		leaflet: '//cdnjs.cloudflare.com' +
			'/ajax/libs/leaflet/0.5.1/leaflet',
		moment: '//cdnjs.cloudflare.com' +
			'/ajax/libs/moment.js/2.0.0/moment.min',
		mustache: '//cdnjs.cloudflare.com' +
			'/ajax/libs/mustache.js/0.7.0/mustache.min',
		underscore: '//cdnjs.cloudflare.com' +
			'/ajax/libs/underscore.js/1.4.4/underscore-min'
	},

	shim: {
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		facebook: {
			exports: 'FB'
		},
		fastclick: {
			deps: ['jquery'],
			exports: 'FastClick'
		},
		handlebars: {
			exports: 'Handlebars'
		},
		jquery: {
			exports: 'jQuery'
		},
		'backbone.layoutmanager': {
			deps: ['backbone']
		},
		leaflet: {
			exports: 'L'
		},
		moment: {
			exports: 'moment'
		},
		mustache: {
			exports: 'mustache'
		},
		underscore: {
			exports: '_'
		}
	}

});
