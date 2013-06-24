define([
	'jquery', 'underscore', 'backbone', 'app',
	'modules/Session/Base'
], function ($, _, Backbone, app,
	Base
) {
	var Login = Backbone.Model.extend({
		initialize: function (options) {
			this.options = options;
		},
		url: function () {
			return app.api('drivers/login/' +
				'?phone=:phone' +
				'&pin=:pin' +
				'&cnonce=:cnonce',
				this.options
			);
		}
	});

	var Logout = Backbone.Model.extend({
		url: function () {
			return app.api('drivers/logout/');
		}
	});

	var backboneSync = Backbone.sync;

	var saveToken = function (data) {
		var session = app.session;
		var api_key = data.api_key;
		if (typeof api_key !== 'undefined' &&
			session.get('api_key') !== api_key
		) {
			session.save({
				api_key: api_key
			});
		}
	};

	Backbone.sync = function (method, model, options) {
		model.once('request', function (model, xhr, options) {
			xhr
				// Save session token on response
				.done(function (data) {
					saveToken(data);
				})
				// App-wide global error handlers
				.fail(function (xhr, status, error) {
					if (+xhr.status === 401) {
						// Automatically sign out on expired token,
						// to trigger fetching a new token.
						app.session.signOut();
					}
				});
		});

		// Pass session token in request
		options = options || {};
		if (method === 'read') {
			// Adds token as query param in GET request
			options.data = _.defaults({
				api_key: app.session.get('api_key')
			}, options.data || {});
		} else {
			// JSON in other requests, not yet implemented in API
			options.attrs = _.defaults({
				api_key: app.session.get('api_key')
			}, model.toJSON(options), options.attrs || {});
		}

		return backboneSync.call(this, method, model, options);
	};

	var session = Base.extend({
		signIn: function (options) {
			var that = this;
			options = options || {};
			var success = options.success || $.noop;
			var error = options.error || $.noop;

			var account = new Login(
				_.pick(options, 'phone', 'pin', 'cnonce')
			);

			account.save({}, {
				success: function (model, res) {
					saveToken(res);

					that.save(account.toJSON(), {
						success: function () {
							that.trigger('signIn');
							success();
						},
						error: error
					});
				},
				error: error
			});
		},
		signOut: function (options) {
			options = options || {};
			var success = options.success || $.noop;

			if (this.has('api_key')) {
				this.destroy();
				this.clear();
				this.trigger('signOut');

				if (options.trigger === false) {
					var account = new Logout({}, {});
					account.save();
				}
			}
			success();
		},
		getAuthStatus: function (options) {
			options = options || {};
			var success = options.success || $.noop;
			var error = options.error || $.noop;

			if (this.has('api_key')) {
				success();
			} else {
				error();
			}
		}
	});

	return session;
});
