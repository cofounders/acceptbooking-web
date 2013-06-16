define(
[
	'jquery', 'underscore', 'handlebars', 'backbone',
	'app',
	'router',
	'templates.built',
	'modules/Session/Base',
	'modules/Notifications',
	'helpers/currency',
	'fastclick'
],
function (
	$, _, Handlebars, Backbone,
	app,
	Router,
	templatesBuilt,
	Session,
	Notifications,
	currency,
	FastClick
) {
	var JST = window.JST = _.extend(window.JST || {}, templatesBuilt);

	Backbone.Layout.configure({
		el: false,
		manage: true,
		prefix: '/templates/',
		fetch: function (path) {
			var prefix = Backbone.Layout.prototype.getAllOptions().prefix,
				bare = path.substr(prefix.length);

			if (JST[bare]) { return JST[bare]; }

			var done = this.async();
			$.get(path + '.html', function (response) {
				JST[bare] = Handlebars.compile(response);
				done(JST[bare]);
			}, 'text');
		}
	});

	$(function() {
		FastClick.attach(document.body);
	});

	Handlebars.registerHelper('$', currency);

	app.router = new Router();

	app.notifications = new Notifications.Models.Aggregator();

	app.session = new Session();
	app.session.on('signOut', function () {
		app.router.navigate('/', {trigger: true});
	});

	Backbone.history.start({
		pushState: true,
		root: app.root
	});

	$(document).ajaxError(function (event, request, settings, exception) {
		if (+request.status === 403 && settings.url.indexOf(app.api) !== -1) {
			// app.session.signOut();
			console.log('AJAX Error', exception);
		}
	});

	$(document).on('click', 'a:not([data-bypass])', function (event) {
		var href = $(this).prop('href'),
			baseURI = location.href.substr(0, location.href.indexOf('/', 8)),
			root = baseURI + app.root,
			isInternalLink = function (href, root) {
				return href && href.slice(0, root.length) === root;
			},
			holdingModifierKey = function (event) {
				return event.altKey ||
					event.ctrlKey ||
					event.metaKey ||
					event.shiftKey;
			};
		if (isInternalLink(href, root) && !holdingModifierKey(event)) {
			event.preventDefault();
			Backbone.history.navigate(href.slice(root.length), true);
		}
	});

	$(document).on('click', 'a.disabled, a[href="#"]', function (event) {
		event.preventDefault();
	});
});
