define(['jquery', 'underscore', 'backbone', 'app',
	'leaflet',
	'modules/Geocode'
], function ($, _, Backbone, app,
	L,
	Geocode
) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Models.Booking = Backbone.Model.extend({});

	var dummyBookings = function () {
		var bookings = [
			{
				route: [
					{name: '1 Marina Boulevard'},
					{name: 'East Coast Park Rd'}
				],
				date: 'Today - 2013-06-12',
				active: true,
				time: '10:45'
			}, {
				route: [
					{name: '3A Jalan Terusan'},
					{name: 'Redhill MRT'},
					{name: 'Clarke Quay MRT'}
				],
				date: 'Today - 2013-06-12',
				active: false,
				time: '18:00'
			}, {
				route: [
					{name: '834 Sims Ave'},
					{name: 'Kallang Pudding Road'},
					{name: '122C Sengkang East Way'}
				],
				date: 'Tomorrow - 2013-06-13',
				active: false,
				time: '12:15'
			}, {
				route: [
					{name: '834 Sims Ave'},
					{name: 'Kallang Pudding Road'},
					{name: '122C Sengkang East Way'}
				],
				date: 'Tomorrow - 2013-06-13',
				active: false,
				time: '12:15'
			}, {
				route: [
					{name: '834 Sims Ave'},
					{name: 'Kallang Pudding Road'},
					{name: '122C Sengkang East Way'}
				],
				date: 'Tomorrow - 2013-06-13',
				active: false,
				time: '12:15'
			}, {
				route: [
					{name: '834 Sims Ave'},
					{name: 'Kallang Pudding Road'},
					{name: '122C Sengkang East Way'}
				],
				date: 'Tomorrow - 2013-06-13',
				active: false,
				time: '12:15'
			}, {
				route: [
					{name: '834 Sims Ave'},
					{name: 'Kallang Pudding Road'},
					{name: '122C Sengkang East Way'}
				],
				date: 'Tomorrow - 2013-06-13',
				active: false,
				time: '12:15'
			}, {
				route: [
					{name: '834 Sims Ave'},
					{name: 'Kallang Pudding Road'},
					{name: '122C Sengkang East Way'}
				],
				date: 'Tomorrow - 2013-06-13',
				active: false,
				time: '12:15'
			}, {
				route: [
					{name: '834 Sims Ave'},
					{name: 'Kallang Pudding Road'},
					{name: '122C Sengkang East Way'}
				],
				date: 'Tomorrow - 2013-06-13',
				active: false,
				time: '12:15'
			}, {
				route: [
					{name: '834 Sims Ave'},
					{name: 'Kallang Pudding Road'},
					{name: '122C Sengkang East Way'}
				],
				date: 'Tomorrow - 2013-06-13',
				active: false,
				time: '12:15'
			}, {
				route: [
					{name: '834 Sims Ave'},
					{name: 'Kallang Pudding Road'},
					{name: '122C Sengkang East Way'}
				],
				date: 'Tomorrow - 2013-06-13',
				active: false,
				time: '12:15'
			}, {
				route: [
					{name: '834 Sims Ave'},
					{name: 'Kallang Pudding Road'},
					{name: '122C Sengkang East Way'}
				],
				date: 'Tomorrow - 2013-06-13',
				active: false,
				time: '12:15'
			}, {
				route: [
					{name: '834 Sims Ave'},
					{name: 'Kallang Pudding Road'},
					{name: '122C Sengkang East Way'}
				],
				date: 'Tomorrow - 2013-06-13',
				active: false,
				time: '12:15'
			}, {
				route: [
					{name: '834 Sims Ave'},
					{name: 'Kallang Pudding Road'},
					{name: '122C Sengkang East Way'}
				],
				date: 'Tomorrow - 2013-06-13',
				active: false,
				time: '12:15'
			}
		];
		_.each(bookings, function (booking) {
			_.each(booking.route, function (stop) {
				var directionLng = Math.random() > 0.5 ? 1 : -1;
				var directionLat = Math.random() > 0.5 ? 1 : -1;
				stop.lng = 103.8000 + directionLng * (Math.random() * 0.15);
				stop.lat = 1.3267 + directionLat * (Math.random() * 0.08);
			});
		});
		return bookings;
	};

	Collections.Schedule = Backbone.Collection.extend({
		model: Models.Booking,
		url: function () {
			return app.api('bookings/schedule/');
		},
		fetch: function () {
			var that = this;
			setTimeout(function () {
				that.reset(dummyBookings());
				that.trigger('sync');
			}, 500);
		}
	});

	Collections.Current = Collections.Schedule.extend({
		url: function () {
			return app.api('bookings/current/:lat/:lng/', this.options);
		},
		initialize: function (models, options) {
			this.options = options || {};
		},
		setLocation: function (location) {
			this.options.lat = location.lat;
			this.options.lng = location.lng;
			return this;
		}
	});

	Collections.Advanced = Collections.Schedule.extend({
		url: function () {
			return app.api('bookings/advanced/');
		}
	});

	Views.List = Backbone.View.extend({
		template: 'bookings/list',
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

	Views.ListCurrent = Views.List.extend({
		serialize: function () {
			var list = Views.List.prototype.serialize.apply(this, arguments);
			if (list.calendar.length >= 1) {
				list.calendar[0].pretty = 'Nearby booking requests';
			}
			return list;
		}
	});

	Views.AvailableCurrent = Backbone.View.extend({
		template: 'bookings/availableCurrent',
		watchPosition: null,
		initialize: function () {
			var that = this;
			this.watchPosition = navigator.geolocation.watchPosition(
				function (position) {
					that.collection.setLocation(position);
					that.collection.fetch();
				},
				function () {},
				{enableHighAccuracy: true}
			);
		},
		beforeRender: function () {
			this.setViews({
				'#bookings-list': new Views.ListCurrent({
					collection: this.collection
				})
			});
		},
		cleanup: function () {
			navigator.geolocation.clearWatch(this.watchPosition);
		}
	});

	Views.AvailableAdvanced = Backbone.View.extend({
		template: 'bookings/availableAdvanced',
		beforeRender: function () {
			this.setViews({
				'#bookings-list': new Views.List({
					collection: this.collection
				})
			});
		},
	});

	Views.AvailableMap = Backbone.View.extend({
		template: 'bookings/availableMap',
		initialize: function () {
			this.listenTo(this.model, 'change', this.updateGeocode);
			this.listenTo(this.collection, 'sync', this.updateBookings);
		},
		events: {
			'click article > button': 'locateMe'
		},
		map: null,
		pickups: null,
		afterRender: function () {
			var container = this.$el.find('#map').get(0);
			var map = this.map = L.map(container);
			var that = this;
			L.tileLayer('http://{s}.tile.cloudmade.com' +
				'/{key}/22677/256/{z}/{x}/{y}.png', {
				attribution: '&copy; OpenStreetMap, CloudMade',
				key: 'BC9A493B41014CAABB98F0471D759707'
			}).addTo(map);
			// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			//	attribution: '&copy; OpenStreetMap'
			// }).addTo(map);
			map.setView([1.3667, 103.7500], 11);
			map.on('drag', function () {
				map.stopLocate();
			});
			map.on('move', _.throttle(function () {
				var location = map.getCenter();
				that.model
					.set(location)
					.fetch();
				that.collection
					.setLocation(location)
					.fetch();
			}, 1000));
			this.locateMe();
		},
		cleanup: function () {
			this.map.stopLocate();
		},
		locateMe: function (event) {
			this.map.stopLocate();
			this.map.locate({
				enableHighAccuracy: true,
				setView: true,
				watch: true
			});
		},
		updateGeocode: function () {
			this.$el.find('header b').text(this.model.get('address'));
		},
		updateBookings: function () {
			var bookings = {
				type: 'FeatureCollection',
				features: this.collection.map(function (booking) {
					var pickup = booking.get('route')[0];
					var point = {
						type: 'Point',
						coordinates: [pickup.lng, pickup.lat]
					};
					var feature = {
						type: 'Feature',
						id: booking.id,
						geometry: point,
						properties: {
							name: pickup.name,
							popupContent: booking.time
						}
					};
					return feature;
				})
			};
			if (this.pickups) {
				this.map.removeLayer(this.pickups);
			}
			this.pickups = L.geoJson(bookings).addTo(this.map);
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};

});
