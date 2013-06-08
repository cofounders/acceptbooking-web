define(['jquery', 'underscore', 'backbone', 'app'
], function ($, _, Backbone, app) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Models.Aggregator = Backbone.Model.extend({
		defaults: {
			'available': new Array(parseInt(Math.random() * 10, 10)),
			'assigned': new Array(parseInt(Math.random() * 2, 10))
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};

});
