define(['jquery', 'underscore', 'backbone', 'app',
	'modules/Navigation'
],
function ($, _, Backbone, app,
	Navigation
) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Views.Base = Backbone.View.extend({
		initialize: function (options) {
			window.scrollTo(0, 0);
		}
	});

	Views.Install = Views.Base.extend({
		template: 'layouts/install'
	});

	Views.Splash = Views.Base.extend({
		template: 'layouts/splash'
	});

	Views['404'] = Views.Base.extend({
		template: 'layouts/404'
	});

	Views.Navigation = Views.Base.extend({
		initialize: function (options) {
			window.scrollTo(0, 0);
			this.setViews({
				'header': new Navigation.Views.Primary(_.defaults(this.header, {
					before: {
						href: '/menu',
						type: 'menu'
					},
					after: {
						type: 'network',
						href: '/drivers/network'
					}
				})),
				'footer': new Navigation.Views.Secondary({
					buttons: this.footer
				})
			});
		},
		footer: [
			{
				href: '/bookings/available',
				label: 'New Bookings',
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
	});

	Views.Assigned = Views.Navigation.extend({
		template: 'layouts/assigned',
		header: {
			title: 'Reassigned Jobs'
		}
	});

	Views.Schedule = Views.Navigation.extend({
		template: 'layouts/schedule',
		header: {
			title: 'My Schedule'
		},
		afterRender: function () {
			window.scrollTo(0, 40);
		}
	});

	Views.AvailableCurrent = Views.Navigation.extend({
		template: 'layouts/availableCurrent',
		header: {
			title: 'Available Jobs'
		}
	});

	Views.AvailableAdvanced = Views.Navigation.extend({
		template: 'layouts/availableAdvanced',
		header: {
			title: 'Available Jobs'
		}
	});

	Views.AvailableMap = Views.Base.extend({
		template: 'layouts/availableMap'
	});

	Views.Menu = Views.Navigation.extend({
		template: 'layouts/menu',
		initialize: function (options) {
			window.scrollTo(0, 0);
			this.setViews({
				'header': new Navigation.Views.Primary({
					title: 'Menu',
					after: {
						direction: 'next',
						href: '/bookings/schedule',
						label: 'Back'
					}
				})
			});
		}
	});

	Views.Network = Views.Navigation.extend({
		template: 'layouts/network',
		initialize: function (options) {
			window.scrollTo(0, 0);
			this.setViews({
				'header': new Navigation.Views.Primary({
					title: 'Network',
					before: {
						direction: 'prev',
						href: '/bookings/schedule',
						label: 'Back'
					}
				})
			});
		}
	});

	Views.Add = Views.Navigation.extend({
		template: 'layouts/add',
		initialize: function (options) {
			window.scrollTo(0, 0);
			this.setViews({
				'header': new Navigation.Views.Primary({
					title: 'Add a Booking',
					after: {
						direction: 'next',
						label: 'Cancel',
						href: '/bookings/schedule'
					}
				})
			});
		}
	});

	Views.Login = Views.Base.extend({
		template: 'layouts/login'
	});

	Views.Setup = Views.Base.extend({
		template: 'layouts/setup'
	});

	Views.Current = Views.Base.extend({
		template: 'layouts/current'
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};

});
