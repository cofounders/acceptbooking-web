define(['jquery', 'underscore', 'backbone', 'app'
], function ($, _, Backbone, app) {
	var Models = {};
	var Collections = {};
	var Views = {};

	/*
		Example:
		header: {
			title: 'Schedule',
			before: {
				direction: 'prev',
				href: '/menu',
				label: 'Menu',
				type: 'menu'
			},
			after: {
				direction: 'next',
				icon: true,
				type: 'network',
				href: '/drivers/network',
				label: 'Network'
			}
		},
	*/
	Views.Primary = Backbone.View.extend({
		template: 'navigation/primary',
		serialize: function () {
			var buttons = _.pick(this.options, 'before', 'after');
			_.each(buttons, function (button) {
				button.icon = (button.icon === true) || !button.label;
			});
			return this.options;
		}
	});

	/*
		Example:
		footer: [
			{
				href: '/bookings/available',
				label: 'Available Jobs',
				type: 'available'
			}, {
				href: '/bookings/schedule',
				label: 'My Schedule',
				type: 'schedule'
			}, {
				href: '/bookings/assigned',
				label: 'Reassigned Jobs',
				type: 'assigned'
			}
		]
	*/
	Views.Secondary = Backbone.View.extend({
		template: 'navigation/secondary',
		initialize: function () {
			this.listenTo(app.notifications, 'change', this.render);
		},
		serialize: function () {
			return {buttons: _.map(this.options.buttons, function (button) {
				var queue = app.notifications.get(button.type) || [];
				button.counter = queue.length;
				var target = button.href;
				var current = '/' + Backbone.history.fragment;
				button.selected = current.indexOf(target) > -1;
				return button;
			})};
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};

});
