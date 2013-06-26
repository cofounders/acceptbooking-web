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
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};

});
