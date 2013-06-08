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
						href: '/drivers/network',
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
	});

	Views.Install = Views.Base.extend({
		template: 'layouts/install'
	});

	Views.Landing = Views.Base.extend({
		template: 'layouts/landing'
	});

	Views.Login = Views.Base.extend({
		template: 'layouts/login'
	});

	Views.Menu = Views.Base.extend({
		template: 'layouts/menu'
	});

	Views.Network = Views.Base.extend({
		template: 'layouts/network'
	});

	Views.Setup = Views.Base.extend({
		template: 'layouts/setup'
	});

	Views.Add = Views.Base.extend({
		template: 'layouts/add'
	});

	Views.Current = Views.Base.extend({
		template: 'layouts/current'
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
			title: 'Schedule'
		}
	});

	Views.Available = Views.Navigation.extend({
		template: 'layouts/available',
		header: {
			title: 'Available Jobs'
		}
	});

	Views['404'] = Views.Base.extend({
		template: 'layouts/404'
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};

});
