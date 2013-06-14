define([
	'jquery', 'underscore', 'backbone', 'app',
	'modules/Bookings',
	'modules/Geocode',
	'modules/Layouts'
], function (
	$, _, Backbone, app,
	Bookings,
	Geocode,
	Layouts
) {
	return Backbone.Router.extend({

		routes: {
			'': 'splash',
			'install': 'install',
			'login': 'login',
			'menu': 'menu',
			'drivers/network': 'network',
			'account/welcome': 'setup',
			'bookings/add': 'add',
			'bookings/current': 'current',
			'bookings/assigned': 'assigned',
			'bookings/schedule': 'schedule',
			'bookings/available': 'availableList',
			'bookings/available/map': 'availableMap',
			'*path': '404'
		},

		install: function () {
			if (navigator.standalone === true) {
				app.router.navigate('/', {trigger: true});
			} else {
				app.useLayout(Layouts.Views.Install, {
				}).render();
			}
		},

		splash: function () {
			app.useLayout(Layouts.Views.Splash, {
			}).render();
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
				'article': new Bookings.Views.Schedule({
					collection: bookings
				})
			}).render();
			bookings.fetch();
		},

		availableList: function () {
			var bookings = new Bookings.Collections.Available();
			app.useLayout(Layouts.Views.Available, {
			}).setViews({
				'article': new Bookings.Views.AvailableList({
					collection: bookings
				})
			}).render();
		},

		availableMap: function () {
			var bookings = new Bookings.Collections.Available();
			var geocode = new Geocode.Models.Reverse();
			app.useLayout(Layouts.Views.AvailableMap, {
			}).setViews({
				'section': new Bookings.Views.AvailableMap({
					collection: bookings,
					model: geocode
				})
			}).render();
		},

		404: function () {
			app.useLayout(Layouts.Views['404'], {
			}).render();
		}

	});
});
