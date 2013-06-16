/*jshint scripturl:true*/
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
		template: 'layouts/splash',
		afterRender: function () {
			this.skip = setTimeout(function () {
				app.router.navigate('bookings/schedule', {
					trigger: true,
					replace: true
				});
			}, 500);
		},
		cleanup: function () {
			clearTimeout(this.skip);
		}
	});

	Views['404'] = Views.Base.extend({
		template: 'layouts/404'
	});

	Views.Navigation = Views.Base.extend({
		initialize: function (options) {
			window.scrollTo(0, this.scrollInitialY);
			if (this.header) {
				var header = _.defaults(this.header, this.controls);
				this.setViews({
					'header': new Navigation.Views.Primary(header)
				});
			}
			if (this.footer) {
				this.setViews({
					'footer': new Navigation.Views.Secondary({
						buttons: this.footer
					})
				});
			}
		},
		afterRender: function () {
			window.scrollTo(0, this.scrollInitialY + 1);
			window.scrollTo(0, this.scrollInitialY);
			this.scrollPositionY = this.scrollInitialY;
			$(window).off('scroll.navigation touchmove.navigation');
			$(window).on(
				'scroll.navigation touchmove.navigation',
				_.bind(this.scroll, this)
			);
		},
		cleanup: function () {
			$(window).off('scroll.navigation touchmove.navigation');
		},
		scrollThresholdTop: 45,
		scrollInitialY: 0,
		scrollPositionY: 0,
		scroll: function () {
			var pageYOffset = window.pageYOffset;
			if (this.scrollPositionY < pageYOffset) {
				if (pageYOffset >= this.scrollThresholdTop) {
					this.$el.addClass('scrolling-down');
				}
			} else if (this.scrollPositionY > pageYOffset) {
				this.$el.removeClass('scrolling-down');
			}
			this.scrollPositionY = pageYOffset;
		},
		controls: {
			before: {
				href: '/menu',
				type: 'menu'
			},
			after: {
				type: 'network',
				href: '/drivers/network'
			}
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
		scrollInitialY: 40
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

	Views.AvailableMapSearch = Views.Navigation.extend({
		template: 'layouts/availableMapSearch',
		header: {
			title: 'Search'
		},
		controls: {
			before: {
				label: 'Cancel',
				href: '/bookings/available/map'
			}
		},
		footer: false
	});

	Views.Menu = Views.Navigation.extend({
		template: 'layouts/menu',
		header: {
			title: 'Menu'
		},
		controls: {
			after: {
				direction: 'next',
				href: 'javascript:history.back()',
				label: 'Back'
			}
		},
		footer: false
	});

	Views.Network = Views.Navigation.extend({
		template: 'layouts/network',
		header: {
			title: 'Network'
		},
		controls: {
			before: {
				direction: 'prev',
				href: 'javascript:history.back()',
				label: 'Back'
			}
		},
		footer: false
	});

	Views.Add = Views.Navigation.extend({
		template: 'layouts/add',
		header: {
			title: 'Add a Booking'
		},
		controls: {
			after: {
				label: 'Cancel',
				href: '/bookings/schedule'
			}
		},
		footer: false
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
