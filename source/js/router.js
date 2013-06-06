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
			'login': 'login',
			'drivers/network': 'network',
			'account/welcome': 'setup',
			'bookings/current': 'current',
			'bookings/schedule': 'schedule',
			'bookings/available': 'available',
			'*path': '404'
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

		current: function () {
			app.useLayout(Layouts.Views.Current, {
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
