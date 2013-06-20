define(['jquery', 'underscore', 'backbone', 'app'
], function ($, _, Backbone, app
) {
	var Models = {};
	var Collections = {};
	var Views = {};

	Views.Login = Backbone.View.extend({
		template: 'authentication/login',
		initialize: function (options) {
			this.options = options;
		},
		afterRender: function () {
			this.updateCode();
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
			var country = this.$el.find('[name="country"]').val();
			var phone = this.$el.find('[name="phone"]').val();
			app.router.navigate('login/pin/' + country + '/' + phone, {
				trigger: true
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
				phone: '+' + this.options.country + ' ' +
					this.options.phone
			};
		},
		events: {
			'submit': 'login'
		},
		login: function (event) {
			event.preventDefault();
			var pin = this.$el.find('[name="pin"]').val();
			app.session.signIn({
				country: this.options.country,
				phone: this.options.phone,
				pin: pin
			});
		}
	});

	return {
		Models: Models,
		Collections: Collections,
		Views: Views
	};

});
