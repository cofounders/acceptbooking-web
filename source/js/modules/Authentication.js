define(['jquery', 'underscore', 'backbone', 'app'
], function ($, _, Backbone, app
) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Models.Pin = Backbone.Model.extend({
		url: function () {
			return app.api('drivers/login/pin/');
		}
	});

	Views.Login = Backbone.View.extend({
		template: 'authentication/login',
		initialize: function (options) {
			this.options = options;
		},
		afterRender: function () {
			this.updateCode();
		},
		serialize: function () {
			return {
				cnonce: Math.floor(Math.random() * Math.pow(2, 53))
			};
		},
		events: {
			'submit': 'pin',
			'change [name="country"]': 'updateCode'
		},
		updateCode: function (event) {
			var country = this.$el.find('[name="country"]').val();
			this.$el.find('[name="code"]').val('+' + country);
		},
		pin: function (event) {
			event.preventDefault();
			var that = this;
			var country = this.$el.find('[name="country"]').val();
			var phone = this.$el.find('[name="phone"]').val();
			var cnonce = this.$el.find('[name="cnonce"]').val();

			var pin = new Models.Pin({
				cnonce: cnonce,
				networks: [app.defaultNetwork],
				phone: '+' + country + phone
			});
			pin.save(null, {
				success: function () {
					app.router.navigate(
						'login/pin/' + cnonce + '/' + country + '/' + phone, {
						trigger: true
					});
				},
				error: function () {
					that.$el.addClass('error');
				}
			});
		}
	});

	Views.Pin = Backbone.View.extend({
		template: 'authentication/pin',
		initialize: function (options) {
			this.options = options;
		},
		serialize: function () {
			return {
				cnonce: this.options.cnonce,
				phone: '+' + this.options.country +
					this.options.phone
			};
		},
		events: {
			'submit': 'login'
		},
		login: function (event) {
			event.preventDefault();
			var that = this;
			var cnonce = this.$el.find('[name="cnonce"]').val();
			var pin = this.$el.find('[name="pin"]').val();
			this.$el.removeClass('error');
			app.session.signIn({
				cnonce: cnonce,
				phone: '+' + this.options.country +
					this.options.phone,
				pin: pin,
				success: function () {
					app.router.navigate('/bookings/schedule', {
						trigger: true
					});
				},
				error: function () {
					that.$el.find('[name="pin"]').val('');
					that.$el.addClass('error');
				}
			});
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};

});
