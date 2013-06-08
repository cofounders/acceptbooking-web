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
		},
		fetch: function () {
			var that = this;
			setTimeout(function () {
				that.reset([{
					route: [
						'1 Marina Boulevard',
						'East Coast Park Rd'
					],
					active: true,
					time: '10:45'
				}, {
					route: [
						'834 Sims Ave',
						'Kallang Pudding Road',
						'122C Sengkang East Way'
					],
					active: false,
					time: '12:15'
				}]);
				that.trigger('sync');
			}, 500);
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
