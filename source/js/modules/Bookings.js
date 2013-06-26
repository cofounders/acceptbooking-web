define(['jquery', 'underscore', 'backbone', 'app',
	'constants',
	'leaflet',
	'moment',
	'modules/Geocodes',
	'modules/Passengers'
], function ($, _, Backbone, app,
	constants,
	L,
	moment,
	Geocodes,
	Passengers
) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Models.Booking = Backbone.Model.extend({
		url: function () {
			return app.api('bookings/');
		}
	});

	Models.Details = Models.Booking.extend({
		url: function () {
			return app.api('bookings/:id', this);
		}
	});

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
			booking.id = Math.ceil(Math.random() * 50000);
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
			return app.api('bookings/');
		},
		parse: function (response) {
			return response.objects;
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
			var isActive = function (booking) {
				return booking.status === constants.BOOKING.STATUS.ACTIVE;
			};
			var bookings = _.map(
				this.collection.toJSON(),
				function (booking) {
					booking.active = isActive(booking);
					booking.time = moment(booking.pickup_time).format('HH:MM');
					return booking;
				});
			var trimDay = function (booking) {
				return moment(booking.pickup_time).format('YYYY-MM-DD');
			};
			var byDate = _.groupBy(bookings, trimDay);
			var dates = _.keys(byDate).sort();
			var calendar = _.map(dates, function (date) {
				return {
					pretty: moment(date).format('dddd, MMMM Do'),
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
			var that = this;
			var list = Views.List.prototype.serialize.apply(this, arguments);
			if (list.calendar.length >= 1) {
				var today = list.calendar[0];
				today.pretty = 'Nearby booking requests';
				_.each(today.bookings, function (booking) {
					var coordinates = booking.route[0];
					var pickup = new L.LatLng(
						coordinates.lat,
						coordinates.lng
					);
					var distance = pickup.distanceTo([
						that.collection.options.lat,
						that.collection.options.lng
					]);
					booking.distance = Math.ceil(distance / 1000);
					booking.eta = '~' +
						Math.ceil(2 + Math.random() * booking.distance) +
						'min';
					delete booking.time;
				});
			}
			return list;
		}
	});

	Views.ListAdvanced = Views.List.extend({
		serialize: function () {
			var that = this;
			var list = Views.List.prototype.serialize.apply(this, arguments);
			_.each(list.calendar, function (day) {
				_.each(day.bookings, function (booking) {
					var chance = Math.random();
					if (chance < 0.2) {
						booking.duration = 'All day';
					} else if (chance < 0.5) {
						var hours = Math.round(4 + Math.random() * 20);
						var minutes = 15 * Math.round(1 + Math.random() * 2);
						booking.until = hours + ':' + minutes;
					}
				});
			});
			return list;
		}
	});

	Views.AvailableCurrent = Backbone.View.extend({
		template: 'bookings/availableCurrent',
		watchPosition: null,
		initialize: function () {
			var that = this;
			this.watchPosition = navigator.geolocation.watchPosition(
				function (geoposition) {
					var position = new L.LatLng(
						geoposition.coords.latitude,
						geoposition.coords.longitude
					);
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
				'#bookings-list': new Views.ListAdvanced({
					collection: this.collection
				})
			});
		}
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
			var lat = this.model.get('lat') || 1.3667;
			var lng = this.model.get('lng') || 103.7500;
			map.setView([lat, lng], 11);
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
			if (this.model.has('address')) {
				this.updateGeocode();
			} else {
				this.locateMe();
			}
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

	Views.AvailableMapSearch = Backbone.View.extend({
		template: 'bookings/availableMapSearch',
		initialize: function (options) {
			this.options = options;
		},
		events: {
			'submit': 'search'
		},
		search: function (event) {
			var query = this.$el.find('input[type="search"]').val();
			this.options.search.setQuery(query);
			this.options.search.fetch();
			event.preventDefault();
		}
	});

	Views.Details = Backbone.View.extend({
		template: 'bookings/details',
		initialize: function (options) {
			this.options = options;
		},
		serialize: function () {
			return this.model.toJSON();
		},
		afterRender: function () {
			var container = this.$el.find('#map').get(0);
			var map = this.map = L.map(container);
			var that = this;
			L.tileLayer('http://{s}.tile.cloudmade.com' +
				'/{key}/22677/256/{z}/{x}/{y}.png', {
				attribution: '&copy; OpenStreetMap, CloudMade',
				key: 'BC9A493B41014CAABB98F0471D759707'
			}).addTo(map);
			var lat = this.model.get('lat') || 1.3667;
			var lng = this.model.get('lng') || 103.7500;
			map.setView([lat, lng], 11);
		}
	});

	Views.Add = Backbone.View.extend({
		template: 'bookings/add',
		events: {
			'submit': 'save',
			'focusin': 'highlight',
			'focusout': 'deselect',
			'click .insert': 'stop'
		},
		highlight: function (event) {
			$(event.target).closest('label').addClass('active');
		},
		deselect: function (event) {
			$(event.target).closest('label').removeClass('active');
		},
		stop: function (event) {
			event.preventDefault();
		},
		save: function (event) {
			event.preventDefault();
			var that = this;
			var stops = this.$el.find('.route input')
				.map(function (index, element) {
					return $(this).val().trim();
				})
				.filter(function (index, value) {
					return !!value;
				})
				.get();
			var value = function (selector) {
				return that.$el.find(selector).val().trim();
			};
			var full_name = value('.passenger .name input');
			var passenger = new Passengers.Models.Passenger({});
			passenger.save({
				networks: [app.defaultNetwork],
				first_name: full_name.split(/\s+/).shift(),
				last_name: full_name.split(/\s+/).slice(1).join(' '),
				phone: value('.passenger .phone input'),
				email: value('.passenger .email input')
			}, {
				success: function () {
					var booking = new Models.Booking({});
					booking.save({
						passenger: passenger.get('resource_uri'),
						pickup_time: value('.datetime .pickup input'),
						dropoff_time: value('.datetime .dropoff input'),
						special_instructions: value('.extras .note textarea'),
						network: app.defaultNetwork,
						route: stops
					}, {
						success: function () {
							app.router.navigate('bookings/schedule', {
								trigger: true,
								replace: true
							});
						},
						error: function () {}
					});
				},
				error: function () {}
			});
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};

});
