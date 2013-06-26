define([
	'jquery', 'underscore', 'backbone', 'app'
], function (
	$, _, Backbone, app
) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Models.Passenger = Backbone.Model.extend({
		url: function () {
			return app.api('passenger/');
		},
		parse: function (response, options) {
			return _.defaults(response, {
				resource_uri: options.xhr.getResponseHeader('Location')
			});
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};

});
