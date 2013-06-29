define(['jquery', 'underscore', 'backbone', 'app',
	'constants',
	'leaflet',
	'moment',
	'libs/url',
	'modules/Geocodes',
	'modules/Passengers'
], function ($, _, Backbone, app,
	constants,
	L,
	moment,
	url,
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
			return app.api(this.get('resource_uri'));
		},
		parse: function (response) {
			return response;
		}
	});

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
			return app.api('bookings/', null, {
				// lat: this.options.lat,
				// lng: this.options.lng,
				pickup_time__isnull: false,
				// order_by: '-pickup_time',
				status: constants.BOOKING.STATUS.OPEN
			});
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
			return app.api('bookings/', null, {
				status: constants.BOOKING.STATUS.OPEN,
				pickup_time__gt: (new Date()).toISOString()
			});
		}
	});

	Views.List = Backbone.View.extend({
		template: 'bookings/list',
		bookingOmitDetails: ['duration', 'distance', 'eta'],
		initialize: function (options) {
			this.listenTo(this.collection, 'sync', this.render);
			this.options = options || {};
		},
		serialize: function () {
			var that = this;
			var setActive = function (booking) {
				var active = constants.BOOKING.STATUS.ACTIVE;
				booking.active = booking.status === active;
				return booking;
			};
			var setLink = function (booking) {
				booking.link = url(
					'/bookings/details/:resource_uri',
					booking
				);
				return booking;
			};
			var setGeo = function (booking) {
				if (!that.collection.options ||
					!that.collection.options.lat ||
					!that.collection.options.lng
				) {
					return booking;
				}

				var coordinates = booking.route[0].location.coordinates;
				var lat = coordinates[0];
				var lng = coordinates[1];
				var pickup = new L.LatLng(lat, lng);
				var distance = pickup.distanceTo([
					that.collection.options.lat,
					that.collection.options.lng
				]);
				booking.distance = Math.ceil(distance / 1000);
				booking.eta = '~' +
					Math.ceil(2 + Math.random() * booking.distance) +
					'min';
				return booking;
			};
			var setDetails = function (booking) {
				return _.omit(booking, that.bookingOmitDetails);
			};

			var bookings = _.chain(this.collection.toJSON())
				.map(setActive)
				.map(setLink)
				.map(setGeo)
				.map(setDetails)
				.value();

			var trimDay = function (booking) {
				return moment(booking.pickup_time).format('YYYY-MM-DD');
			};
			var byDate = _.groupBy(bookings, trimDay);
			var dates = _.keys(byDate).sort();
			var calendar = _.map(dates, function (date) {
				return {
					pretty: moment(date).format('dddd, MMMM Do'),
					active: _.any(byDate[date], function (booking) {
						return booking.active;
					}),
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
			}
			return list;
		},
		bookingOmitDetails: ['dropoff_time', 'duration']
	});

	Views.ListAdvanced = Views.List.extend({
		bookingOmitDetails: ['distance', 'eta']
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
						coordinates: pickup.location.coordinates.reverse()
					};
					var feature = {
						type: 'Feature',
						id: booking.id,
						geometry: point,
						properties: {
							name: pickup.formatted_address,
							popupContent: moment(booking.pickup_time)
								.calendar()
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
			this.listenTo(this.model, 'change', this.render);
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
						booking_type: constants.BOOKING.TYPE.TRANSFER,
						status: constants.BOOKING.STATUS.OPEN,
						passenger: passenger.get('resource_uri'),
						pickup_time: (new Date(
							value('.datetime .pickup input')
						)).toISOString(),
						dropoff_time: (new Date(
							value('.datetime .dropoff input')
						)).toISOString(),
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

	Views.Status = Backbone.View.extend({
		template: 'bookings/status',
		serialize: function () {
			return _.map(constants.BOOKING.STATUS, function (value, key) {
				return value === this.model.get('status');
			});
		},
		events: {
			'click .accept': 'accept',
			'click .dismiss': 'dismiss',
			'click .cancel': 'cancel',
			'click .start': 'start'
		},
		accept: function (event) {
			this.model.save({
				status: constants.BOOKING.STATUS.CONFIRMED
			});
		},
		dismiss: function (event) {},
		cancel: function (event) {},
		start: function (event) {}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};

});
