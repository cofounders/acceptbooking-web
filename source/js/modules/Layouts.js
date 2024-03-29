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
		scrollInitialY: 0,
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

	Views.Sticky = Views.Navigation.extend({
		scrollThresholdTop: 45,
		_scrollPositionY: 0,
		afterRender: function () {
			window.scrollTo(0, this.scrollInitialY + 1);
			window.scrollTo(0, this.scrollInitialY);
			this._scrollPositionY = this.scrollInitialY;
			$(window).off('scroll.navigation touchmove.navigation');
			$(window).on(
				'scroll.navigation touchmove.navigation',
				_.bind(this.scroll, this)
			);
		},
		cleanup: function () {
			$(window).off('scroll.navigation touchmove.navigation');
		},
		scroll: function () {
			var pageYOffset = window.pageYOffset;
			if (this._scrollPositionY < pageYOffset) {
				if (pageYOffset >= this.scrollThresholdTop) {
					this.$el.addClass('scrolling-down');
				}
			} else if (this._scrollPositionY > pageYOffset) {
				this.$el.removeClass('scrolling-down');
			}
			this._scrollPositionY = pageYOffset;
		}
	});

	Views.Assigned = Views.Sticky.extend({
		template: 'layouts/assigned',
		header: {
			title: 'Reassigned Jobs'
		}
	});

	Views.Schedule = Views.Sticky.extend({
		template: 'layouts/schedule',
		header: {
			title: 'My Schedule'
		},
		scrollInitialY: 40
	});

	Views.BookingDetails = Views.Navigation.extend({
		template: 'layouts/bookingDetails',
		header: {
			title: 'Booking Details'
		}
	});

	Views.AvailableCurrent = Views.Sticky.extend({
		template: 'layouts/availableCurrent',
		header: {
			title: 'Available Jobs'
		}
	});

	Views.AvailableAdvanced = Views.Sticky.extend({
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
			before: {
				label: 'Cancel',
				href: 'javascript:history.back()'
			},
			after: {
				label: 'Save',
				submit: 'booking'
			}
		},
		footer: false
	});

	Views.Login = Views.Navigation.extend({
		template: 'layouts/login',
		header: {
			title: 'Phone Number'
		},
		controls: {
			after: {
				label: 'Done',
				submit: 'login'
			}
		},
		footer: false
	});

	Views.Pin = Views.Navigation.extend({
		template: 'layouts/pin',
		header: {
			title: 'Verification'
		},
		controls: {
			before: {
				label: 'Cancel',
				href: '/login'
			},
			after: {
				label: 'Done',
				submit: 'pin'
			}
		},
		footer: false
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};

});
