define(['jquery', 'underscore', 'backbone', 'app'
], function ($, _, Backbone, app) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Views.Primary = Backbone.View.extend({
		template: 'navigation/primary',
		serialize: function () {
			return this.options;
		}
	});

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
				var current = Backbone.history.fragment;
				button.selected = target.indexOf(current) > -1;
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
