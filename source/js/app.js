define([
	'jquery', 'underscore', 'backbone',
	'backbone.layoutmanager',
	'libs/url',
	'constants'
], function (
	$, _, Backbone,
	LayoutManager,
	url,
	constants
) {
	var app = _.extend({

		defaultNetwork: '/api/v1/networks/1/',

		el: '#app',

		root: '/',

		constants: constants,

		api: function (endpoint, fields, data) {
			var apiBasePath = '/api/api/v1';
			var hasSlash = /\/$/.test(apiBasePath) || /^\//.test(endpoint);
			if (!hasSlash) {
				apiBasePath += '/';
			}
			var path = apiBasePath + endpoint;
			return url(path, _.clone(fields), _.defaults({
				format: 'json'
			}, data));
		},

		useLayout: function (layout, options) {
			options = options || {};

			if (_.isString(layout)) {
				if (this.layout) {
					this.layout.template = layout;
				} else {
					this.layout = new Backbone.Layout(_.extend({
						el: app.el,
						template: layout
					}, options));
				}
			}

			else if (
				(layout.prototype instanceof Backbone.Layout ||
					layout.prototype instanceof Backbone.View)
			) {
				var Constructor = layout;
				if (this.layout) {
					this.layout.remove();
				}
				this.layout = new Constructor(options);
				$(app.el).empty().append(this.layout.el);
			}

			return this.layout;
		}

	}, Backbone.Events);

	return app;
});
