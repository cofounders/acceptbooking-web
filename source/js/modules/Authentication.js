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
			var country = this.$el.find('[name="country"]').val();
			var phone = this.$el.find('[name="phone"]').val();
			var cnonce =this.$el.find('[name="cnonce"]').val();
			app.router.navigate(
				'login/pin/' + cnonce + '/' + country + '/' + phone, {
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
				cnonce: this.options.cnonce,
				phone: '+' + this.options.country + ' ' +
					this.options.phone
			};
		},
		events: {
			'submit': 'login'
		},
		login: function (event) {
			event.preventDefault();
			var cnonce = this.$el.find('[name="cnonce"]').val();
			var pin = this.$el.find('[name="pin"]').val();
			app.session.signIn({
				cnonce: cnonce,
				phone: this.options.country + this.options.phone,
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
