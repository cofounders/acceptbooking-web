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

	Views.Navigation = Backbone.View.extend({
		initialize: function (options) {
			window.scrollTo(0, 0);
			this.setViews({
				'header': new Navigation.Views.Primary(this.header),
				'footer': new Navigation.Views.Secondary(this.footer)
			});
		}
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

	Views.Assigned = Views.Base.extend({
		template: 'layouts/assigned'
	});

	Views.Schedule = Views.Navigation.extend({
		template: 'layouts/schedule',
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
		footer: {buttons: [
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
		]}
	});

	Views.Available = Views.Base.extend({
		template: 'layouts/available'
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
