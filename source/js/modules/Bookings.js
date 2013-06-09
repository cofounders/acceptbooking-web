define(['jquery', 'underscore', 'backbone', 'app',
	'leaflet'
], function ($, _, Backbone, app,
	L
) {
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
					date: 'Today - 2013-06-12',
					active: true,
					time: '10:45'
				}, {
					route: [
						'3A Jalan Terusan',
						'Redhill MRT',
						'Clarke Quay MRT'
					],
					date: 'Today - 2013-06-12',
					active: false,
					time: '18:00'
				}, {
					route: [
						'834 Sims Ave',
						'Kallang Pudding Road',
						'122C Sengkang East Way'
					],
					date: 'Tomorrow - 2013-06-13',
					active: false,
					time: '12:15'
				}, {
					route: [
						'834 Sims Ave',
						'Kallang Pudding Road',
						'122C Sengkang East Way'
					],
					date: 'Tomorrow - 2013-06-13',
					active: false,
					time: '12:15'
				}, {
					route: [
						'834 Sims Ave',
						'Kallang Pudding Road',
						'122C Sengkang East Way'
					],
					date: 'Tomorrow - 2013-06-13',
					active: false,
					time: '12:15'
				}, {
					route: [
						'834 Sims Ave',
						'Kallang Pudding Road',
						'122C Sengkang East Way'
					],
					date: 'Tomorrow - 2013-06-13',
					active: false,
					time: '12:15'
				}, {
					route: [
						'834 Sims Ave',
						'Kallang Pudding Road',
						'122C Sengkang East Way'
					],
					date: 'Tomorrow - 2013-06-13',
					active: false,
					time: '12:15'
				}, {
					route: [
						'834 Sims Ave',
						'Kallang Pudding Road',
						'122C Sengkang East Way'
					],
					date: 'Tomorrow - 2013-06-13',
					active: false,
					time: '12:15'
				}, {
					route: [
						'834 Sims Ave',
						'Kallang Pudding Road',
						'122C Sengkang East Way'
					],
					date: 'Tomorrow - 2013-06-13',
					active: false,
					time: '12:15'
				}, {
					route: [
						'834 Sims Ave',
						'Kallang Pudding Road',
						'122C Sengkang East Way'
					],
					date: 'Tomorrow - 2013-06-13',
					active: false,
					time: '12:15'
				}, {
					route: [
						'834 Sims Ave',
						'Kallang Pudding Road',
						'122C Sengkang East Way'
					],
					date: 'Tomorrow - 2013-06-13',
					active: false,
					time: '12:15'
				}, {
					route: [
						'834 Sims Ave',
						'Kallang Pudding Road',
						'122C Sengkang East Way'
					],
					date: 'Tomorrow - 2013-06-13',
					active: false,
					time: '12:15'
				}]);
				that.trigger('sync');
			}, 500);
		}
	});

	Collections.Available = Backbone.Collection.extend({
		model: Models.Booking,
		initialize: function (models, options) {
			this.options = options;
		},
		url: function () {
			return app.api('bookings/available/:lon/:lat/', this.options);
		}
	});

	Views.Schedule = Backbone.View.extend({
		template: 'bookings/schedule',
		initialize: function () {
			this.listenTo(this.collection, 'sync', this.render);
		},
		serialize: function () {
			var byDate = _.groupBy(this.collection.toJSON(), 'date');
			var dates = _.keys(byDate).sort();
			var isActive = function (booking) {
				return !!booking.active;
			};
			var calendar = _.map(dates, function (date) {
				return {
					date: date,
					pretty: date,
					active: _.any(byDate[date], isActive),
					bookings: byDate[date]
				};
			});
			return {
				calendar: calendar
			};
		}
	});

	Views.AvailableList = Backbone.View.extend({
		template: 'bookings/availableList',
		initialize: function () {
			this.listenTo(this.collection, 'sync', this.render);
		}
	});

	Views.AvailableMap = Backbone.View.extend({
		template: 'bookings/availableMap',
		initialize: function () {
			// this.listenTo(this.collection, 'sync', this.render);
		},
		afterRender: function () {
			var container = this.$el.find('#map').get(0);
			var map = L.map(container).setView([1.3667, 103.7500], 11);
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: '&copy; OpenStreetMap'
			}).addTo(map);
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};

});
