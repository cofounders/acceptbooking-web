define([
	'jquery', 'underscore', 'backbone', 'app',
	'modules/Bookings',
	'modules/Geocodes',
	'modules/Layouts',
	'modules/Locations'
], function (
	$, _, Backbone, app,
	Bookings,
	Geocodes,
	Layouts,
	Locations
) {
	return Backbone.Router.extend({

		routes: {
			'': 'splash',
			'login': 'login',
			'menu': 'menu',
			'drivers/network': 'network',
			'account/welcome': 'setup',
			'bookings/add': 'add',
			'bookings/current': 'current',
			'bookings/assigned': 'assigned',
			'bookings/schedule': 'schedule',
			'bookings/available': 'available',
			'bookings/available/current': 'availableCurrent',
			'bookings/available/advanced': 'availableAdvanced',
			'bookings/available/map': 'availableMap',
			'bookings/available/map/:lat/:lng/:address': 'availableMap',
			'bookings/available/map/search': 'availableMapSearch',
			'*path': '404'
		},

		splash: function () {
			var isMobileSafari = navigator.standalone === false &&
					!navigator.userAgent.match('CriOS');
			if (isMobileSafari) {
				app.useLayout(Layouts.Views.Install, {
				}).render();
			} else {
				app.useLayout(Layouts.Views.Splash, {
				}).render();
			}
		},

		login: function () {
			app.useLayout(Layouts.Views.Login, {
			}).setViews({
			}).render();
		},

		menu: function () {
			app.useLayout(Layouts.Views.Menu, {
			}).setViews({
			}).render();
		},

		network: function () {
			app.useLayout(Layouts.Views.Network, {
			}).setViews({
			}).render();
		},

		setup: function () {
			app.useLayout(Layouts.Views.Setup, {
			}).setViews({
			}).render();
		},

		add: function () {
			app.useLayout(Layouts.Views.Add, {
			}).setViews({
				'article': new Bookings.Views.Add()
			}).render();
		},

		details: function () {
			app.useLayout(Layouts.Views.Details, {
			}).setViews({
			}).render();
		},

		current: function () {
			app.useLayout(Layouts.Views.Current, {
			}).setViews({
			}).render();
		},

		assigned: function () {
			app.useLayout(Layouts.Views.Assigned, {
			}).setViews({
			}).render();
		},

		schedule: function () {
			var bookings = new Bookings.Collections.Schedule();
			app.useLayout(Layouts.Views.Schedule, {
			}).setViews({
				'article > #bookings-list': new Bookings.Views.List({
					collection: bookings
				})
			}).render();
			bookings.fetch();
		},

		available: function () {
			this.navigate('bookings/available/current', {
				trigger: true,
				replace: true
			});
		},

		availableCurrent: function () {
			var bookings = new Bookings.Collections.Current();
			app.useLayout(Layouts.Views.AvailableCurrent, {
			}).setViews({
				'article': new Bookings.Views.AvailableCurrent({
					collection: bookings
				})
			}).render();
		},

		availableAdvanced: function () {
			var bookings = new Bookings.Collections.Advanced();
			app.useLayout(Layouts.Views.AvailableAdvanced, {
			}).setViews({
				'article': new Bookings.Views.AvailableAdvanced({
					collection: bookings
				})
			}).render();
			bookings.fetch();
		},

		availableMap: function (lat, lng, address) {
			var bookings = new Bookings.Collections.Current();
			var geocode = new Geocodes.Models.Reverse();
			if (address && lat && lng) {
				geocode.set({
					address: address,
					lat: lat,
					lng: lng
				});
			}
			app.useLayout(Layouts.Views.AvailableMap, {
			}).setViews({
				'section': new Bookings.Views.AvailableMap({
					collection: bookings,
					model: geocode
				})
			}).render();
		},

		availableMapSearch: function () {
			var recent = new Locations.Collections.Recent();
			var search = new Geocodes.Collections.Search();
			app.useLayout(Layouts.Views.AvailableMapSearch, {
			}).setViews({
				'article > #search': new Bookings.Views.AvailableMapSearch({
					recent: recent,
					search: search
				}),
				'article > #results': new Geocodes.Views.Search({
					collection: search
				}),
				'article > #recent': new Locations.Views.Recent({
					collection: recent
				})
			}).render();
			recent.fetch();
		},

		404: function () {
			app.useLayout(Layouts.Views['404'], {
			}).render();
		}

	});
});
