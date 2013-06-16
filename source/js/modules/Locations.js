define(['jquery', 'underscore', 'backbone', 'app'
], function ($, _, Backbone, app
) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Models.Query = Backbone.Model.extend({
	});

	Collections.Recent = Backbone.Collection.extend({
		model: Models.Query,
		fetch: function (options) {
			var that = this;
			setTimeout(function () {
			}, 100 + Math.random() * 300);
		}
	});

	Views.Recent = Backbone.View.extend({
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};

});
