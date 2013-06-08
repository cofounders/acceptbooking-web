define(['jquery', 'underscore', 'backbone', 'app'
], function ($, _, Backbone, app) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Models.Booking = Backbone.Model.extend({});

	Collections.Schedule = Backbone.Collection.extend({
		model: Models.Booking,
		url: function () {
			return app.api('bookings/schedule/');
		}
	});

	Views.Schedule = Backbone.View.extend({
		template: 'bookings/schedule',
		initialize: function () {
			this.listenTo(this.collection, 'sync', this.render);
		},
		serialize: function () {
			return {
				bookings: this.collection.toJSON()
			};
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};

});
