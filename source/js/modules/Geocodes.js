define(['jquery', 'underscore', 'backbone', 'app',
	'leaflet'
], function ($, _, Backbone, app,
	L
) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Models.Reverse = Backbone.Model.extend({
		url: function () {
			return app.api(
				'/location/geocode/reverse/:lat/:lng/',
				this.toJSON()
			);
		},
		fetch: function (options) {
			var that = this;
			setTimeout(function () {
				var streets = [
					'Kallang Pudding Rd',
					'Sims Ave',
					'Sengkang East Way',
					'Changi Road',
					'Marina Boulevard',
					'Jalan Terusan'
				];
				var street = _.shuffle(streets)[0];
				var number = Math.ceil(Math.random() * 200);
				var address = '' + number + ' ' + street;
				var response = {
					address: address
				};
				that.set(response);
				if (options && options.success) {
					options.success(that, response, options);
				}
			}, 100 + Math.random() * 300);
		}
	});

	Collections.Search = Backbone.Collection.extend({
	});

	Views.Search = Backbone.View.extend({
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};

});
