define([
	'jquery', 'underscore', 'backbone', 'app',
	'modules/Layouts'
], function (
	$, _, Backbone, app,
	Layouts
) {
	return Backbone.Router.extend({

		routes: {
			'': 'landing',
			'install': 'install',
			'login': 'login',
			'menu': 'menu',
			'drivers/network': 'network',
			'account/welcome': 'setup',
			'bookings/add': 'add',
			'bookings/current': 'current',
			'bookings/assigned': 'assigned',
			'bookings/schedule': 'schedule',
			'bookings/available': 'available',
			'*path': '404'
		},

		install: function () {
			if (navigator.standalone === true) {
				app.router.navigate('/', {trigger: true});
			} else {
				app.useLayout(Layouts.Views.Install, {
				}).setViews({
				}).render();
			}
		},

		landing: function () {
			app.useLayout(Layouts.Views.Landing, {
			}).setViews({
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
			app.useLayout(Layouts.Views.Schedule, {
			}).setViews({
			}).render();
		},

		available: function () {
			app.useLayout(Layouts.Views.Available, {
			}).setViews({
			}).render();
		},

		404: function () {
			app.useLayout(Layouts.Views['404'], {
			}).render();
		}

	});
});
